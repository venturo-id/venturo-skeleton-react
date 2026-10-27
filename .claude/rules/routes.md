---
paths:
  - 'src/routes/**'
  - 'src/layouts/nav-config-*.tsx'
---

# Route dan navigasi

- Setiap path didaftarkan di `src/routes/paths.ts` dan dirujuk lewat `paths.*`; tidak ada string path
  literal di komponen, nav, atau `router.push`.
- Halaman di-import dengan `lazy(() => import('src/module/.../pages/...'))` di
  `src/routes/sections/<section>.tsx`.
- Pohon route disusun `<Guard><Layout><SuspenseOutlet /></Layout></Guard>`; halaman yang butuh
  permission dibungkus `gated(PERM.<resource>.<action>, <Page />)` di `sections/dashboard.tsx`.
- Route dashboard dipasang di `/` (tanpa prefix `/dashboard`).
- Menu di `useNavData()` (`src/layouts/nav-config-dashboard.tsx`), judul lewat `t()` namespace
  `navigation`. Item yang butuh permission diberi `permission` / `permissionAny` dari `PERM`;
  `filterNav` menyembunyikannya, termasuk induk yang semua anaknya tersembunyi. Breadcrumb header
  (`HeaderBreadcrumbs`) dibangun dari data nav yang sama.
