# Auth

**Module:** core/auth
**Kode FE:** `src/module/core/features/auth/api/index.ts` (tipe di `../types/index.ts`)
**Last Updated:** 2026-10-27

Semua path di bawah `/core/v1/auth`, terdaftar di `endpoints.auth` (`src/shared/lib/axios.ts`).
Response memakai envelope `{ data, message, meta, errors }` dan dibuka `unwrap<T>()`: `data`
kosong dianggap error dengan pesan `errors` atau `message`.

## Endpoint

| Method | Path              | Fungsi FE          | Body                                 | `data`                    | Auth                         |
| ------ | ----------------- | ------------------ | ------------------------------------ | ------------------------- | ---------------------------- |
| POST   | `/signin`         | `signIn`           | `SignInParams` `{ login, password }` | `SignInResponse`          | publik                       |
| POST   | `/signup`         | `signUp`           | `SignUpParams`                       | `SignUpResponse`          | publik                       |
| POST   | `/google`         | `signInWithGoogle` | `{ id_token }` (Firebase)            | `GoogleSignInResponse`    | publik                       |
| POST   | `/refresh`        | `refreshTokens`    | `{ refresh_token }`                  | `TokenPair`               | publik, `withoutAuthRefresh` |
| POST   | `/logout`         | `logout`           | `{ refresh_token }`                  | — (response tidak dibaca) | Bearer                       |
| POST   | `/logout-all`     | `logoutAll`        | —                                    | — (response tidak dibaca) | Bearer                       |
| POST   | `/switch-company` | `switchCompany`    | `{ company_id }`                     | `SwitchCompanyResponse`   | Bearer                       |
| GET    | `/me`             | `getMe`            | —                                    | `MeResponse`              | Bearer                       |
| GET    | `/companies`      | `getMyCompanies`   | —                                    | `CompanyMembership[]`     | Bearer                       |

## Tipe

- `TokenPair`: `access_token`, `refresh_token`, `token_type: 'Bearer'`, `expires_in` (detik).
- `SignInResponse` = `TokenPair` + `user`, `company | null`, `client | null`, `roles: string[]`,
  `permissions: string[]`. `GoogleSignInResponse` menambah `is_new_user`.
- `SwitchCompanyResponse` = `TokenPair` + `company`, `roles`, `permissions` untuk company itu.
- `MeResponse`: `user`, `company | null`, `client | null`, `roles`, `permissions`, `is_super_admin`.
- `CompanyMembership`: `id`, `name`, `type` (`holding` | `subsidiary`), `logo_url`, `parent_id`,
  `is_primary`, `is_owner`, `role_name`, `role_code`.

## Perilaku FE

- `access_token` hanya dibaca `exp`-nya (tanpa verifikasi tanda tangan) untuk memutuskan refresh
  saat aplikasi dibuka.
- 401 pada request Bearer memicu satu `POST /refresh` untuk semua request yang gagal bersamaan, lalu
  request diulang dengan token baru. 401 pada `/refresh` atau refresh token kosong mengakhiri sesi
  (token dan company aktif dihapus).
- `/signin` yang ditolak (mis. 401) menampilkan pesan `errors`/`message` dari backend di form login.
- `/me` tanpa `company` membuat FE memilih company (tersimpan, lalu `is_primary`, `is_owner`, atau
  yang pertama dari `/companies`) dan memanggil `/switch-company`.

**Last Updated:** 2026-10-27 (dokumen awal dari kode `api/index.ts` dan `types/index.ts`)
