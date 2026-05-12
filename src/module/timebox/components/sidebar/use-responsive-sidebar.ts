import { useEffect } from 'react';

import { useTheme, useMediaQuery } from '@mui/material';

import { useSidebarContext } from './sidebar-context';

// ----------------------------------------------------------------------
// Hook: Responsive sidebar behavior
// ----------------------------------------------------------------------

export function useResponsiveSidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const { isCollapsed, collapseSidebar, expandSidebar } = useSidebarContext();

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    if (isMobile && !isCollapsed) {
      collapseSidebar();
    } else if (isDesktop && isCollapsed) {
      expandSidebar();
    }
  }, [isMobile, isDesktop, isCollapsed, collapseSidebar, expandSidebar]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isCollapsed,
    shouldShowSidebar: isDesktop,
  };
}

// ----------------------------------------------------------------------
// Hook: Keyboard shortcuts for sidebar
// ----------------------------------------------------------------------

export function useSidebarShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        // Will be implemented with context
        console.log('Toggle sidebar');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
