# KoolControl

Static web application for controlling a KoolNova system from desktop, mobile, and an installable PWA.

## Requirements

- Node.js 22
- npm

## Scripts

```bash
npm install
npm run dev
npm run test
npm run build
npm run preview
```

`npm run build` writes the site to `dist`. Publish that directory. `public/_redirects` sends every route to `index.html` with HTTP 200 so the client-side router works on static hosts that support this file.

## API and session

The application calls `https://api.koolnova.com`. The access token is stored in `localStorage` under `koolcontrol_token`.
