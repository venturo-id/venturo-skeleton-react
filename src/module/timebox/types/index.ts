// Core entity types for Timebox module
// Based on space-fe-timebox-v3 but adapted for venturo-skeleton-react patterns

// ----------------------------------------------------------------------
// Task
// ----------------------------------------------------------------------

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  projectId: string;
  sectionId?: string | null;
  priority: TaskPriority;
  labels: Label[];
  dueDate?: string | null; // ISO date string (YYYY-MM-DD)
  dueDatetime?: string | null; // ISO datetime string with time
  reminderAt?: string | null; // ISO datetime string
  completedAt?: string | null; // ISO datetime string
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  position: number; // For sorting
  // Relations - lazy loaded
  comments?: Comment[];
  subtasks?: Subtask[];
  attachments?: Attachment[];
  // Assignees (if multi-user)
  assigneeIds?: string[];
}

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface TaskFormData {
  title: string;
  description?: string;
  projectId: string;
  sectionId?: string | null;
  priority: TaskPriority;
  labelIds: string[];
  dueDate?: string | null;
  dueDatetime?: string | null;
  reminderAt?: string | null;
  assigneeIds?: string[];
}

// ----------------------------------------------------------------------
// Project
// ----------------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  color: string; // Hex color
  icon?: string | null; // Emoji or icon name
  isFavorite: boolean;
  isArchived: boolean;
  isInbox: boolean; // Special inbox project
  viewMode: ProjectViewMode;
  teamId?: string | null;
  createdAt: string;
  updatedAt: string;
  position: number;
  // Relations - lazy loaded
  sections?: Section[];
  tasks?: Task[];
  _count?: {
    tasks?: number;
    completedTasks?: number;
  };
}

export type ProjectViewMode = 'board' | 'list';

export interface ProjectFormData {
  name: string;
  color: string;
  icon?: string;
  teamId?: string | null;
}

// ----------------------------------------------------------------------
// Section
// ----------------------------------------------------------------------

export interface Section {
  id: string;
  projectId: string;
  name: string;
  collapsed: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  tasks?: Task[];
}

export interface SectionFormData {
  name: string;
}

// ----------------------------------------------------------------------
// Label
// ----------------------------------------------------------------------

export interface Label {
  id: string;
  name: string;
  color: string; // Hex color
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface LabelFormData {
  name: string;
  color: string;
}

// ----------------------------------------------------------------------
// Comment
// ----------------------------------------------------------------------

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  authorId: string;
  authorName?: string;
  authorAvatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentFormData {
  content: string;
}

// ----------------------------------------------------------------------
// Subtask
// ----------------------------------------------------------------------

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubtaskFormData {
  title: string;
}

// ----------------------------------------------------------------------
// Attachment
// ----------------------------------------------------------------------

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

// ----------------------------------------------------------------------
// Team
// ----------------------------------------------------------------------

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  position: number;
  // Relations
  members?: TeamMember[];
  projects?: Project[];
  _count?: {
    members?: number;
    projects?: number;
  };
}

export interface TeamMember {
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamRole;
  joinedAt: string;
}

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface TeamFormData {
  name: string;
  description?: string;
}

// ----------------------------------------------------------------------
// Filter
// ----------------------------------------------------------------------

export interface Filter {
  id: string;
  name: string;
  icon?: string | null;
  query: FilterQuery;
  createdAt: string;
  updatedAt: string;
}

export interface FilterQuery {
  labelIds?: string[];
  projectIds?: string[];
  priorities?: TaskPriority[];
  dueDate?: FilterDueDate;
  assigneeIds?: string[];
}

export type FilterDueDate =
  | 'today'
  | 'tomorrow'
  | 'this_week'
  | 'next_week'
  | 'overdue'
  | 'no_date';

// ----------------------------------------------------------------------
// Kanban Board
// ----------------------------------------------------------------------

export interface KanbanColumn {
  id: string; // Unique column ID
  title: string;
  type: KanbanColumnType;
  sectionId?: string;
  tasks: Task[];
  collapsed?: boolean;
}

export type KanbanColumnType =
  | 'inbox'
  | 'today'
  | 'upcoming'
  | 'section'
  | 'custom';

// ----------------------------------------------------------------------
// API Response Types
// ----------------------------------------------------------------------

export interface ApiEnvelope<T> {
  data: T | null;
  message: string;
  meta?: Record<string, unknown> | null;
  errors?: Record<string, string[]> | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ----------------------------------------------------------------------
// List View Types
// ----------------------------------------------------------------------

export interface ListViewGroup {
  id: string;
  title: string;
  type: ListViewGroupType;
  tasks: Task[];
  collapsed?: boolean;
}

export type ListViewGroupType =
  | 'section'
  | 'priority'
  | 'due_date'
  | 'label'
  | 'assignee';

// ----------------------------------------------------------------------
// Search Types
// ----------------------------------------------------------------------

export interface SearchResult {
  type: 'task' | 'project' | 'label';
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
  highlight?: {
    title?: string;
    description?: string;
  };
}

export interface SearchFilters {
  query: string;
  projectIds?: string[];
  labelIds?: string[];
  priorities?: TaskPriority[];
  includeCompleted?: boolean;
}

// ----------------------------------------------------------------------
// Context/State Types
// ----------------------------------------------------------------------

export interface TaskDetailState {
  taskId: string | null;
  open: boolean;
}

export interface KanbanViewState {
  projectId: string;
  columns: KanbanColumn[];
  collapsedSections: Set<string>;
  draggedTaskId: string | null;
}

// ----------------------------------------------------------------------
// Shared Types
// ----------------------------------------------------------------------

export type SortOrder = 'asc' | 'desc';

// ----------------------------------------------------------------------
// Re-exports
// ----------------------------------------------------------------------

export * from './task.types';
export * from './label.types';
export * from './project.types';
