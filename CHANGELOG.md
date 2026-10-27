# Changelog

Semua perubahan penting di repo ini dicatat di sini. Formatnya mengikuti
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Setiap PR yang mengubah kode aplikasi
(`src/` selain test, `package.json`, `vite.config.ts`, `index.html`, `nginx.conf`, `Dockerfile`)
menambah entri di `## [Unreleased]` (dicek `yarn check:changelog`).

## [Unreleased]

### Added

- Ambang review Kinerja di `eslint.config.mjs` (berlevel `warn`): `max-lines-per-function` 50
  (baris kosong dan komentar ikut dihitung), `complexity` 10, `max-depth` 4, `max-params` 5,
  `max-lines` 800 (300 untuk `.tsx`/`.jsx`), `@typescript-eslint/no-magic-numbers` (kecuali test,
  `src/theme`, `src/_mock`, config), `sonarjs/no-identical-functions`,
  `sonarjs/no-duplicate-string`, dan `no-console` (kecuali `warn`/`error`).
- `yarn lint:changed` (`scripts/lint-changed.sh`): ESLint `--max-warnings 0` dan Prettier hanya
  pada file `src/` yang berubah sejak base. Base dari argumen/env `BASE`, lalu
  `git config kinerja.base`, lalu `origin/HEAD`, lalu `origin/production`.
- Test runner Vitest + jsdom + Testing Library (`yarn test`, `yarn test:watch`, `vitest.config.ts`)
  dengan helper `src/test/` (fake backend di adapter axios, render dengan provider aplikasi) dan
  test untuk `usePermission`, util token JWT, sesi `AuthProvider` + refresh 401 axios, serta form
  login `JwtSignInView`.
- `yarn typecheck`, `yarn check:changelog`, `yarn check:doc-sync`, `yarn check:all`, dan `yarn hooks`.
- `scripts/check-changelog.sh`: gagal bila kode aplikasi berubah tanpa entri di `CHANGELOG.md`.
- `scripts/check-doc-sync.sh`: gagal bila `api/`, `services/`, atau `endpoints` berubah tanpa
  update `docs/api/`, atau bila dokumen API berubah tanpa penanda `**Last Updated:**` baru.
- `docs/api/README.md` (aturan dokumen API sisi FE) dan `docs/api/auth.md`.
- `.githooks/commit-msg`: format Conventional Commit dan kode issue Space `[KODE-123]`, sama dengan
  gate review Kinerja.
- CI GitHub Actions (`.github/workflows/ci.yml`) di setiap pull request ke `production`: lint file
  berubah, `tsc --noEmit`, test, CHANGELOG, doc-sync, dan batas 200 baris `CLAUDE.md`.
- Template pull request (`.github/pull_request_template.md`).
- `docs/architecture.md`, `docs/guides/local-development.md`, `docs/guides/new-feature.md`, dan
  `.claude/rules/` per folder (fitur, route, lapisan API, i18n, test, dokumen API).
- `.claude/settings.json` dengan marketplace plugin `venturo-tools` serta plugin `venturo-kinerja`
  dan mod `venturo-kinerja-hud`, dan `.claude/venturo-kinerja.json` (`"mode": "enforce"`).

### Changed

- `@typescript-eslint/no-explicit-any` dari mati menjadi `warn` (error untuk file yang berubah
  lewat `yarn lint:changed`).
- `CLAUDE.md` ditulis ulang (151 → 118 baris): perintah, konvensi, gotcha, larangan, standar review
  Kinerja, dan delegasi sub-agent. Isi arsitektur dipindah ke `docs/architecture.md`, prosedur ke
  `docs/guides/`, aturan per folder ke `.claude/rules/`.
- `docs/CONVENTIONS.md` dan `docs/README.md`: larangan membuat test dihapus, rujukan contoh kode ke
  fitur `branches` yang ada di skeleton.
