# Dashboard de Instagram

Tu panel de métricas de Instagram con la API oficial de Meta: seguidores, alcance, interacción, reels, historias, audiencia y el mejor horario para publicar. Funciona desde el navegador y se puede instalar como app en el celular.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU_USUARIO/dashboard-instagram&project-name=dashboard-instagram)

## Para tenerlo

1. Crea una cuenta gratis en GitHub (github.com).
2. Haz clic en el botón **Deploy** de arriba, entra a Vercel con tu cuenta de GitHub y toca **Create**.
3. Saca tu token de Instagram en Meta for Developers.
4. Abre tu dashboard y pega el token.

La guía paso a paso está en la comunidad de Emprendedoras Magnéticas.

## Requisitos

- Cuenta de Instagram profesional (empresa o creador), vinculada a Facebook.
- El token dura 60 días. El dashboard avisa cuando está por vencer.
- Los datos de audiencia aparecen desde los 100 seguidores.
- El historial se guarda en el navegador donde abres el dashboard.

## Opcional

- **Análisis con IA:** agrega en Vercel la variable `ANTHROPIC_API_KEY` con una clave de console.anthropic.com. Usa créditos de tu cuenta de Anthropic.
- **Historial en la nube (Supabase):** no lo recomendamos para empezar. Si lo activas, el token de Instagram queda guardado en tu base de datos.

## Skills incluidas

En la carpeta `skills/` hay dos skills para Claude: `reporte-mensual-instagram` y `plan-de-accion-instagram`. Exporta el HTML desde el dashboard y pídele a Claude el reporte del mes y después el plan de acción.

## Créditos

Adaptación al español de Vanessa Scott para Emprendedoras Magnéticas, basada en el Instagram Dashboard del Clube Divos da IA. Licencia MIT.
