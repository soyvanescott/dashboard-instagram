# Dashboard de Instagram · Plantilla para alumnas

Proyecto educativo basado en el dashboard de Instagram de Vanessa Scott / Emprendedoras Magnéticas. Conserva el diseño y funcionalidades de la rama original, con conexión individual mediante token.

## Instalación sin programar

1. Descarga el ZIP de esta rama y **descomprímelo**.
2. Abre GitHub, crea un repositorio nuevo y sube los **archivos de dentro** de la carpeta (no el ZIP). Es importante incluir `api/`, `css/` y `js/`.
3. En Vercel, elige **Add New > Project > Import Git Repository**, selecciona tu repositorio y despliega usando la configuración predeterminada (sin framework, directorio raíz).
4. Abre el enlace HTTPS que te da Vercel.
5. Sigue el asistente del dashboard para generar tu token personal en Meta for Developers y conectar una cuenta profesional de Instagram.
6. Vuelve a cargar si el navegador muestra archivos antiguos. Los datos de audiencia y algunas métricas dependen de los permisos y la disponibilidad de la API.

**No pegues tu token en GitHub, ni en capturas, mensajes o variables públicas de Vercel.** El token se introduce exclusivamente en el asistente del dashboard. No configures `INSTAGRAM_TOKEN` ni `INSTAGRAM_USER_ID` en Vercel.

## Requisitos

- GitHub y Vercel; cuentas propias.
- Instagram profesional y permisos de API autorizados por Meta.
- Token personal vigente y conexión HTTPS.
- La API puede limitar métricas, periodos y datos de audiencia.

## Opcionales y límites

- Análisis con IA: solo si la alumna configura su propia clave `ANTHROPIC_API_KEY` **en el servidor de Vercel**; puede generar cargos por uso.
- Esta plantilla **no activa Supabase**: guarda token e historial en el navegador local. Usa un navegador/dispositivo propio; evita computadoras compartidas. Si borras datos del sitio, se borra la conexión local.
- El token se envía por HTTPS a la función del propio despliegue y de allí a la API de Meta. No se coloca en los parámetros URL del navegador.
- La configuración de permisos y pantallas de Meta puede cambiar, por lo que los pasos de generación del token deben confirmarse en la documentación oficial.
- No se ha realizado una prueba de integración en una cuenta nueva de Meta desde esta plantilla.

## Métricas de engagement

- **Perfil (por alcance):** interacciones totales / cuentas alcanzadas × 100.
- **Publicaciones:** promedio de la tasa de cada publicación con alcance disponible; posts sin alcance no entran en ese promedio.
- No compares estas tasas como si midieran exactamente lo mismo.

## Si ves el dashboard en blanco

- Comprueba que subiste las carpetas `api`, `css`, `js` y los HTML.
- Revisa el despliegue en Vercel y abre su URL HTTPS, no `file://`.
- Si el token caducó, genera otro y vuelve a conectar.
- Haz una actualización completa de la página. Si la app instalable guarda una versión antigua, elimina su caché.

## Créditos

Adaptación de Vanessa Scott para Emprendedoras Magnéticas, basada en el Instagram Dashboard del Clube Divos da IA. Conserva la licencia del repositorio original.
