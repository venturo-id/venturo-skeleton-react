# Ringkasan Plan "Kinerja" — Mulai Dari Mana?

> Versi singkat buat boss. Detail lengkap di [project-management-kpi.md](./project-management-kpi.md).
> **Tanggal:** 2026-07-03 · **Status:** UI sketsa selesai, siap mulai bangun.

---

## 1. Apa yang dibangun (1 paragraf)

Aplikasi **Kinerja**: memantau performa tiap anak/tim lewat KPI per kuartal. Data lahir di
**Project Management (ala Jira)**, diolah jadi skor, tampil di **dashboard**, bisa **export
Excel**. **Fokus awal (MVP):** 2 KPI dasar — **Bug Count** + **NPS** → menghasilkan status
**Hybrid** (anak/tim ini layak WFH atau harus di kantor).

---

## 2. Prinsip: bangun dari bawah, bukan dari dashboard

```
MASTER  →  SUMBER DATA  →  KALKULASI  →  DASHBOARD  →  EXCEL
(fondasi)   (isi data)     (auto hitung)  (tampil)     (laporan)
```

Dashboard cantik itu **hasil akhir**. Kalau fondasi (data karyawan, KPI, bobot) belum rapi,
angka dashboard tak bisa dipercaya. **Rapiin gudang dulu, baru pajang etalase.**

---

## 3. Urutan Kerja (7 langkah, kerjakan berurutan)

| # | Langkah | Hasil | Kira² |
|---|---|---|---|
| **1** | **Sync karyawan dari HRIS** (Humanis) | 83 karyawan + struktur atasan otomatis masuk | cepat |
| **2** | **Master Periode + Katalog KPI** | daftar Tahun/Kuartal + KPI Bug Count & NPS + bobot | cepat |
| **3** | **Modul PM minimal** (project + bug) | bisa catat bug per anak/project | sedang |
| **4** | **Input NPS** (survei klien) | nilai NPS masuk per periode | cepat |
| **5** | **Mesin kalkulasi** | Score, Achievement, **status Hybrid** otomatis | sedang |
| **6** | **Dashboard** (sesuai sketsa) | Strategic, Cascade, Detail, badge Hybrid, Team | sedang |
| **7** | **Export Excel** | unduh laporan .xlsx | cepat |

> **Mulai dari langkah 1.** Jangan loncat ke langkah 6 (dashboard) walau paling menggoda.
> Langkah 1–2 = fondasi, wajib beres dulu.

---

## 4. Kabar baik: hemat kerja dari HRIS

Data karyawan **tidak perlu input manual** — tarik dari HRIS Humanis (sudah dites, jalan,
83 karyawan). Bonus: HRIS sudah punya data **atasan langsung**, jadi **cascade flowchart
kebentuk otomatis**. Yang masih diisi manual cuma: KPI, bobot, periode, data bug, survei NPS.

---

## 5. Yang perlu diputuskan boss dulu (biar tidak bolak-balik)

Sebelum langkah 5 (kalkulasi), tolong tentukan:

1. **Status Hybrid** — anak layak WFH kalau Bug Count ≥ ...% **dan** NPS ≥ ...%? (isi angkanya)
   → hasilnya **Ya/Tidak** saja, atau **berjenjang** (Penuh/Terbatas/Kantor)?
2. **Bug Count** — dihitung per-anak atau per-tim? Target bug per kuartal berapa?
3. **NPS** — sumbernya isi manual di app, atau upload file survei?
4. **Level jabatan (L1/L2/L3)** — tentukan manual, atau hitung otomatis dari data atasan HRIS?
5. **Contoh file Excel KPI** yang sekarang dipakai — biar format export persis.

> Daftar lengkap (14 poin) ada di dokumen detail §9.

---

## 6. Rekomendasi langkah pertama minggu ini

1. Boss jawab 5 keputusan di atas (§5).
2. Tim mulai **langkah 1 (sync HRIS)** + **langkah 2 (master KPI)** — dua ini bisa jalan
   duluan tanpa nunggu keputusan.
3. Begitu keputusan §5 turun, lanjut langkah 3–7 berurutan.

**Target MVP:** 2 KPI (Bug Count + NPS) + status Hybrid jalan ujung-ke-ujung. Kalau ini
terbukti, KPI lain tinggal ikut pola yang sama.
