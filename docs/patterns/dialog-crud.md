# Pattern: Dialog-based CRUD

Proyek ini pakai dialog (bukan separate page) untuk create/edit/view operation. List tetap page.

## Keputusan arsitektural

**Dialog > Page** untuk CRUD UX karena:
1. User tidak kehilangan konteks list (scroll, filter, pagination tetap)
2. Round-trip cepat — tidak ada lazy route load
3. Approve/reject/delete bisa dari list tanpa navigate
4. Matches pattern Erlio / Minimals calendar

**Local state > URL sync**:
- `useSearchParams` + `setSearchParams` memicu re-render semua subscriber Router → list view re-render → lambat
- Local `useState` update sync satu frame — dialog open/close feel instant
- Trade-off: hilang shareable URL (bisa ditambah nanti jika benar-benar butuh deep-link)

## Komponen struktur

```
components/
├── {feature}-form-dialog.tsx     # Create + edit (mode prop)
├── {feature}-detail-dialog.tsx   # View with tabs
└── {feature}-confirm-dialog.tsx  # Reusable action confirm
```

## useXxxDialog hook

```ts
// hooks/use-{feature}-dialog.ts
type DialogMode = 'new' | 'view' | 'edit';

export function useEntityDialog() {
  const [state, setState] = useState<{ mode: DialogMode | null; id: string | null }>({
    mode: null,
    id: null,
  });
  const open = useCallback((mode: DialogMode, id?: string) => {
    setState({ mode, id: id ?? null });
  }, []);
  const close = useCallback(() => setState({ mode: null, id: null }), []);
  return { mode: state.mode, id: state.id, open, close };
}
```

## Dialog transition

Pasang di **semua** `Dialog` untuk feel snappy:

```tsx
import { useTheme } from '@mui/material/styles';

const theme = useTheme();

<Dialog
  ...
  transitionDuration={{
    enter: theme.transitions.duration.shortest,       // 150ms
    exit: theme.transitions.duration.shortest - 80,   // 70ms — kunci feel instant
  }}
>
```

Default MUI (225/195ms) terasa lambat, khususnya saat dialog buka-tutup cepat.

## Scroll behavior — `DialogContent dividers` + `display: contents` di Form

MUI Dialog default pakai `scroll="paper"` — Paper jadi flex column dengan `max-height: calc(100% - 64px)`, dan `DialogContent` punya `flex: 1 1 auto; overflow-y: auto` supaya **hanya DialogContent yang scroll**, sementara DialogTitle & DialogActions tetap pinned.

Syaratnya: `DialogContent` **harus direct flex child** dari Paper. Kalau ada wrapper block (`<form>`, `<div>`) di antara Paper dan DialogContent, flex chain putus → DialogContent ambil natural height → overflow naik ke Paper → **seluruh dialog ikut ter-scroll** (title ikut hilang).

**Masalah yang dulu ada di codebase ini:** shared `<Form>` component render `<form>` block sebagai wrapper DialogContent + DialogActions. Itu memutus flex chain-nya.

**Solusi:** pass `sx={{ display: 'contents' }}` ke Form. Element form jadi tidak produce box di render tree — DialogContent/DialogActions naik jadi direct flex children Paper.

Sekalian pakai **`<DialogContent dividers>`** (prop bawaan MUI) alih-alih manual `<Divider />` sibling — otomatis render border-top + border-bottom. Tidak perlu `scroll="paper"` eksplisit karena itu default value-nya.

### Struktur yang benar (form dialog)

```tsx
<Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
  transitionDuration={{ enter: shortest, exit: shortest - 80 }}>
  <DialogTitle>...</DialogTitle>                                  {/* pinned di atas */}
  <Form methods={methods} onSubmit={onSave} sx={{ display: 'contents' }}>
    <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
      ...                                                         {/* scrollable */}
    </DialogContent>
    <DialogActions>                                               {/* pinned di bawah */}
      <Button type="submit">...</Button>
    </DialogActions>
  </Form>
</Dialog>
```

### Struktur yang benar (detail / read-only dialog — tanpa Form)

```tsx
<Dialog open={open} onClose={onClose} fullWidth maxWidth="lg"
  transitionDuration={{ enter: shortest, exit: shortest - 80 }}>
  <DialogTitle>...</DialogTitle>
  <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>...</DialogContent>
  <DialogActions>...</DialogActions>
</Dialog>
```

### Jangan

- ❌ Pakai `<Divider />` manual sibling di antara DialogTitle/DialogContent/DialogActions — ganti dengan prop `dividers` di DialogContent
- ❌ Tulis `scroll="paper"` — itu default, redundant
- ❌ Pakai wrapper block (termasuk `<Form>` tanpa `sx={{display:'contents'}}`, `<Box>`, `<div>`) di antara Paper dan DialogContent

**Catatan a11y:** `display: contents` pada `<form>` sempat bermasalah di screen reader (form boundary tidak announced) tapi sudah fixed di Chromium 89+, Firefox 84+, Safari 14+. Aman untuk internal admin app.

## Fullscreen expand toggle (form dialog)

**Semua form dialog** wajib punya **toggle expand ke fullscreen** di header sebelum tombol X close. User bisa switch antara modal biasa dan fullscreen tanpa kehilangan state form — berguna untuk power user, layar kecil, atau form dengan banyak field. Dipakai di cash-transactions, journal-entry, chart-of-accounts.

Detail dialog (read-only) atau confirm dialog kecil **tidak perlu** — tidak ada state yang perlu diedit panjang.

```tsx
const [full, setFull] = useState(false);

useEffect(() => {
  if (!open) setFull(false);  // reset saat dialog tutup
}, [open]);

<Dialog
  open={open}
  onClose={submitting.value ? undefined : onClose}
  fullWidth
  fullScreen={full}
  maxWidth="lg"
  transitionDuration={{ enter: shortest, exit: shortest - 80 }}
>
  <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
    <Box sx={{ flex: 1 }}>{title}</Box>
    {status && <StatusLabel status={status} />}
    <Tooltip title={full ? tCommon('actions.collapse') : tCommon('actions.expand')}>
      <IconButton size="small" onClick={() => setFull(!full)}>
        <Iconify icon={full ? 'eva:collapse-fill' : 'eva:expand-fill'} width={18} />
      </IconButton>
    </Tooltip>
    <IconButton size="small" onClick={onClose} disabled={submitting.value}>
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  </DialogTitle>
  ...
</Dialog>
```

Keys di `common.json`: `actions.expand` (id: "Perbesar", en: "Expand"), `actions.collapse` (id: "Perkecil", en: "Collapse") — sudah tersedia.

**Reset saat close:** pass `setFull(false)` di cleanup agar next open start di mode modal (user preference — saat create baru lebih nyaman modal biasa).

## DialogTitle dengan X close

```tsx
<DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
  <Box sx={{ flex: 1 }}>{title}</Box>
  {/* Optional: status badge di tengah */}
  {status && <EntityStatusLabel status={status} />}
  <IconButton size="small" onClick={onClose} disabled={submitting}>
    <Iconify icon="mingcute:close-line" width={18} />
  </IconButton>
</DialogTitle>
```

`title` via `t()` — biasanya `t('newTransfer')` atau `t('editTransfer', { no })`. **Tidak pakai tombol "Batal" di DialogActions** — X di title cukup. Confirm dialog yang butuh tombol Cancel ambil dari `tCommon('actions.cancel')`.

## Form dialog (create + edit)

```tsx
type Props = {
  open: boolean;
  mode: 'new' | 'edit';
  entityId?: string | null;
  onClose: () => void;
  onSaved: (entity: Entity) => void;
};

export function EntityFormDialog({ open, mode, entityId, onClose, onSaved }: Props) {
  const theme = useTheme();
  const enabledId = mode === 'edit' && open && entityId ? entityId : undefined;
  const { data: initialValue } = useEntity(enabledId);

  const defaultValues = useMemo(() => ({...}), [initialValue]);
  const methods = useForm({ resolver: zodResolver(Schema), defaultValues });

  // Reset form saat dialog buka dengan entity baru
  useEffect(() => { methods.reset(defaultValues); }, [defaultValues, methods]);

  // Reset error & state saat dialog tutup
  useEffect(() => {
    if (!open) setErrorMsg(null);
  }, [open]);

  const performSave = async (values, submitAfter) => {
    // ...
    if (mode === 'new') saved = await create(payload);
    else saved = await update(entityId!, payload);
    onSaved(saved);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
      transitionDuration={{ enter: theme..., exit: theme... - 80 }}>
      <DialogTitle>...</DialogTitle>
      <Form methods={methods} onSubmit={onSaveDraft} sx={{ display: 'contents' }}>
        <DialogContent dividers>...</DialogContent>
        <DialogActions>
          <Button type="submit" variant="outlined">{t('buttons.saveDraft')}</Button>
          <Button type="button" variant="contained" onClick={onSaveAndSubmit}>
            {t('buttons.saveAndSubmit')}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
```

> `sx={{ display: 'contents' }}` wajib supaya title/actions pinned saat konten scroll. `dividers` di `DialogContent` menggantikan manual `<Divider />`. Lihat [Scroll behavior](#scroll-behavior--dialogcontent-dividers--display-contents-di-form) di atas.

### Action buttons — standar

| Kondisi | Tombol |
|---|---|
| Default (new, `draft`, `rejected`, `waiting`) | `Save Draft` (type="submit") + `Save & Submit` (type="button", onClick) |
| `status === 'posted'` | `Save Changes` saja — **`Save & Submit` di-hide** (lihat di bawah) |
| `status === 'waiting'` | + `Approve` (success) + `Reject` (warning, require comment) |
| Never | ❌ `Batal`/`Close` button (X di title cukup) |
| Never | ❌ `History`/audit button (audit log ada di tab detail dialog) |

**Label tombol save** (switch berdasarkan status):
- `draft` | `rejected` | `posted` → `Save Changes` / `Simpan Perubahan` (lebih deskriptif — bukan bikin draft baru)
- `new` | `waiting` → `Save Draft` / `Simpan Draft`

**Save & Submit di-hide saat `posted`** — entry sudah approved, klik submit akan regress status kembali ke `waiting`. Gate via `canSubmit = status !== 'posted'`.

Icon standar (wajib — konsistensi visual):
- `Save Draft` / `Save Changes` → `solar:file-check-bold-duotone`
- `Save & Submit` → `eva:arrow-forward-fill`
- `Approve` → `solar:check-circle-bold`
- `Reject` → `solar:close-circle-bold`

Approve/Reject buka nested `{feature}ConfirmDialog` — reject butuh reason (textarea wajib), approve comment opsional. Lihat [Quick action confirm dialog](#quick-action-confirm-dialog) di bawah.

**Edit untuk semua status tetap dibolehkan** — belum ada close-period feature; BE enforce restriction kalau perlu (contoh: user coba edit `posted`, BE return 400 error). Lihat [memory: Edit/delete unlocked](../../..).

```tsx
const status = initialValue?.status ?? null;
const canApprove = status === 'waiting';
const canReject = status === 'waiting';
const canSubmit = status !== 'posted';
const saveDraftLabel =
  status === 'draft' || status === 'rejected' || status === 'posted'
    ? t('buttons.saveChanges')
    : t('buttons.saveDraft');

<DialogActions sx={{ gap: 1 }}>
  {canReject && (
    <Button
      color="warning"
      variant="outlined"
      startIcon={<Iconify icon="solar:close-circle-bold" />}
      onClick={openReject}
    >
      {tCommon('actions.reject')}
    </Button>
  )}
  {canApprove && (
    <Button
      color="success"
      variant="contained"
      startIcon={<Iconify icon="solar:check-circle-bold" />}
      onClick={openApprove}
    >
      {tCommon('actions.approve')}
    </Button>
  )}
  <Button
    type="submit"
    variant="outlined"
    startIcon={<Iconify icon="solar:file-check-bold-duotone" />}
    loading={submitting.value}
  >
    {saveDraftLabel}
  </Button>
  {canSubmit && (
    <Button
      type="button"
      variant="contained"
      startIcon={<Iconify icon="eva:arrow-forward-fill" />}
      onClick={onSaveAndSubmit}
      loading={submitting.value}
    >
      {t('buttons.saveAndSubmit')}
    </Button>
  )}
</DialogActions>
```

## Detail dialog dengan tabs

**Detail dialog (read-only view) tidak pakai `<DialogActions>` sama sekali** kalau action buttons (Edit/Submit/Approve/Reject/Delete) sudah dirender inline di status card. **Jangan** tambahkan tombol "Tutup"/"Close" di bawah — X icon di title sudah cukup, sama dengan konvensi form dialog. Kalau semua action diletakkan inline di status card, hapus juga import `DialogActions`.

Exception: kalau action buttons justru diletakkan di `<DialogActions>` (bottom bar — pola alternatif yang dipakai journal-entry), isinya **hanya action buttons**, tetap tidak ada tombol Tutup.

```tsx
<Dialog open={open} onClose={onClose} fullWidth maxWidth="lg"
  transitionDuration={{ enter: shortest, exit: shortest - 80 }}>
  <DialogTitle>
    {/* transfer_no + description + X close */}
  </DialogTitle>
  <DialogContent dividers>
    <Stack spacing={2.5}>
      {/* Status card dengan action buttons */}
      <Box border="...">
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <StatusLabel status={data.status} />
            <LinearProgress value={progressValue(data)} />
          </Stack>
          {renderActionButtons(data)}  {/* Edit, Submit, Approve, Reject, Delete */}
        </Stack>
      </Box>

      {/* Tabs — label via t() */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab value="detail" label={t('tabs.detail')} icon={<Iconify ... />} iconPosition="start" />
        <Tab value="approval" label={t('tabs.approvalHistory')} ... />
        <Tab value="audit" label={t('tabs.auditLog')} ... />
      </Tabs>

      {/* Tab content */}
      <Box>
        {tab === 'detail' && <DetailTab />}
        {tab === 'approval' && <ApprovalHistoryTab ... />}
        {tab === 'audit' && <AuditLogTab ... />}
      </Box>
    </Stack>
  </DialogContent>
  {/* Tidak ada <DialogActions> dengan tombol Tutup — X di title cukup */}
</Dialog>
```

## Quick action confirm dialog

Reusable untuk submit/approve/reject/delete tanpa buka detail:

```tsx
<FundTransferConfirmDialog
  open
  title={t('confirm.reject.title')}
  description={`${transfer.transfer_no} · ${transfer.description || t('detail.noDescription')}`}
  confirmLabel={t('confirm.reject.confirm')}
  confirmColor="warning"
  requireComment={true}            // tampilkan textarea + validate
  commentLabel={t('confirm.reject.commentLabel')}
  commentPlaceholder={t('confirm.reject.commentPlaceholder')}
  loading={actionLoading}
  onClose={() => setQuickAction({ type: 'none' })}
  onConfirm={handleQuickConfirm}
/>
```

Action config per tipe (submit/approve/reject/delete) biasanya di-ekstrak ke helper `getActionConfig(action, t)` yang return object `{title, confirmLabel, commentLabel, commentPlaceholder, ...}` — semua sudah translated. Lihat [fund-transfer-detail-dialog.tsx](../../src/module/finance/features/fund-transfer/components/fund-transfer-detail-dialog.tsx).

Shared `ConfirmDialog` (`src/shared/ui/confirm-dialog`) **menunggu sendiri** kalau `onConfirm` me-return promise: tombol konfirmasi spinner, Cancel/X/backdrop terkunci sampai selesai. Cukup `onConfirm={remove}` dengan `remove` async — prop `loading` hanya perlu kalau proses berjalan di luar `onConfirm`.

## Loading state aksi async (wajib)

Setiap tombol / field yang memicu request **wajib** menunjukkan request sedang jalan. Tanpa itu dialog terlihat "stuck" (request + refresh bisa 1–2 detik) dan double-click mengirim request dua kali.

Pakai `useAsyncAction()` dari `src/shared/hooks/use-async-action` — `pending` untuk UI, `run()` mengabaikan klik kedua selama masih pending.

**Form dialog RHF** yang menyimpan sendiri lewat `handleSubmit` (pola [item-form-dialog.tsx](../../src/module/core/features/demo/components/item-form-dialog.tsx)) sudah memenuhi aturan ini dengan `submitting = useBoolean()` — `onClose={submitting.value ? undefined : onClose}`, X `disabled`, tombol submit `loading={submitting.value}`. Tidak perlu diganti.

**Form dialog yang mendelegasikan save ke parent** — `onSave` boleh me-return promise; dialog yang memegang state loading-nya:

```tsx
type Props = {
  onSave: (value: Value) => Promise<void> | void; // parent: async, refresh + feedback di dalamnya
};

const saving = useAsyncAction();
const submit = () => {
  setTouched(true);
  if (error) return;
  saving.run(() => onSave(value));
};

<MotionDialog open={open} onClose={saving.pending ? undefined : onClose}>
  <IconButton onClick={onClose} disabled={saving.pending}>…</IconButton>
  …
  <Button variant="contained" loading={saving.pending} onClick={submit}>
```

**Tombol aksi inline** (submit, approve, export, kirim ulang): satu `useAsyncAction` per tombol → `loading={x.pending}`.

**Field auto-save** (simpan on blur / on change — select, switch, text): field `disabled={x.pending}` + `<SavingAdornment pending={x.pending} />` (`src/shared/ui/saving-adornment`) sebagai `endAdornment`; prop `select` untuk `TextField select` supaya tidak menimpa panah dropdown. Switch: `CircularProgress size={14}` di label. Satu action per field — hanya field yang sedang disimpan yang terkunci. Panggil `run` **setelah** cek "tidak berubah", supaya field tidak berkedip disabled di setiap blur.

Error tetap ditangani di dalam action — `<ErrorDialog>` untuk error save/delete, `toast.error` hanya untuk error ringan ([feedback.md](feedback.md)). `run` tidak menelan error.

Referensi: [confirm-dialog.tsx](../../src/shared/ui/confirm-dialog/confirm-dialog.tsx) (async `onConfirm`), [use-async-action.ts](../../src/shared/hooks/use-async-action.ts), [saving-adornment.tsx](../../src/shared/ui/saving-adornment/saving-adornment.tsx).

## Jangan lupa

- **After save**: `onSaved(entity)` — parent biasanya auto-open view dialog + refresh list
- **After delete**: `onDeleted(id)` + `onClose()` — parent refresh list
- **After approve/reject**: update local data + call parent `onChanged(entity)` + refresh approval/audit
- **Loading state initial fetch**: skeleton, bukan spinner — terasa lebih halus

## Reference implementation

- [src/module/finance/features/fund-transfer/hooks/use-fund-transfer-dialog.ts](../../src/module/finance/features/fund-transfer/hooks/use-fund-transfer-dialog.ts)
- [src/module/finance/features/fund-transfer/components/fund-transfer-form-dialog.tsx](../../src/module/finance/features/fund-transfer/components/fund-transfer-form-dialog.tsx)
- [src/module/finance/features/fund-transfer/components/fund-transfer-detail-dialog.tsx](../../src/module/finance/features/fund-transfer/components/fund-transfer-detail-dialog.tsx)
- [src/module/finance/features/fund-transfer/components/fund-transfer-confirm-dialog.tsx](../../src/module/finance/features/fund-transfer/components/fund-transfer-confirm-dialog.tsx)
