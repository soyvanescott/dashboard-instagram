# Dashboard de Instagram (versión en español)

Panel de métricas de Instagram. JavaScript sin framework, Chart.js, IndexedDB para el historial, funciones serverless de Vercel como proxy a la Graph API.

- `index.html` + `js/wizard.js`: asistente para conectar el token
- `dashboard.html` + `js/dashboard-main.js`: panel principal
- `js/api.js`: llamadas a graph.instagram.com a través de `/api/proxy`
- `js/metrics.js`: cálculo de métricas y mapa de calor
- `js/ui.js`: tarjetas, gráficos y recomendaciones
- `js/pdf-report.js`: reporte A4
- `api/`: proxy, avatar, análisis con IA (opcional) y configuración

Textos de la interfaz en español latino neutro, de tú. El token de Instagram vive solo en el navegador de la usuaria (localStorage).
