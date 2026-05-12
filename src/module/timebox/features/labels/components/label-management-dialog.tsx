// LabelManagementDialog - Full label management dialog

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Label, LabelFormData } from 'src/module/timebox/types';

import * as z from 'zod';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo , useState , useEffect } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSensor, DndContext, useSensors, DragOverlay, closestCenter, PointerSensor } from '@dnd-kit/core';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { MotionDialog } from 'src/shared/ui/animate';
import { Form, Field } from 'src/shared/ui/hook-form';
import { ErrorDialog } from 'src/shared/ui/error-dialog';
import { DEFAULT_LABEL_COLORS } from 'src/module/timebox/utils/constants';

// ----------------------------------------------------------------------
// Schema
// ----------------------------------------------------------------------

function makeSchema(t: any) {
  return z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color'),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface LabelManagementDialogProps {
  open: boolean;
  onClose: () => void;
  labels: Label[];
  onCreateLabel: (data: LabelFormData) => Promise<Label>;
  onUpdateLabel: (id: string, data: Partial<LabelFormData>) => Promise<Label>;
  onDeleteLabel: (id: string) => Promise<void>;
  onReorderLabels: (labelIds: string[]) => Promise<void>;
}

// ----------------------------------------------------------------------
// Sortable Label Item
// ----------------------------------------------------------------------

interface SortableLabelItemProps {
  label: Label;
  isEditing: boolean;
  onEdit: (label: Label) => void;
  onDelete: (id: string) => void;
}

function SortableLabelItem({ label, isEditing, onEdit, onDelete }: SortableLabelItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: label.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box
        sx={{
          px: 1.5,
          py: 1,
          mb: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: `${label.color}20`,
          border: '1px solid',
          borderColor: label.color,
          transition: 'all 150ms',
          '&:hover': {
            bgcolor: `${label.color}30`,
          },
        }}
      >
        {/* Drag Handle */}
        <Box {...listeners} sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
          <Iconify icon="solar:restart-bold" width={16} />
        </Box>

        {/* Color Indicator */}
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: label.color,
            flexShrink: 0,
          }}
        />

        {/* Name */}
        <Typography
          variant="body2"
          sx={{
            flex: 1,
            fontWeight: 500,
            color: '#000',
          }}
        >
          {label.name}
        </Typography>

        {/* Actions */}
        <Stack direction="row" spacing={0.25}>
          <IconButton
            size="small"
            onClick={() => onEdit(label)}
            sx={{ p: 0.5 }}
          >
            <Iconify icon="solar:pen-bold" width={14} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              if (window.confirm(`Delete label "${label.name}"?`)) {
                onDelete(label.id);
              }
            }}
            sx={{ p: 0.5 }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={14} />
          </IconButton>
        </Stack>
      </Box>
    </div>
  );
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function LabelManagementDialog({
  open,
  onClose,
  labels,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
  onReorderLabels,
}: LabelManagementDialogProps) {
  const { t } = useTranslate('labels');
  const { t: tCommon } = useTranslate('common');
  const schema = useMemo(() => makeSchema(t), [t]);

  const creating = useBoolean();
  const updating = useBoolean();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Form for creating/editing
  const defaultValues: FormValues = useMemo(
    () => ({
      name: '',
      color: DEFAULT_LABEL_COLORS[0],
    }),
    []
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { handleSubmit, reset, watch, setValue } = methods;

  const watchedColor = watch('color');

  useEffect(() => {
    if (!isAdding && !editingLabel) {
      reset();
    }
  }, [isAdding, editingLabel, reset]);

  useEffect(() => {
    if (!open) {
      setIsAdding(false);
      setEditingLabel(null);
      setErrorMsg(null);
    }
  }, [open]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCreate = handleSubmit(async (values) => {
    setErrorMsg(null);
    creating.onTrue();
    try {
      await onCreateLabel(values);
      reset();
      setIsAdding(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create label');
    } finally {
      creating.onFalse();
    }
  });

  const handleUpdate = handleSubmit(async (values) => {
    if (!editingLabel) return;

    setErrorMsg(null);
    updating.onTrue();
    try {
      await onUpdateLabel(editingLabel.id, values);
      setEditingLabel(null);
      reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update label');
    } finally {
      updating.onFalse();
    }
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDragId(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = labels.findIndex((l) => l.id === active.id);
    const newIndex = labels.findIndex((l) => l.id === over.id);

    const reordered = [...labels];
    const [movedItem] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, movedItem);

    await onReorderLabels(reordered.map((l) => l.id));
  };

  const startAdd = () => {
    setEditingLabel(null);
    reset();
    setIsAdding(true);
  };

  const startEdit = (label: Label) => {
    setIsAdding(false);
    setEditingLabel(label);
    reset({
      name: label.name,
      color: label.color,
    });
  };

  const hasForm = isAdding || editingLabel;

  return (
    <>
      <MotionDialog
        open={open}
        onClose={hasForm ? undefined : onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, pr: 2.5 }}>
          <Box sx={{ flex: 1 }}>{t('dialog.manageTitle')}</Box>
          <IconButton size="small" onClick={onClose} disabled={!!hasForm}>
            <Iconify icon="mingcute:close-line" width={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2}>
            {/* Create/Edit Form */}
            {(isAdding || editingLabel) && (
              <Form methods={methods} onSubmit={isAdding ? handleCreate : handleUpdate} sx={{ display: 'contents' }}>
                <Stack spacing={2}>
                  <Field.Text
                    name="name"
                    label={editingLabel ? t('form.editName') : t('form.name')}
                    autoFocus
                  />

                  {/* Color Picker */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {t('form.color')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {DEFAULT_LABEL_COLORS.map((color) => (
                        <Box
                          key={color}
                          onClick={() => setValue('color', color)}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: color,
                            cursor: 'pointer',
                            border: '2px solid',
                            borderColor: watchedColor === color ? 'primary.main' : 'transparent',
                            transition: 'border-color 150ms',
                            '&:hover': {
                              borderColor: watchedColor === color ? 'primary.main' : 'text.disabled',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={creating.value || updating.value}
                      startIcon={
                        isAdding ? (
                          <Iconify icon="solar:add-circle-bold" width={16} />
                        ) : null
                      }
                    >
                      {isAdding
                        ? creating.value
                          ? tCommon('saving')
                          : t('form.create')
                        : updating.value
                          ? tCommon('saving')
                          : t('form.save')}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setIsAdding(false);
                        setEditingLabel(null);
                        reset();
                      }}
                      disabled={creating.value || updating.value}
                    >
                      {tCommon('cancel')}
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}

            {/* Labels List */}
            {!hasForm && (
              <>
                {/* Add Button */}
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:add-circle-bold" width={16} />}
                  onClick={startAdd}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {t('form.create')}
                </Button>

                {/* Draggable List */}
                {labels.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <DragOverlay>
                      <Box
                        sx={{
                          width: 'calc(100% - 48px)',
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          opacity: 0.5,
                          border: '1px dashed',
                          borderColor: 'primary.main',
                        }}
                      >
                        <Typography variant="body2">
                          {labels.find((l) => l.id === activeDragId)?.name || 'Label'}
                        </Typography>
                      </Box>
                    </DragOverlay>
                    <SortableContext items={labels.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                      {labels.map((label: Label) => {
                        const editingId = (editingLabel as Label | null)?.id ?? null;
                        const isEditing = editingId !== null && label.id === editingId;
                        return (
                          <SortableLabelItem
                            key={label.id}
                            label={label}
                            isEditing={isEditing}
                            onEdit={startEdit}
                            onDelete={onDeleteLabel}
                          />
                        );
                      })}
                    </SortableContext>
                  </DndContext>
                )}

                {labels.length === 0 && (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    <Typography variant="body2">{t('noLabels')}</Typography>
                  </Box>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
      </MotionDialog>

      <ErrorDialog
        open={!!errorMsg}
        title={t('errors.title')}
        message={errorMsg || ''}
        onClose={() => setErrorMsg(null)}
      />
    </>
  );
}
