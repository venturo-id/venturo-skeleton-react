import type { ProjectTreeItemProps } from './types';

import { varAlpha } from 'minimal-shared/utils';
import { useState, type MouseEvent } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

interface ProjectIconProps {
  color: string;
  icon?: string | null;
  size?: number;
}

function ProjectIcon({ color, icon, size = 20 }: ProjectIconProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: 1,
        bgcolor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        color: (theme) => {
          // Calculate contrast color
          const hex = color.replace('#', '');
          const r = Number.parseInt(hex.substring(0, 2), 16);
          const g = Number.parseInt(hex.substring(2, 4), 16);
          const b = Number.parseInt(hex.substring(4, 6), 16);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          return luminance > 0.5 ? '#000000' : '#FFFFFF';
        },
      }}
    >
      {icon || '📁'}
    </Box>
  );
}

interface FavoriteStarProps {
  isFavorite?: boolean;
  size?: number;
}

function FavoriteStar({ isFavorite, size = 16 }: FavoriteStarProps) {
  if (!isFavorite) return null;

  return (
    <Iconify
      icon="solar:cup-star-bold"
      width={size}
      sx={{
        color: 'warning.main',
        mr: 0.5,
        flexShrink: 0,
      }}
    />
  );
}

interface TaskCountBadgeProps {
  count?: number;
  completedCount?: number;
}

function TaskCountBadge({ count, completedCount }: TaskCountBadgeProps) {
  if (count === undefined) return null;

  return (
    <Typography
      variant="caption"
      sx={{
        color: 'text.secondary',
        fontSize: '0.75rem',
        ml: 'auto',
        flexShrink: 0,
      }}
    >
      {completedCount !== undefined ? `${completedCount}/${count}` : count}
    </Typography>
  );
}

// ----------------------------------------------------------------------
// ProjectTreeItem Component
// ----------------------------------------------------------------------

export function ProjectTreeItem({
  data,
  level = 0,
  expanded = false,
  selected = false,
  onToggleExpand,
  onClick,
  onContextMenu,
}: ProjectTreeItemProps) {
  const [internalExpanded, setInternalExpanded] = useState(expanded);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  const hasChildren = data.children && data.children.length > 0;
  const paddingLeft = 12 + level * 16; // Base padding + level indent

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (isControlled) {
      onToggleExpand?.(data.id);
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const handleClick = (e: MouseEvent) => {
    // If clicking on expand button, don't trigger item click
    if ((e.target as HTMLElement).closest('.expand-button')) return;
    onClick?.(data);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(data, e);
  };

  return (
    <Box>
      {/* Project row */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        sx={{
          px: 2,
          py: 1,
          pl: paddingLeft / 8, // Convert px to MUI spacing unit
          cursor: 'pointer',
          borderRadius: 1.5,
          transition: (theme) =>
            theme.transitions.create(['background-color', 'transform'], {
              duration: theme.transitions.duration.shortest,
            }),
          bgcolor: selected ? varAlpha('grey.500Channel', 0.08) : 'transparent',
          '&:hover': {
            bgcolor: selected ? varAlpha('grey.500Channel', 0.12) : 'action.hover',
          },
          '& .expand-button': {
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          },
        }}
      >
        {/* Expand/Collapse button */}
        {hasChildren ? (
          <IconButton
            className="expand-button"
            size="small"
            onClick={handleToggle}
            sx={{
              p: 0.5,
              mr: -0.5,
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: (theme) =>
                theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shorter,
                }),
            }}
          >
            <Iconify icon="solar:double-alt-arrow-right-bold-duotone" width={16} />
          </IconButton>
        ) : (
          <Box sx={{ width: 28, flexShrink: 0 }} /> // Spacer
        )}

        {/* Project icon */}
        <ProjectIcon color={data.color} icon={data.icon} size={18} />

        {/* Project name */}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <FavoriteStar isFavorite={data.isFavorite} />
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.name}
          </Typography>
        </Stack>

        {/* Task count */}
        <TaskCountBadge count={data.taskCount} completedCount={data.completedCount} />
      </Stack>

      {/* Children (nested projects) */}
      {hasChildren && (
        <Collapse in={isExpanded} unmountOnExit>
          <Box>
            {data.children!.map((child) => (
              <ProjectTreeItem
                key={child.id}
                data={child}
                level={level + 1}
                selected={selected}
                onToggleExpand={onToggleExpand}
                onClick={onClick}
                onContextMenu={onContextMenu}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
