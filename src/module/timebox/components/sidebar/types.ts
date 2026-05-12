// Types for Timebox sidebar components


// ----------------------------------------------------------------------
// Sidebar State
// ----------------------------------------------------------------------

export interface SidebarState {
  collapsed: boolean;
  width: number;
  collapsedSections: Set<string>;
}

// ----------------------------------------------------------------------
// Project Tree Item
// ----------------------------------------------------------------------

export interface ProjectTreeItemData {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  taskCount?: number;
  completedCount?: number;
  isFavorite?: boolean;
  isInbox?: boolean;
  isArchived?: boolean;
  path: string;
  teamId?: string | null;
  children?: ProjectTreeItemData[];
}

export interface ProjectTreeItemProps {
  data: ProjectTreeItemData;
  level?: number;
  expanded?: boolean;
  selected?: boolean;
  onToggleExpand?: (id: string) => void;
  onClick?: (data: ProjectTreeItemData) => void;
  onContextMenu?: (data: ProjectTreeItemData, event: React.MouseEvent) => void;
}

// ----------------------------------------------------------------------
// Project Tree Section
// ----------------------------------------------------------------------

export interface ProjectTreeSectionProps {
  id: string;
  title: string;
  items: ProjectTreeItemData[];
  expanded?: boolean;
  onToggleSection?: (id: string) => void;
  onItemClick?: (data: ProjectTreeItemData) => void;
  onItemToggle?: (id: string) => void;
  onItemContextMenu?: (data: ProjectTreeItemData, event: React.MouseEvent) => void;
}

// ----------------------------------------------------------------------
// Sidebar Header
// ----------------------------------------------------------------------

export interface SidebarHeaderProps {
  userName?: string;
  userAvatar?: string | null;
  userEmail?: string;
  notificationCount?: number;
  onMenuOpen?: () => void;
  onNotificationClick?: () => void;
  onHideSidebar?: () => void;
}

// ----------------------------------------------------------------------
// Quick Add Button
// ----------------------------------------------------------------------

export interface QuickAddButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

// ----------------------------------------------------------------------
// Navigation Item
// ----------------------------------------------------------------------

export interface NavItemData {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
  onClick?: () => void;
}

export interface NavSectionProps {
  title?: string;
  items: NavItemData[];
}
