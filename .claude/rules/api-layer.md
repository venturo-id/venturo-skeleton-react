---
paths:
  - 'src/**/api/**'
  - 'src/**/services/**'
  - 'src/shared/lib/axios.ts'
---

# Lapisan API

- Satu file `api/index.ts` per fitur; fungsi bernama sesuai aksi (`listBranches`, `createBranch`) dan
  bertipe dari `../types`.
- Request lewat `axios` default dari `src/shared/lib/axios` dengan URL dari `endpoints.*`; endpoint baru
  ditambahkan ke `endpoints` di file itu.
- Envelope backend `{ data, message, meta, errors }` dibuka dengan helper `unwrap<T>()` /
  `unwrapList<T>()` (contoh `src/module/core/features/auth/api/index.ts`); komponen tidak membaca
  `res.data.data`.
- Request yang tidak boleh memicu refresh token (panggilan refresh itu sendiri, endpoint publik yang
  memang boleh 401) memakai `withoutAuthRefresh(config)` — tanpa itu 401-nya memicu refresh berulang.
- Jangan menangkap error di `api/` hanya untuk mengubah pesannya: interceptor sudah menormalisasi ke
  `Error` dengan `.status`; tangani di hook/komponen.
- Perubahan fungsi, endpoint, atau tipe request/response di sini wajib mengubah
  `docs/api/<feature>.md` di PR yang sama (`.claude/rules/api-docs.md`, dicek `yarn check:doc-sync`).
