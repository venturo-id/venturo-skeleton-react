import type { ProjectTreeSectionProps } from './types';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';

import { ProjectTreeItem } from './project-tree-item';

export function ProjectTreeSection({
  id,
  title,
  items,
  expanded = true,
  onToggleSection,
  onItemClick,
  onItemToggle,
  onItemContextMenu,
}: ProjectTreeSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(expanded);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  const handleToggle = () => {
    if (isControlled) {
      onToggleSection?.(id);
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  // Calculate total task count
  const totalTasks = items.reduce((sum, item) => sum + (item.taskCount || 0), 0);

  return (
    <Box>
      {/* Section header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        onClick={handleToggle}
        sx={{
          px: 2,
          py: 1,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <IconButton
          size="small"
          sx={{
            p: 0.5,
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: (theme) =>
              theme.transitions.create('transform', {
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:double-alt-arrow-right-bold-duotone" width={16} />
        </IconButton>

        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            flex: 1,
          }}
        >
          {title}
        </Typography>

        {totalTasks > 0 && (
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              color: 'text.disabled',
            }}
          >
            {totalTasks}
          </Typography>
        )}
      </Stack>

      {/* Section content */}
      <Collapse in={isExpanded} unmountOnExit>
        <Box>
          {items.map((item) => (
            <ProjectTreeItem
              key={item.id}
              data={item}
              onClick={onItemClick}
              onToggleExpand={onItemToggle}
              onContextMenu={onItemContextMenu}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
