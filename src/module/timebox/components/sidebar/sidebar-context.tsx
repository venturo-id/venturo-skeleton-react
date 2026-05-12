import { useState, useContext, useCallback, createContext, type ReactNode } from 'react';

import { TIMEBOX_STORAGE_KEYS } from '../../utils/constants';
import { storageGet, storageSet, storageGetArray } from '../../utils/storage.helpers';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface SidebarContextValue {
  // Sidebar visibility
  isCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;

  // Section collapse state
  collapsedSections: Set<string>;
  toggleSection: (sectionId: string) => void;
  collapseSection: (sectionId: string) => void;
  expandSection: (sectionId: string) => void;
  isSectionCollapsed: (sectionId: string) => boolean;

  // Project tree state
  expandedProjects: Set<string>;
  toggleProject: (projectId: string) => void;
  isProjectExpanded: (projectId: string) => boolean;
}

interface SidebarProviderProps {
  children: ReactNode;
  defaultCollapsed?: boolean;
  defaultCollapsedSections?: string[];
}

// ----------------------------------------------------------------------
// Context
// ----------------------------------------------------------------------

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

// ----------------------------------------------------------------------
// Provider
// ----------------------------------------------------------------------

export function SidebarProvider({ children, defaultCollapsed = false, defaultCollapsedSections = [] }: SidebarProviderProps) {
  // Load from localStorage or use defaults
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = storageGet<boolean>(TIMEBOX_STORAGE_KEYS.SIDEBAR_COLLAPSED);
    return saved ?? defaultCollapsed;
  });

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
    const saved = storageGetArray<string>(TIMEBOX_STORAGE_KEYS.COLLAPSED_SECTIONS);
    return new Set(saved.length > 0 ? saved : defaultCollapsedSections);
  });

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(() => {
    const saved = storageGetArray<string>(`${TIMEBOX_STORAGE_KEYS.SIDEBAR_COLLAPSED}-projects`);
    return new Set(saved);
  });

  // Sidebar visibility handlers
  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      storageSet(TIMEBOX_STORAGE_KEYS.SIDEBAR_COLLAPSED, newValue);
      return newValue;
    });
  }, []);

  const collapseSidebar = useCallback(() => {
    setIsCollapsed(true);
    storageSet(TIMEBOX_STORAGE_KEYS.SIDEBAR_COLLAPSED, true);
  }, []);

  const expandSidebar = useCallback(() => {
    setIsCollapsed(false);
    storageSet(TIMEBOX_STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
  }, []);

  // Section collapse handlers
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      storageSet(TIMEBOX_STORAGE_KEYS.COLLAPSED_SECTIONS, Array.from(newSet));
      return newSet;
    });
  }, []);

  const collapseSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      newSet.add(sectionId);
      storageSet(TIMEBOX_STORAGE_KEYS.COLLAPSED_SECTIONS, Array.from(newSet));
      return newSet;
    });
  }, []);

  const expandSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      storageSet(TIMEBOX_STORAGE_KEYS.COLLAPSED_SECTIONS, Array.from(newSet));
      return newSet;
    });
  }, []);

  const isSectionCollapsed = useCallback(
    (sectionId: string) => collapsedSections.has(sectionId),
    [collapsedSections]
  );

  // Project tree handlers
  const toggleProject = useCallback((projectId: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      storageSet(`${TIMEBOX_STORAGE_KEYS.SIDEBAR_COLLAPSED}-projects`, Array.from(newSet));
      return newSet;
    });
  }, []);

  const isProjectExpanded = useCallback(
    (projectId: string) => expandedProjects.has(projectId),
    [expandedProjects]
  );

  const value: SidebarContextValue = {
    isCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    collapsedSections,
    toggleSection,
    collapseSection,
    expandSection,
    isSectionCollapsed,
    expandedProjects,
    toggleProject,
    isProjectExpanded,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// ----------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------

export function useSidebarContext(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within SidebarProvider');
  }
  return context;
}
