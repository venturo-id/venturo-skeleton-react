// SortableSubtaskRow - Draggable subtask row

import type { Subtask } from 'src/module/timebox/types';

import { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface SortableSubtaskRowProps {
  subtask: Subtask;
  onToggle: (subtaskId: string) => void;
  onDelete?: (subtaskId: string) => void;
  onEdit?: (subtaskId: string, title: string) => void;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function SortableSubtaskRow({
  subtask,
  onToggle,
  onDelete,
  onEdit,
}: SortableSubtaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subtask.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editTitle.trim() && onEdit) {
      onEdit(subtask.id, editTitle);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(subtask.title);
    setIsEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box
        sx={{
          px: 1,
          py: 0.75,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 150ms',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {/* Drag Handle */}
        <Box {...listeners} sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
          <Iconify icon="solar:restart-bold" width={16} sx={{ color: 'text.disabled' }} />
        </Box>

        {/* Checkbox */}
        <Box
          onClick={() => onToggle(subtask.id)}
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: subtask.completed ? 'primary.main' : 'text.disabled',
            bgcolor: subtask.completed ? 'primary.main' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 150ms',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          {subtask.completed && (
            <Iconify icon="solar:file-check-bold-duotone" width={12} sx={{ color: '#fff' }} />
          )}
        </Box>

        {/* Title */}
        {isEditing ? (
          <TextField
            size="small"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            sx={{ flex: 1 }}
            autoFocus
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              textDecoration: subtask.completed ? 'line-through' : 'none',
              color: subtask.completed ? 'text.disabled' : 'text.primary',
            }}
          >
            {subtask.title}
          </Typography>
        )}

        {/* Actions */}
        <Stack direction="row" spacing={0.25}>
          {isEditing ? (
            <>
              <IconButton size="small" onClick={handleSave} sx={{ p: 0.5 }}>
                <Iconify icon="solar:file-check-bold-duotone" width={16} sx={{ color: 'primary.main' }} />
              </IconButton>
              <IconButton size="small" onClick={handleCancel} sx={{ p: 0.5 }}>
                <Iconify icon="solar:close-circle-bold" width={16} sx={{ color: 'text.disabled' }} />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ p: 0.5 }}>
                <Iconify icon="solar:pen-bold" width={14} sx={{ color: 'text.secondary' }} />
              </IconButton>
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={() => {
                    if (window.confirm('Delete this subtask?')) {
                      onDelete(subtask.id);
                    }
                  }}
                  sx={{ p: 0.5 }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" width={14} sx={{ color: 'error.main' }} />
                </IconButton>
              )}
            </>
          )}
        </Stack>
      </Box>
    </div>
  );
}
