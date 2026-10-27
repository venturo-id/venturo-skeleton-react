---
paths:
  - 'src/**/*.test.ts'
  - 'src/**/*.test.tsx'
  - 'src/test/**'
---

# Test

- File test di samping kodenya (`use-permission.ts` → `use-permission.test.tsx`); helper bersama di
  `src/test/`.
- Import eksplisit dari `vitest` (`describe`, `it`, `expect`, `vi`); tidak ada globals.
- Backend dipalsukan di lapisan adapter axios dengan `installFakeBackend({ 'POST /core/v1/...': reply })`
  (`src/test/fake-backend.ts`): interceptor auth/refresh tetap jalan dan request tercatat di
  `requests`. Jangan `vi.mock` modul `api/` untuk test integrasi.
- Komponen yang butuh provider aplikasi dirender dengan `renderWithAppProviders(ui, route)`
  (`src/test/render.tsx`); status sesi diperiksa lewat `<AuthStatusProbe />`.
- Uji perilaku yang dilihat user: query `getByRole`/`getByLabelText`, interaksi lewat `userEvent`,
  bukan state internal komponen.
- `sessionStorage` dan `localStorage` dikosongkan setelah tiap test (`src/test/setup.ts`).
- Ambang struktur berlaku juga di test: callback `describe` ≤50 baris — pecah jadi beberapa
  `describe` bila lebih. Literal angka/string di test tidak dihitung magic value.
