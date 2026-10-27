# Venturo Skeleton (React)

Frontend skeleton untuk produk multi-tenant Venturo, dibangun di atas **Minimals MUI starter (v7.6.1)**. Dipakai sebagai base/starter untuk membangun fitur baru dengan pola yang sudah terstandarisasi (auth JWT multi-company, CRUD dialog, tabel, i18n, dll).

**Stack:** Vite 7 · React 19 · React Router 7 (data router) · MUI v7 + Emotion · React Hook Form + Zod · Axios · i18next · Firebase (Web SDK). Tanpa Redux / SWR / React Query — state cukup local + React Context.

---

## Demo login

```
Email    : owner@gmail.com
Password : Bismillah1407*
```

Backend default mengarah ke `VITE_SERVER_URL`. Untuk dev lokal, arahkan ke backend Venturo yang berjalan (default `http://localhost:8080`). Kalau backend belum tersedia, set `CONFIG.auth.skip = true` di [src/shared/config/index.ts](src/shared/config/index.ts) untuk bypass `AuthGuard`.

---

## Prasyarat

- **Node.js ≥ 22.12** (lihat `engines` di [package.json](package.json))
- **Yarn v1** (`yarn@1.22.22`) sebagai package manager

## Instalasi & menjalankan

```sh
yarn install
yarn hooks          # sekali per clone: hook commit-msg (format commit review Kinerja)
git config kinerja.base origin/production   # branch tujuan PR, dipakai lint:changed & cek PR
yarn dev            # Vite dev server di http://localhost:8081
```

Detail setup: [docs/guides/local-development.md](docs/guides/local-development.md).

Dev server jalan di **port 8081** (lihat [vite.config.ts](vite.config.ts)) dan menampilkan overlay TypeScript + ESLint checker di pojok kiri-atas.

## Skrip yang tersedia

| Skrip                             | Fungsi                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `yarn dev`                        | Start Vite dev server (in-process TS + ESLint checker)                                                     |
| `yarn build`                      | `tsc` (typecheck) lalu `vite build`                                                                        |
| `yarn start`                      | `vite preview` atas hasil build                                                                            |
| `yarn typecheck`                  | `tsc --noEmit`                                                                                             |
| `yarn tsc:watch` / `yarn tsc:dev` | Type-check watch mode (pasangkan dengan dev)                                                               |
| `yarn test` / `yarn test:watch`   | Vitest + Testing Library (jsdom), sekali jalan / watch                                                     |
| `yarn lint:changed [BASE]`        | ESLint `--max-warnings 0` + Prettier hanya pada file `src/` yang berubah sejak `BASE` — yang dijalankan CI |
| `yarn lint` / `yarn lint:fix`     | ESLint atas `src/**/*.{js,jsx,ts,tsx}`; ambang review Kinerja tampil sebagai warning                       |
| `yarn fm:check` / `yarn fm:fix`   | Prettier check / write                                                                                     |
| `yarn fix:all`                    | `lint:fix` + `fm:fix`                                                                                      |
| `yarn check:changelog [BASE]`     | Gagal kalau kode aplikasi berubah tanpa entri di [CHANGELOG.md](CHANGELOG.md)                              |
| `yarn check:doc-sync [BASE]`      | Gagal kalau `api/`, `services/`, atau `endpoints` berubah tanpa update [docs/api/](docs/api/README.md)     |
| `yarn check:all`                  | `lint:changed` + `typecheck` + `test` + `check:changelog` + `check:doc-sync` (sama dengan CI)              |
| `yarn hooks`                      | Pasang `.githooks/commit-msg`: subject Conventional Commit + kode issue Space `[KODE-123]`                 |
| `yarn re:dev` / `yarn re:build`   | Bersihkan `node_modules`/`dist`, reinstall, lalu dev/build                                                 |

`BASE` default: `git config kinerja.base`, lalu `origin/HEAD`, lalu `origin/production`.

---

## Konfigurasi (environment)

Env di-_inline_ oleh Vite saat build time. File:

- **`.env`** — dipakai saat dev (default mengarah ke backend lokal)
- **`.env.prod`** — env produksi (`COPY .env.prod .env` saat build image)

Variabel yang dibaca (lihat [src/shared/config/index.ts](src/shared/config/index.ts)):

| Variabel                    | Keterangan                                                                   |
| --------------------------- | ---------------------------------------------------------------------------- |
| `VITE_SERVER_URL`           | Base URL backend untuk shared axios instance                                 |
| `VITE_ASSETS_DIR`           | Base path untuk assets                                                       |
| `VITE_FIREBASE_API_KEY`     | Firebase Web SDK — API key                                                   |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain                                                         |
| `VITE_FIREBASE_PROJECT_ID`  | Firebase project id — **wajib sama** dengan `FIREBASE_PROJECT_ID` di backend |

`CONFIG` (di [src/shared/config/index.ts](src/shared/config/index.ts)) membungkus env + metadata aplikasi:

- `appName: 'Tuai'`, `appVersion` dari `package.json`
- `auth.method: 'jwt'`, `auth.skip` (bypass guard), `auth.redirectPath` (default ke dashboard root)
- `firebase.*`

---

## Struktur folder

```
.
├── public/                     # static assets, favicon, logo
├── docs/                       # standar & pattern internal (BACA sebelum bikin fitur)
│   ├── CONVENTIONS.md          # ringkasan aturan main (always relevant)
│   └── patterns/               # deep-dive per topik (table, dialog-crud, i18n, dll)
├── index.html                  # entry HTML Vite
├── vite.config.ts              # config Vite (port 8081, alias src/, checker)
├── tsconfig.json               # baseUrl "." → import via `src/...`
├── eslint.config.mjs           # ESLint flat config (strict import ordering)
├── Dockerfile / nginx.conf     # build & serve produksi
└── src/
    ├── main.tsx                # bootstrap createBrowserRouter + <App>
    ├── app.tsx                 # rangkai providers global
    ├── global.css
    ├── _mock/                  # data mock sisa starter (tidak dipakai di fitur)
    ├── assets/                 # ilustrasi, ikon
    ├── theme/                  # MUI theme (core, overrides, with-settings)
    ├── layouts/                # auth-split, dashboard, simple + nav-config
    ├── locales/                # i18next + JSON per bahasa (id default, en)
    │   └── langs/{id,en}/*.json  # namespace per fitur
    ├── routes/
    │   ├── paths.ts            # SEMUA path terpusat — referensi via paths.*
    │   └── sections/           # auth.tsx, dashboard.tsx, index.tsx
    ├── shared/                 # cross-cutting: api, config, constants,
    │   │                       #   hooks, lib (axios), types, ui, utils
    │   └── lib/axios.ts        # single axios instance + endpoints
    └── module/                 # domain modules
        ├── core/features/      # cross-cutting features
        │   ├── auth/           # JWT multi-company (sumber kebenaran auth)
        │   ├── settings/       # settings drawer + context
        │   ├── home/           # halaman home/landing dashboard
        │   ├── users/          # CRUD users
        │   ├── roles/          # CRUD roles + permissions
        │   ├── branches/       # CRUD branches
        │   ├── audit-log/      # audit log
        │   ├── translation-override/  # override label i18n dari BE
        │   └── error/          # error pages / boundary
        └── dashboard/          # komponen & util dashboard (kpi-card, format)
```

### Anatomi sebuah feature

Tiap `module/<domain>/features/<feature>/` mengikuti bentuk konsisten:

```
api/         # pemanggilan endpoint + unwrap envelope
components/  # komponen UI khusus fitur
context/     # React context fitur (bila perlu)
guard/       # guard khusus (mis. permission)
hooks/       # custom hooks
pages/       # route leaf yang di-lazy-load (tipis)
types/       # tipe TS
views/       # body halaman (page tetap tipis, logic di sini)
```

---

## Arsitektur singkat

### Path alias

Import selalu pakai `src/...` (resolusi lewat alias Vite + `baseUrl` TS), bukan relatif `../../../`.

### Routing

- Entry [src/main.tsx](src/main.tsx) membangun `createBrowserRouter` dari `routesSection` ([src/routes/sections/index.tsx](src/routes/sections/index.tsx)), dibungkus `<App>`, dengan `ErrorBoundary` sebagai `errorElement`.
- Section dipisah: [auth.tsx](src/routes/sections/auth.tsx) & [dashboard.tsx](src/routes/sections/dashboard.tsx). Pages di-`lazy()` di dalam `<Suspense>`.
- Semua path terpusat di [src/routes/paths.ts](src/routes/paths.ts) — tambahkan route di sana dan referensi via `paths.*`. Root `/` redirect ke `CONFIG.auth.redirectPath`.

### App shell

[src/app.tsx](src/app.tsx) merangkai provider dengan urutan:
`I18nProvider → AuthProvider → SettingsProvider → ThemeProvider → LocalizationProvider → MotionLazy`, plus `<ProgressBar>`, `<SettingsDrawer>`. Overlay/provider global baru ditaruh di sini.

### Auth (JWT + multi-company)

[auth-provider.tsx](src/module/core/features/auth/context/jwt/auth-provider.tsx) adalah sumber kebenaran:

- Access token di `sessionStorage` (`tuai.access_token`), refresh token di `localStorage` (`tuai.refresh_token`).
- `checkUserSession` membaca token, refresh bila `exp` lewat (decode base64 JWT, tanpa lib), lalu hydrate via `GET /core/v1/auth/me`.
- State mencakup `user`, `company`, `client`, `roles`, `permissions`, `isSuperAdmin`. **Multi-company first-class** — `switchCompany(companyId)` minta token pair baru yang scoped ke company tersebut.
- Endpoint auth ada di [src/shared/lib/axios.ts](src/shared/lib/axios.ts) (`endpoints.auth.*`), base path `/core/v1/auth/*`.

### Shared axios

Satu instance ([src/shared/lib/axios.ts](src/shared/lib/axios.ts)) dengan request interceptor (attach Bearer), response interceptor (retry sekali setelah refresh pada 401, deduped), normalisasi error ke `Error` dengan `.status`. Jangan bikin client axios lain — extend yang ini.

### Guards

Tiga guard composable di [auth/guard/](src/module/core/features/auth/guard/): `AuthGuard`, `GuestGuard`, `PermissionGuard`. Untuk gating UI by permission, pakai `PermissionGuard` atau `usePermission()`.

### Layouts

[src/layouts/](src/layouts/): `auth-split` (sign-in/up), `dashboard` (shell utama + nav), `simple`. Route disusun `<Guard><Layout><SuspenseOutlet /></Layout></Guard>`.

### Internationalization (i18n)

i18next + react-i18next, JSON lazy-loaded dari [src/locales/langs/{id,en}/](src/locales/langs/). Bahasa `en` (fallback) dan `id`, pilihan user persist via `localStorage.i18nextLng`. **Jangan hardcode string** — pakai `useTranslate('<namespace>')`; satu namespace JSON per fitur.

---

## Standar & pola internal

Sebelum membuat fitur baru atau mengubah pola, baca [docs/](docs/):

- [docs/CONVENTIONS.md](docs/CONVENTIONS.md) — ringkasan aturan main
- [docs/patterns/](docs/patterns/) — deep-dive: `feature-module`, `table`, `dialog-crud`, `multiline-form`, `api-layer`, `form-fields`, `date-range-picker`, `attachments`, `approval-audit`, `reference-data`, `i18n`, `reports`
- [docs/architecture.md](docs/architecture.md) — arsitektur (routing, auth, axios, i18n, lint & test)
- [docs/api/](docs/api/README.md) — endpoint backend yang dipanggil FE, per fitur
- [docs/guides/](docs/guides/) — development lokal dan cara menambah fitur
- [CLAUDE.md](CLAUDE.md) + [.claude/rules/](.claude/rules/) — perintah, konvensi, standar review Kinerja, dan delegasi sub-agent untuk Claude Code
- [CHANGELOG.md](CHANGELOG.md) — perubahan per rilis

Konvensi ESLint penting ([eslint.config.mjs](eslint.config.mjs)): import ordering strict (`perfectionist/sort-imports`), `import type` untuk type-only. Jalankan `yarn lint:fix` setelah edit, jangan sortir manual.

---

## Build & deploy

```sh
yarn build          # tsc --noEmit (typecheck) + vite build → dist/
```

Tersedia [Dockerfile](Dockerfile) + [nginx.conf](nginx.conf) untuk build image dan serve `dist/` via nginx. Saat build produksi, `.env.prod` disalin menjadi `.env` agar di-inline Vite.
