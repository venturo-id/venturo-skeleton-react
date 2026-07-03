# Plan & Skema — Aplikasi "Kinerja" (Performance Monitoring + Project Management)

> **Dokumen perencanaan** modul Project Management (ala Jira) + KPI internal.
> Nama aplikasi **Kinerja**. Ditulis untuk dibaca boss: bahasa sederhana, cukup detail
> untuk jadi acuan pengerjaan.
> Prinsip induk: **MASTER dulu → PROJECT/TRANSAKSI → KALKULASI → DASHBOARD → EXPORT EXCEL.**

- **Status:** Draft plan (UI sketsa sudah jadi, belum mulai coding)
- **Tanggal:** 2026-07-03
- **Fokus MVP sekarang (arahan boss):** **Bug Count** + **NPS** → menghasilkan status **Hybrid** (layak WFH atau tidak)
- **Tujuan dokumen:** persetujuan skema & urutan kerja sebelum pengerjaan mendalam

---

## 1. Ringkasan Eksekutif (buat Boss)

Aplikasi **Kinerja** terdiri dari 2 bagian yang saling terhubung:

1. **Project Management (ala Jira)** — tempat tim kerja: project, task, bug, sprint, assignee.
   Ini **sumber data mentah**.
2. **KPI / Performance Monitoring** — mengubah data mentah dari PM (mis. jumlah bug) +
   input manual (mis. survei NPS) menjadi **skor kinerja** per orang & per divisi, per kuartal.

Hasil akhirnya: **dashboard** (yang sudah dirancang) + **export ke Excel**.

> **Cara bangun:** jangan dari dashboard. Dashboard itu hasil akhir. Bangun fondasi dulu
> (master + PM), baru KPI mengalir otomatis. **Rapiin gudang dulu, baru pajang etalase.**

**Untuk sekarang, boss minta menyempit ke fokus ini** supaya cepat kelihatan hasil nyata
dari ujung ke ujung. Ada **2 KPI dasar** + **1 status turunan**:

| Item | Jenis | Sumber data |
|---|---|---|
| **Bug Count** | KPI dasar | dari modul PM (Jira-like): hitung jumlah bug per tim/anak |
| **NPS** | KPI dasar | hasil survei klien (isi/upload) |
| **Hybrid** | **status turunan** (dihitung otomatis) | dari Bug Count + NPS |

> **Penting — apa itu "Hybrid":** Hybrid **bukan** KPI yang diinput. Hybrid adalah
> **keputusan/status kelayakan** apakah seorang anak/tim boleh kerja **hybrid (WFH)** atau
> **harus di kantor**. Ditentukan otomatis dari 2 KPI dasar:
>
> ```
> Bug sedikit  DAN  NPS klien bagus   →  LAYAK hybrid (boleh WFH)
> Bug banyak   ATAU NPS klien jelek   →  TIDAK layak hybrid (harus di kantor)
> ```
>
> Jadi Bug Count & NPS = bahan mentah; Hybrid = hasil penilaiannya.

Kalau alur ini jalan ujung-ke-ujung, KPI lain tinggal ikut pola yang sama.

---

## 2. Gambaran Alur Ujung-ke-Ujung (MVP)

```
┌─────────────┐   ┌───────────────┐   ┌──────────────┐   ┌───────────┐   ┌────────┐
│ PROJECT MGMT│   │  KPI ENGINE   │   │  KALKULASI   │   │ DASHBOARD │   │ EXPORT │
│ (ala Jira)  │──►│ Bug Count ────┼──►│ Score=%×bobot │──►│ Kinerja   │──►│ EXCEL  │
│ bug/task    │   │ NPS ◄─ survei ┤   │ Achievement   │   │ (sketsa)  │   │ (.xlsx)│
└─────────────┘   │               │   │      │        │   │           │   │        │
                  │               │   │      ▼        │   │           │   │        │
                  │      status ◄─┼───┤  HYBRID?      │   │           │   │        │
                  │      Hybrid   │   │ (Bug+NPS→WFH?) │   │           │   │        │
                  └───────────────┘   └──────────────┘   └───────────┘   └────────┘
    (data mentah)   (jadi angka %)     (skor + status)     (tampil)      (laporan)
```

---

## 3. Fokus MVP — Spec 2 KPI Dasar + Status Hybrid

### 3.1 KPI: **Bug Count**

**Apa:** menghitung **banyaknya bug** pada project untuk tiap anak/tim. Makin sedikit bug,
makin bagus skornya.

**Sumber data:** dari modul **PM (ala Jira)** — hitung issue bertipe *Bug* per anak/tim per periode.

**Data yang dibutuhkan dari PM:**
`bug_id · project · assignee (anak) · severity (Critical/Major/Minor) · status · tgl dibuat · tgl selesai · periode`

**Cara jadi %:** bug **lebih sedikit = skor lebih tinggi** (kebalikan). Perlu **target**.
Contoh formula (opsional pakai bobot severity):
```
Bobot severity : Critical=5, Major=3, Minor=1   (atau semua bug dihitung 1 — keputusan boss)
Skor mentah    : Σ (jumlah bug × bobot severity)     → makin kecil makin bagus
Target         : mis. batas ≤ 20 poin per kuartal
Persen (%)     : jika skor ≤ target → 100%
                 jika skor > target → 100% − ((skor−target)/target × 100), minimal 0%
```
> **Perlu keputusan boss:** target, apakah pakai bobot severity, & dihitung per-anak
> atau per-tim/project. (lihat §9)

### 3.2 KPI: **NPS (Net Promoter Score)**

**Apa:** ukur kepuasan/loyalitas klien dari survei "seberapa mungkin merekomendasikan kami?"
skala **0–10**.
**Sumber:** input **manual** — hasil survei klien (isi form atau upload).

**Cara hitung (standar NPS):**
```
Promoter  = responden skor 9–10
Passive   = responden skor 7–8
Detractor = responden skor 0–6
NPS       = %Promoter − %Detractor        → hasil range −100 .. +100
```
**Konversi ke % (0–100) supaya masuk formula score:**
```
Persen (%) = (NPS + 100) / 2
contoh: NPS +40  → (40+100)/2 = 70%
```
> **Perlu keputusan boss:** rumus konversi (pakai di atas, atau NPS langsung dianggap %,
> atau skala lain). (lihat §9)

### 3.3 STATUS: **Hybrid** (hasil turunan, dihitung otomatis)

**Apa:** penentuan apakah seorang anak/tim **layak kerja hybrid (WFH)** atau **harus di
kantor**. Ini **bukan diinput** — dihitung otomatis dari Bug Count + NPS.

**Logika (pakai ambang batas):**
```
LAYAK HYBRID (boleh WFH)  jika:  Bug Count %  ≥ ambang_bug   DAN  NPS % ≥ ambang_nps
TIDAK LAYAK (di kantor)   jika:  salah satu di bawah ambang
```
Contoh ambang: Bug Count ≥ 80% DAN NPS ≥ 70% → **Hybrid: Ya**. Kalau tidak → **Hybrid: Tidak**.

Bentuk lain (opsional) — **skor gabungan** lalu kelompokkan:
```
Skor Hybrid = (Bug Count % × wA) + (NPS % × wB)      contoh wA=0.5, wB=0.5
≥ 80%  → Hybrid penuh (WFH bebas)
60–79% → Hybrid terbatas (sebagian WFH)
< 60%  → Wajib di kantor
```
> **Perlu keputusan boss:** ambang batas & apakah "Hybrid: Ya/Tidak" (biner) atau berjenjang
> (penuh/terbatas/kantor). (lihat §9)

### 3.4 Setelah 2 KPI jadi %
Sisanya sama untuk semua KPI:
```
Score       = Persen × Bobot
Achievement = Σ Score  (syarat Σ Bobot = 100)
```
Status **Hybrid** ikut ditampilkan di samping Achievement tiap anak/tim.

---

## 4. Modul Project Management (ala Jira) — sumber data

Bagian ini yang menyuplai **Bug Count**. Dibangun secukupnya untuk MVP (tidak perlu
selengkap Jira dulu).

**Data inti PM:**

| Data | Kolom penting |
|---|---|
| **Project** | id · nama · departemen · klien · status · periode |
| **Sprint** (opsional MVP) | id · project_id · nama · tgl mulai/selesai |
| **Task/Issue** | id · project_id · **tipe** (Task/Bug) · judul · **severity** (utk Bug) · assignee_id · status (To Do/In Progress/Done) · tgl dibuat · tgl selesai |
| **Komentar/Log** (opsional MVP) | id · task_id · user · isi · waktu |

**Kaitan ke KPI:** modul KPI **membaca** Task bertipe `Bug` → dihitung jadi angka Bug Count.
PM = sumber, KPI = pembaca. Jangan hitung ganda.

> **MVP minimal:** cukup **Project + Task/Issue (dengan tipe Bug & severity)**. Sprint,
> komentar, board drag-drop bisa menyusul setelah pipeline KPI jalan.

---

## 5. Export ke Excel

Hasil KPI bisa diunduh sebagai **.xlsx** untuk dilaporkan/diarsip.

- **Isi file:** per periode & departemen — daftar orang, tiap KPI (%, bobot, score),
  Achievement, klasifikasi. Plus sheet ringkasan cascade.
- **Cara teknis:** pakai library spreadsheet (mis. `exceljs` / `xlsx`) di frontend, atau
  backend generate file lalu di-download. **Rekomendasi:** backend yang generate (angka =
  sumber kebenaran), frontend download via axios blob (ikut pola `reports`,
  **jangan** `window.open`).
- **Format kolom** menyesuaikan template Excel KPI yang sudah dipakai kantor (mohon boss
  kirim contoh file supaya kolomnya persis).

> **Perlu:** contoh file Excel KPI existing (kalau ada) → supaya format export cocok. (§9)

---

## 5B. Integrasi HRIS (sumber data Karyawan & Struktur Org)

**Kabar baik:** data karyawan **tidak perlu diinput manual** — di-**sync dari HRIS kantor
(Humanis)**. Master org (departemen, jabatan, karyawan, atasan) ikut otomatis dari sana.

**Sumber:** `GET https://api.humanis.id/humanis_api/karyawandata?m_perusahaan_id=5&api_key=***`
→ balikin daftar karyawan Venturology (perusahaan_id 5). Sampel: **83 karyawan**.

**Field HRIS → dipakai jadi apa:**

| Field HRIS | Dipakai untuk | Catatan |
|---|---|---|
| `karyawan_id` | **kunci sinkron** (ID karyawan) | jangan bikin ID sendiri, pakai punya HRIS |
| `nama`, `nik`, `email`, `foto` | data karyawan | — |
| `departemen_id` + `departemen_nama` | **Master Departemen** (auto) | mis. "Coding Tanpa Henti", "Venturo Pro" |
| `m_jabatan_id` + `nm_jabatan` | **Master Jabatan** (auto) | mis. Web Programmer, Project Manager, Pentester |
| **`atasan_langsung_id`** | **Cascade / rollup** (siapa atasan siapa) | inti flowchart berjenjang — sudah tersedia! |
| `perusahaan_id` + `nm_perusahaan` | scope multi-company | Venturology = 5 |
| `status_kerja` (PKWTT/PKWT), `tipe` | info & filter | — |
| `tgl_mulai_kerja`, `tgl_lahir` | info | — |
| bank, `atas_nama`, `no_hp`, gaji | **DIABAIKAN** | bukan urusan KPI |

**Dampak ke rencana:**
- Master **Departemen, Jabatan, Karyawan, atasan** → **tidak perlu CRUD manual**, cukup
  tombol **"Sync HRIS"** (tarik + simpan/perbarui).
- Cascade **`atasan_id`** yang tadinya harus diisi manual → **sudah ada** dari
  `atasan_langsung_id`. Hemat banyak kerja.
- Yang masih **manual/internal** (tidak ada di HRIS): **level jabatan** (L1/L2/L3 buat
  urutan cascade), **Periode**, **Katalog KPI + bobot**, data **PM/bug**, **survei NPS**.

**Cara sync (teknis):**
- Backend Kinerja panggil API HRIS → simpan cache lokal tabel `karyawan`, `departemen`,
  `jabatan` (upsert by `karyawan_id` / `departemen_id` / `m_jabatan_id`).
- **Jangan** panggil HRIS langsung dari frontend (api_key bocor). Frontend cukup panggil
  endpoint backend sendiri: `POST /kinerja/sync/hris` + `GET /kinerja/karyawan`.
- Jadwal sync: tombol manual dulu (MVP), nanti bisa terjadwal (cron harian).
- Data karyawan **read-only** di app Kinerja (sumber kebenaran = HRIS).

> **Perlu keputusan boss:** (a) `api_key` disimpan di backend env — konfirmasi boleh.
> (b) level jabatan (L1/L2/L3) ditentukan dari mana — manual mapping per jabatan, atau
> hitung dari kedalaman `atasan_langsung_id`? (lihat §9)

---

## 6. Tiga+ Lapisan Sistem

```
┌────────────────────────────────────────────────────────────┐
│ LAPIS 5 — EXPORT     (.xlsx laporan KPI)                     │
├────────────────────────────────────────────────────────────┤
│ LAPIS 4 — DASHBOARD  (Strategic, Cascade, Detail, Team)      │  ← yang boss lihat
├────────────────────────────────────────────────────────────┤
│ LAPIS 3 — KALKULASI  (Score, Achievement, Rollup, klasifikasi)│  ← otomatis
├────────────────────────────────────────────────────────────┤
│ LAPIS 2 — SUMBER DATA:                                        │
│   • PROJECT MGMT (Jira-like): project, task, BUG  → Bug Count │  ← inti kerja
│   • INPUT MANUAL: survei NPS, realisasi lain                  │
├────────────────────────────────────────────────────────────┤
│ LAPIS 1 — MASTER:                                             │  ← fondasi, wajib duluan
│   • dari HRIS (sync): departemen, jabatan, karyawan, atasan   │
│   • internal (manual): level jabatan, periode, katalog KPI+bobot│
└────────────────────────────────────────────────────────────┘
        ▲
        └── SYNC ── HRIS Humanis (api karyawandata, perusahaan_id=5)
```

---

## 7. Rincian Data (Skema)

### 7.1 MASTER

**Dari HRIS (sync, read-only) — kunci pakai ID Humanis:**
**Perusahaan** — perusahaan_id · nm_perusahaan
**Departemen** — departemen_id · departemen_nama · perusahaan_id
**Jabatan** — m_jabatan_id · nm_jabatan · **level** (1/2/3 — *diisi internal, lihat §5B*)
**Karyawan** — karyawan_id · nik · nama · email · foto · departemen_id · m_jabatan_id · **atasan_langsung_id** (cascade) · status_kerja · tgl_mulai_kerja · perusahaan_id

**Internal (manual, dikelola di app Kinerja):**
**Level Jabatan** — m_jabatan_id · level (mapping urutan cascade, kalau tak dihitung dari atasan)
**Periode** — id · tahun · kuartal (Q1–Q4) · tgl mulai/selesai · status (Draft/Aktif/Terkunci)
**Katalog KPI** — id · nama · kategori (Team/Project/Strategic) · **tipe ukur** (persen / skala / **count-inverse** / nps / aging) · target default · satuan · deskripsi
**KPI-per-Jabatan (bobot)** — id · jabatan_id · kpi_id · **bobot** · target · (validasi Σ bobot = 100)

### 7.2 PROJECT MANAGEMENT (sumber Bug Count)
**Project** — id · nama · departemen_id · klien · status · periode_id
**Task/Issue** — id · project_id · tipe (Task/**Bug**) · judul · **severity** · assignee_id · status · tgl dibuat · tgl selesai

### 7.3 TRANSAKSI KPI
**Penilaian** — id · periode_id · karyawan_id · jabatan_id (snapshot)
**Realisasi KPI** — id · penilaian_id · kpi_id · bobot (snapshot) · **nilai mentah** · **persen** (auto/manual) · **score** (auto) · sumber (auto-PM / manual) · catatan
**Survei NPS** — id · periode_id · project_id/klien · skor (0–10) · responden · tanggal
**Hasil Achievement** — id · penilaian_id · achievement (auto) · klasifikasi · **status_hybrid** (auto: Ya/Tidak atau Penuh/Terbatas/Kantor) · alasan (ringkas: bug/nps)

> **Snapshot bobot & jabatan** disalin saat penilaian dibuat → perubahan master ke depan
> tidak mengubah nilai historis.

---

## 8. Roadmap MVP (fokus Bug Count + NPS → status Hybrid)

**Tahap A — MVP (2 KPI dasar + status Hybrid, ujung-ke-ujung):**

| Fase | Nama | Deliverable | Selesai kalau… |
|---|---|---|---|
| **A1** | Master minimal | **Sync HRIS** (departemen/jabatan/karyawan/atasan) + set level jabatan + CRUD Periode | 83 karyawan tertarik, cascade kebentuk, periode ada |
| **A2** | Katalog KPI (2) | daftar KPI: Bug Count & NPS + bobot per jabatan | 2 KPI terdaftar, Σ bobot valid |
| **A3** | PM minimal | Project + Task/Issue (tipe Bug + severity) | bisa input bug per project/periode |
| **A4** | Input manual | form/upload survei NPS | data NPS tersimpan |
| **A5** | Kalkulasi | Bug Count→%, NPS→%, Score, Achievement, **status Hybrid** | angka cocok contoh manual + Hybrid auto |
| **A6** | Dashboard | tampil KPI + **badge Hybrid** di Detail/Cascade/Team | sesuai sketsa, update real-time |
| **A7** | Export Excel | download .xlsx hasil KPI + kolom Hybrid | file sesuai format kantor |

**Tahap B — Perluasan (setelah MVP terbukti):**

| Fase | Nama |
|---|---|
| B1 | Tambah KPI lain (Uptime, Compliance, Client Feedback, dst) ikut pola yang sama |
| B2 | PM lengkap (sprint, board drag-drop, komentar, lampiran) |
| B3 | Multi-company, hak akses granular, audit log |
| B4 | i18n penuh (id/en), notifikasi, penjadwalan periode otomatis |

> **Urutan wajib:** A1→A2→A3 dulu (fondasi + sumber data). Jangan loncat ke A6 (dashboard).

---

## 9. Keputusan yang Perlu Diambil Boss (sebelum coding MVP)

Supaya tidak bolak-balik:

**Tentang Bug Count:**
1. Dihitung **per-anak** (assignee) atau **per-tim/project**?
2. Pakai bobot severity (Critical/Major/Minor) atau semua bug = 1?
3. Target/batas bug per kuartal berapa?

**Tentang NPS:**
4. Rumus konversi ke %: pakai `(NPS+100)/2`, atau lain?
5. Sumber survei: input manual di app, upload file, atau integrasi form eksternal?

**Tentang status Hybrid (paling penting — ini goal boss):**
6. Ambang batas: Bug Count ≥ ...% DAN NPS ≥ ...% baru layak hybrid? (isi angkanya)
7. Bentuk hasil: **biner** (Ya/Tidak) atau **berjenjang** (Penuh / Terbatas / Kantor)?
8. Basis penilaian: per **anak** atau per **tim/project**?
9. Kalau salah satu jelek — langsung "tidak hybrid", atau pakai skor gabungan berbobot?

**Tentang sync HRIS (Humanis):**
15. `api_key` disimpan di **backend env** — konfirmasi boleh (jangan di frontend).
16. **Level jabatan (L1/L2/L3)** ditentukan bagaimana — mapping manual per jabatan, atau
    dihitung otomatis dari kedalaman `atasan_langsung_id`?
17. Sync: tombol manual dulu, atau langsung terjadwal (cron harian)?

**Umum:**
10. **Rollup cascade** — angka atas = rata-rata bawahan biasa atau berbobot?
11. **Ambang klasifikasi tim** — Excellent ≥ berapa %? Needs Attention < berapa %?
12. **Format Excel** — mohon contoh file KPI existing supaya kolom export persis.
13. **Multi-company** — satu perusahaan dulu (Operations) atau langsung multi?
14. **Kunci periode** — setelah kuartal ditutup, data dikunci?

---

## 10. Catatan Teknis (untuk tim dev)

Ikuti pattern repo — **jangan bikin pola baru**:

- **Struktur modul**: `src/module/<domain>/features/<feature>/` bentuk standar
  (`api/`, `components/`, `context/`, `hooks/`, `pages/`, `types/`, `views/`).
  Usulan domain: `src/module/kinerja/` (KPI) & `src/module/pm/` (project management).
  → [docs/CONVENTIONS.md](../CONVENTIONS.md), [docs/patterns/feature-module.md](../patterns/feature-module.md)
- **Master & CRUD kecil** → **dialog-based CRUD** ([dialog-crud.md](../patterns/dialog-crud.md)) +
  shared table ([table.md](../patterns/table.md)).
- **Bobot KPI per jabatan / bug per project (multi-baris, validasi Σ=100)** → pola
  **multiline-form** ([multiline-form.md](../patterns/multiline-form.md)), contoh `cash-transactions`.
- **Dashboard read-only** → pola **reports** ([reports.md](../patterns/reports.md)).
- **Export Excel & print** → ikut pola reports (axios blob, **jangan** `window.open(fullUrl)`).
- **Semua label wajib i18n** (id default + en) → [i18n.md](../patterns/i18n.md).
- **Hak akses** → `PermissionGuard` / `usePermission()`.
- **Angka/score** → `RHFNumericField`.
- **Kalkulasi final** idealnya di **backend** (sumber kebenaran); frontend preview live saat edit.
- **Sync HRIS**: panggil dari **backend** (`api_key` di env, jangan di FE). FE cukup
  `POST /kinerja/sync/hris` + `GET /kinerja/karyawan`. Karyawan read-only (sumber = HRIS).
  Upsert by ID Humanis (`karyawan_id`/`departemen_id`/`m_jabatan_id`).

---

## 11. Ringkasan Alur (1 gambar)

```
[Master]         [Sumber data]              [Kalkulasi]           [Dashboard]      [Export]
Org+Jabatan  ─► PM (Jira): Bug ──► Bug% ──┐
+ Periode       Survei klien: NPS ─► NPS% ─┤─► Score=%×bobot ───► Kinerja UI ──► Excel .xlsx
+ Katalog KPI                             │   Achievement=ΣScore  (Strategic,   (laporan)
  (Bug,NPS)                               │   HYBRID? (Bug+NPS)   Cascade,
                                          │   Klasifikasi tim     Detail+badge
                                          │                       Hybrid, Team)
  (Fase A1–A2)   (Fase A3–A4)          (Fase A5)              (Fase A6)      (Fase A7)
```

**Inti buat boss:** MVP fokus **2 KPI dasar (Bug Count + NPS)** yang menghasilkan **status
Hybrid** (layak WFH atau harus di kantor) — dari ujung ke ujung. Data bug lahir di
**Project Management**, NPS dari **survei klien**, diolah jadi skor di **KPI Engine**,
sistem otomatis memutuskan **Hybrid**, tampil di **Dashboard**, lalu **diunduh ke Excel**.
Kalau alur ini jalan, KPI lain tinggal ikut pola yang sama.
