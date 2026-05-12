// Projects Page - List all projects in a grid view

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { useProjects } from 'src/module/timebox/features/projects/hooks';
import { ProjectCard } from 'src/module/timebox/features/projects/components/project-card';
import { ProjectCreateDialog } from 'src/module/timebox/features/projects/components/project-create-dialog';
import { ProjectUpdateDialog } from 'src/module/timebox/features/projects/components/project-update-dialog';

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export default function ProjectsPage() {
  const { t } = useTranslate('timebox.projects');
  const { data: projects, isLoading, error } = useProjects();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleEditProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsEditDialogOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <Typography variant="body2" color="error">
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100%' }}>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {t('projects')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {projects?.length ?? 0} project{projects && projects.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" width={18} />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          {t('newProject')}
        </Button>
      </Stack>

      {/* Projects Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleEditProject(project.id)}
          />
        ))}

        {(!projects || projects.length === 0) && (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              color: 'text.disabled',
              gridColumn: '1 / -1',
            }}
          >
            <Iconify icon="solar:add-folder-bold" width={64} sx={{ mb: 2 }} />
            <Typography variant="h6">No projects yet</Typography>
            <Typography variant="body2">
              Create your first project to get started
            </Typography>
          </Box>
        )}
      </Box>

      {/* Create Dialog */}
      <ProjectCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreated={() => setIsCreateDialogOpen(false)}
      />

      {/* Edit Dialog */}
      {selectedProjectId && (
        <ProjectUpdateDialog
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedProjectId(null);
          }}
          projectId={selectedProjectId}
          onUpdated={() => {
            setIsEditDialogOpen(false);
            setSelectedProjectId(null);
          }}
        />
      )}
    </Box>
  );
}