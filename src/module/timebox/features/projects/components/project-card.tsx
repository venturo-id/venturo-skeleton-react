// ProjectCard - Display project in sidebar/list view

import type { Project } from 'src/module/timebox/types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface ProjectCardProps {
  project: Project;
  isActive?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  collapsed?: boolean;
  showTaskCount?: boolean;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function ProjectCard({
  project,
  isActive = false,
  isHovered = false,
  onClick,
  onToggleFavorite,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  collapsed = false,
  showTaskCount = true,
}: ProjectCardProps) {
  if (collapsed) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 0.75,
          px: 1,
          cursor: 'pointer',
          borderRadius: 1,
          ...(isActive && {
            bgcolor: 'action.selected',
          }),
          ...(isHovered && {
            bgcolor: 'action.hover',
          }),
        }}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: 1,
            bgcolor: project.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
          }}
        >
          {project.icon || '📁'}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 0.75,
        px: 1.5,
        cursor: 'pointer',
        borderRadius: 1,
        transition: 'background-color 150ms',
        ...(isActive && {
          bgcolor: 'action.selected',
        }),
        ...(isHovered && !isActive && {
          bgcolor: 'action.hover',
        }),
      }}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Color indicator / Icon */}
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: 1,
          bgcolor: project.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          flexShrink: 0,
        }}
      >
        {project.icon || '📁'}
      </Box>

      {/* Project name */}
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {project.name}
      </Typography>

      {/* Task count badge */}
      {showTaskCount && project._count?.tasks !== undefined && (
        <Chip
          label={project._count.tasks}
          size="small"
          sx={{
            height: 20,
            fontSize: 11,
            fontWeight: 500,
            bgcolor: 'text.disabled',
            color: 'background.paper',
            '& .MuiChip-label': {
              px: 0.75,
            },
          }}
        />
      )}

      {/* Favorite star */}
      {project.isFavorite && (
        <Iconify
          icon="solar:cup-star-bold"
          width={14}
          sx={{ color: 'warning.main', flexShrink: 0 }}
        />
      )}

      {/* Actions (only show on hover) */}
      {isHovered && (
        <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            sx={{ p: 0.5 }}
          >
            <Iconify
              icon={project.isFavorite ? 'solar:cup-star-bold' : 'solar:cup-star-bold'}
              width={14}
              sx={{ color: project.isFavorite ? 'warning.main' : 'text.disabled' }}
            />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
}
