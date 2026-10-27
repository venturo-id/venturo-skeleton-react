# Panduan: development lokal

Prosedur sekali jalan per clone; tidak dimuat ke setiap sesi agent.

## Prasyarat

- Node.js ≥ 22.12 (`engines` di `package.json`).
- Yarn 1.22.22 (`packageManager`). Tanpa yarn global: `npx --yes yarn@1.22.22 <perintah>`.
- Backend Venturo yang berjalan (default `http://localhost:8080`) untuk alur login.

## Langkah

1. Install dependency: `yarn install`. Dependency baru ditambah dengan `yarn add` supaya
   `yarn.lock` ikut berubah (Dockerfile memakai `yarn install --frozen-lockfile`).
2. Salin `.env.example` ke `.env`, lalu arahkan `VITE_SERVER_URL` ke backend lokal. Semua
   `VITE_*` di-inline ke bundle browser, jadi tidak boleh berisi secret.
3. Pasang hook commit: `yarn hooks` (mengeset `git config core.hooksPath .githooks`). Hook menolak
   subject yang bukan Conventional Commit atau pesan tanpa kode issue Space `[KODE-123]`.
4. Set branch tujuan PR untuk lint dan cek yang membandingkan dengan base:
   `git config kinerja.base origin/<branch-tujuan>` (mis. `origin/production`). Tanpa ini dipakai
   `origin/HEAD`, lalu `origin/production`. Plugin Claude Code `venturo-kinerja` membaca setelan
   yang sama.
5. Jalankan `yarn dev` (port 8081). Tanpa backend, set sementara `CONFIG.auth.skip = true` di
   `src/shared/config/index.ts` untuk melewati `AuthGuard`; jangan di-commit.

## Sebelum push

```bash
yarn check:all   # lint:changed + typecheck + test + check:changelog + check:doc-sync
```

Perintah yang sama dijalankan CI di setiap pull request ke `production`. Satu per satu:

| Perintah                      | Isi                                                                        |
| ----------------------------- | -------------------------------------------------------------------------- |
| `yarn lint:changed [BASE]`    | ESLint `--max-warnings 0` + Prettier pada file `src/` yang berubah         |
| `yarn typecheck`              | `tsc --noEmit`                                                             |
| `yarn test`                   | Vitest sekali jalan                                                        |
| `yarn check:changelog [BASE]` | Gagal bila kode aplikasi berubah tanpa entri `CHANGELOG.md`                |
| `yarn check:doc-sync [BASE]`  | Gagal bila `api/`, `services/`, atau `endpoints` berubah tanpa `docs/api/` |

Refactor yang tidak mengubah kontrak API: `DOC_SYNC_SKIP=1 yarn check:doc-sync`; di CI pakai label
PR `no-doc-change`.
