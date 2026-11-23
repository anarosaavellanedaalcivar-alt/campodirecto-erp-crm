# CampoDirecto — ERP + CRM Inteligente Agrícola de Ecuador

Ecosistema digital para la comercialización agrícola nacional e internacional, importaciones, exportaciones, trazabilidad, gestión ERP y CRM con enfoque en productores ecuatorianos (incluyendo Carchi / Tulcán y demás zonas productoras del país).

> **Nota de transparencia:** Los precios, operaciones comerciales, hashes de trazabilidad y métricas del entorno inicial son **datos demostrativos / simulación** para pruebas y validación funcional.

## Estructura de Carpetas en GitHub Desktop

```text
campodirecto-erp-crm/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── data/
│   │   └── initialData.ts
│   ├── types/
│   │   └── types.ts
│   └── App.tsx
├── package.json
├── vite.config.ts
└── README.md
```

## Pasos con GitHub Desktop

1. Crea o abre el repositorio local `campodirecto-erp-crm` en **GitHub Desktop**.
2. Coloca cada archivo descargado en su carpeta correspondiente (`package.json` y `vite.config.ts` en la raíz; `deploy.yml` en `.github/workflows/deploy.yml`; `types.ts`, `initialData.ts` y `App.tsx` dentro de `src/`).
3. Abre la terminal desde GitHub Desktop (`Repository` > `Open in Command Prompt / Terminal`) y ejecuta:
   ```bash
   npm install
   npm run dev
   ```
4. En **GitHub Desktop**, escribe un mensaje de commit, haz clic en **Commit to main** y luego en **Push origin**.
5. En GitHub.com, entra a **Settings** > **Pages** > **Source** y selecciona **GitHub Actions** para publicar automáticamente en:
   `https://<tu-usuario>.github.io/campodirecto-erp-crm/`