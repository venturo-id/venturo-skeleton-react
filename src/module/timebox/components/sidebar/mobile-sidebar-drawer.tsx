import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { TimeboxSidebar } from './timebox-sidebar';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface MobileSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  sidebarData?: {
    userName?: string;
    userAvatar?: string | null;
    userEmail?: string;
    inboxCount?: number;
    projects?: Array<{
      id: string;
      name: string;
      color: string;
      icon?: string | null;
      taskCount?: number;
      completedCount?: number;
      isFavorite?: boolean;
      path: string;
      children?: Array<{
        id: string;
        name: string;
        color: string;
        icon?: string | null;
        taskCount?: number;
        completedCount?: number;
        path: string;
      }>;
    }>;
    favoriteProjects?: Array<{
      id: string;
      name: string;
      color: string;
      icon?: string | null;
      taskCount?: number;
      completedCount?: number;
      path: string;
    }>;
    teamProjects?: Record<string, Array<{
      id: string;
      name: string;
      color: string;
      icon?: string | null;
      taskCount?: number;
      completedCount?: number;
      path: string;
    }>>;
  };
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function MobileSidebarDrawer({ open, onClose, sidebarData }: MobileSidebarDrawerProps) {
  // Disable body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      <TimeboxSidebar
        userName={sidebarData?.userName}
        userAvatar={sidebarData?.userAvatar}
        userEmail={sidebarData?.userEmail}
        inboxCount={sidebarData?.inboxCount}
        projects={sidebarData?.projects}
        favoriteProjects={sidebarData?.favoriteProjects}
        teamProjects={sidebarData?.teamProjects}
        onAddTask={() => {
          console.log('Add task clicked');
        }}
        onAddProject={() => {
          console.log('Add project clicked');
        }}
        onAddTeam={() => {
          console.log('Add team clicked');
        }}
        onSearch={() => {
          console.log('Search clicked');
        }}
      />
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: 'background.paper',
        },
      }}
      sx={{
        display: { lg: 'none' },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
