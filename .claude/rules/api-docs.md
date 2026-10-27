---
paths:
  - 'docs/api/**'
---

# Dokumen API (sisi FE)

- Satu file per fitur: `docs/api/<feature>.md`, nama sama dengan folder
  `src/module/<domain>/features/<feature>/`, terdaftar di tabel `docs/api/README.md`.
- Kepala file: `**Module:**`, `**Kode FE:**` (path `api/index.ts`), `**Last Updated:** YYYY-MM-DD`.
  Baris `**Last Updated:**` diganti di setiap perubahan isi; `yarn check:doc-sync` menolak dokumen
  yang berubah tanpa baris itu.
- Tiap endpoint: method + path (sesuai `endpoints.*`), fungsi FE yang memanggilnya, body/query,
  tipe `data` di envelope, kode status error yang ditangani FE, dan syarat auth (Bearer, tanpa refresh).
- Perubahan yang mengubah perilaku pemanggil ditulis sebagai bagian
  `## Perubahan (YYYY-MM-DD) — <judul>` di atas daftar endpoint, terbaru di atas.
- Contoh data fiktif (bukan email/nama orang sungguhan); token ditulis `<access_token>`.
