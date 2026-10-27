---
paths:
  - 'src/module/**'
---

# Modul fitur

- Satu fitur satu folder `src/module/<domain>/features/<feature>/` dengan subfolder sesuai kebutuhan:
  `api/`, `components/`, `hooks/`, `pages/`, `types/`, `views/`, `utils/` (plus `context/`, `guard/`
  bila perlu). Tidak ada folder fitur di luar `module/`; kode lintas fitur ke `src/shared/`.
- `pages/` hanya route leaf yang di-lazy-load (judul + `<XxxView />`); isi halaman di `views/`.
- Logika bisnis, fetch, dan state form di hook (`hooks/use-<feature>-*.ts`) atau `api/`; komponen
  hanya merender. Komponen yang mendekati 200 baris dipecah ke `components/`.
- CRUD entity kecil/menengah: list = satu-satunya halaman, create/edit/view = dialog dengan state
  lokal `use<Feature>Dialog()`, bukan URL sync. Contoh hidup: `src/module/core/features/branches/`.
- List memakai toolkit `src/shared/ui/table` (`useTable`, `TableHeadCustom`, `TableSkeleton`,
  `TablePaginationCustom`), bukan `<TableHead>`/`<TablePagination>` MUI langsung; detail di
  `docs/patterns/table.md`.
- Notifikasi: sukses → `toast.*` dari `src/shared/ui/snackbar`; aksi gagal → `<ErrorDialog>` (sibling
  dialog, form tetap terbuka); `<Alert>` hanya untuk gagal load halaman.
- Gating UI per permission lewat `PermissionGuard` atau `usePermission()` dengan key dari `PERM`
  (`src/shared/lib/permissions.ts`); permission baru ditambahkan ke `PERM`, bukan string literal.
- Hook yang mengambil data per company memasukkan `companyVersion` (dari `useAuthContext()`) ke
  dependency fetch; cache module-level memanggil `registerCompanyCacheInvalidator(invalidateXxx)` di
  top-level. Tanpa itu data company lama tetap tampil setelah `switchCompany`.
- Setiap hook dan util baru/yang diubah punya `*.test.ts(x)` di sampingnya (`.claude/rules/tests.md`).
