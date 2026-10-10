import { isConfigured, loadServerConfig, saveAccount, getAccounts, syncFromCloud } from './storage.js';
import { validateToken } from './api.js';
import { initSupabase } from './supabase-client.js';

const isAddMode = new URLSearchParams(location.search).get('add') === '1';

const brandIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16v-5M12 16V7M17 16v-3"/></svg>`;
const lockIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`;

loadServerConfig().then(async () => {
  await initSupabase();
  await syncFromCloud();
  if (!isAddMode && isConfigured()) window.location.href = 'dashboard.html';
});

const STEPS = [
  {
    title: 'Crea una app en Meta for Developers',
    desc: 'Es gratis y se hace una sola vez.',
    instructions: `<ol>
      <li>Entra a <strong>developers.facebook.com</strong></li>
      <li>Inicia sesión con tu cuenta de Facebook</li>
      <li>Haz clic en <strong>"Mis apps"</strong> en el menú de arriba</li>
      <li>Haz clic en <strong>"Crear app"</strong></li>
      <li>Elige el tipo <strong>"Negocios"</strong> (Business)</li>
      <li>Ponle un nombre (por ejemplo "Mi Dashboard")</li>
      <li>Elige o crea un <strong>portfolio comercial</strong> y haz clic en Crear</li>
    </ol>`,
  },
  {
    title: 'Activa el acceso a Instagram',
    desc: 'Conecta tu cuenta de Instagram a la app.',
    instructions: `<ol>
      <li>En el panel de la app, en el menú de la izquierda, entra a <strong>"Instagram"</strong> → <strong>"API setup with Instagram business login"</strong></li>
      <li>Acepta las condiciones si te lo pide</li>
      <li>Vas a ver la lista de cuentas de Instagram conectadas</li>
    </ol>`,
  },
  {
    title: 'Genera tu token',
    desc: 'El token es la llave que le permite al dashboard leer tus métricas.',
    instructions: `<ol>
      <li>En la página <strong>"API setup with Instagram business login"</strong></li>
      <li>Busca tu cuenta de Instagram en la lista</li>
      <li>Haz clic en <strong>"Generate token"</strong> al lado de tu cuenta</li>
      <li>Inicia sesión en Instagram cuando te lo pida</li>
      <li>Acepta los permisos:
        <ul>
          <li><code>instagram_business_basic</code></li>
          <li><code>instagram_business_manage_insights</code></li>
        </ul>
      </li>
      <li>Copia el token (empieza con <code>IGAA</code>)</li>
    </ol>
    <p style="margin-top: 8px; font-size: 12px; color: var(--text-secondary);">
      <strong>Nota:</strong> el token dura 60 días. El dashboard te avisa cuando esté por vencer.
    </p>`,
  },
  {
    title: 'Conecta tu dashboard',
    desc: 'Pega tu token para conectar.',
    hasTokenInput: true,
  },
];

let currentStep = 0;
const isFileProtocol = window.location.protocol === 'file:';

function render() {
  const wizard = document.getElementById('wizard');

  const fileWarning = isFileProtocol ? `<div class="status visible warning" style="margin-bottom: 16px;">
    <strong>Aviso:</strong> abriste el archivo directamente (file://) y así no funciona. Usa el link de Vercel de tu dashboard.
  </div>` : '';

  const progressItems = STEPS.map((_, i) => {
    let stateClass;
    if (i < currentStep) stateClass = 'completed';
    else if (i === currentStep) stateClass = 'active';
    else stateClass = 'pending';

    const circle = `<div class="wizard-step-indicator ${stateClass}">${i + 1}</div>`;
    const line = i < STEPS.length - 1 ? '<div class="wizard-step-line"></div>' : '';
    return circle + line;
  }).join('');

  const stepsHTML = STEPS.map((step, i) => {
    const isActive = i === currentStep;
    let bodyHTML;

    if (step.hasTokenInput) {
      bodyHTML = `
        <div class="input-group">
          <label class="input-label">Tu token</label>
          <input type="password" class="input-field" id="tokenInput" autocomplete="off" spellcheck="false" placeholder="Pega tu token aquí (empieza con IGAA...)">
          <span class="input-hint">El token empieza con "IGAA" y tiene unos 200 caracteres</span>
        </div>
        <div class="wizard-secure-note">${lockIcon}<span>Tu token se utiliza para consultar tus métricas y nunca se muestra dentro del dashboard.</span></div>
        <div class="status" id="wizardStatus"></div>`;
    } else {
      bodyHTML = `<div class="wizard-instructions">${step.instructions}</div>`;
    }

    return `
      <div class="wizard-step${isActive ? ' active' : ''}">
        <div class="wizard-step-title">${step.title}</div>
        <div class="wizard-step-desc">${step.desc}</div>
        ${bodyHTML}
      </div>`;
  }).join('');

  const prevBtn = currentStep > 0
    ? '<button class="btn" id="btnPrev">Atrás</button>'
    : '';

  const actionBtn = currentStep < 3
    ? '<button class="btn btn-primary" id="btnNext">Siguiente</button>'
    : '<button class="btn btn-primary btn-lg" id="btnConnect">Conectar</button>';

  wizard.innerHTML = `
    ${fileWarning}
    <div class="wizard-header">
      <div class="wizard-brand">${brandIcon}</div>
      <div class="wizard-eyebrow">Estrategia basada en datos</div>
      <h1 class="wizard-title">Tu dashboard de Instagram</h1>
      <p class="wizard-subtitle">${isAddMode ? 'Agrega otra cuenta a tu panel central.' : 'Conecta tu cuenta en cuatro pasos y transforma tus métricas en decisiones de contenido.'}</p>
    </div>
    <div class="wizard-progress">
      ${progressItems}
    </div>
    ${stepsHTML}
    <div class="wizard-nav">
      ${prevBtn}
      ${actionBtn}
      ${isAddMode ? '<button class="btn" id="btnCancelAdd">Cancelar</button>' : ''}
    </div>`;

  document.getElementById('btnPrev')?.addEventListener('click', () => { currentStep--; render(); });
  document.getElementById('btnNext')?.addEventListener('click', () => { currentStep++; render(); });
  document.getElementById('btnConnect')?.addEventListener('click', handleConnect);
  document.getElementById('btnCancelAdd')?.addEventListener('click', () => { window.location.href = 'dashboard.html'; });
}

async function handleConnect() {
  const input = document.getElementById('tokenInput');
  const status = document.getElementById('wizardStatus');
  const btn = document.getElementById('btnConnect');
  const token = input.value.trim();

  if (!token.startsWith('EAA') && !token.startsWith('IGAA')) {
    status.className = 'status visible error';
    status.textContent = 'Ese token no es válido. Tiene que empezar con "IGAA" o "EAA". Revisa que lo hayas copiado completo.';
    return;
  }

  btn.disabled = true;
  status.className = 'status visible warning';
  status.textContent = 'Verificando el token...';

  try {
    const result = await validateToken(token);

    // Save as a named account
    const account = {
      id: Date.now().toString(),
      label: `@${result.username}`,
      token,
      userId: result.userId,
      username: result.username,
      profilePicture: result.profilePicture || null,
      tokenCreated: new Date().toISOString(),
    };
    saveAccount(account);
    localStorage.setItem('ig_active_account', account.id);

    status.className = 'status visible success';
    status.textContent = `¡Conectado! Cuenta: @${result.username}`;

    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
  } catch (err) {
    btn.disabled = false;
    status.className = 'status visible error';
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      status.textContent = 'Error de conexión. Revisa que tu dashboard esté publicado en Vercel (pestaña Deployments en verde) y vuelve a intentar.';
    } else {
      status.textContent = `Error: ${err.message}`;
    }
  }
}

render();
