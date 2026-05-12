// Constants for Timebox module

// ----------------------------------------------------------------------
// Storage Keys (localStorage)
// ----------------------------------------------------------------------

const STORAGE_PREFIX = 'timebox';

export const TIMEBOX_STORAGE_KEYS = {
  // Projects
  FAVORITE_PROJECTS: `${STORAGE_PREFIX}.favorite_projects`,
  ARCHIVED_PROJECTS: `${STORAGE_PREFIX}.archived_projects`,
  PROJECTS_CACHE: `${STORAGE_PREFIX}.projects_cache`,

  // Tasks
  TASKS_CACHE: `${STORAGE_PREFIX}.tasks_cache`,

  // Labels
  LABELS: `${STORAGE_PREFIX}.labels`,
  LABELS_CACHE: `${STORAGE_PREFIX}.labels_cache`,
  FILTERS: `${STORAGE_PREFIX}.filters`,

  // Teams
  TEAMS_CACHE: `${STORAGE_PREFIX}.teams_cache`,

  // View state
  KANBAN_VIEW_STATE: `${STORAGE_PREFIX}.kanban_view_state`,
  LIST_VIEW_STATE: `${STORAGE_PREFIX}.list_view_state`,
  COLLAPSED_SECTIONS: `${STORAGE_PREFIX}.collapsed_sections`,

  // Preferences
  DEFAULT_PROJECT_ID: `${STORAGE_PREFIX}.default_project_id`,
  TASK_SORT_BY: `${STORAGE_PREFIX}.task_sort_by`,
  TASK_SORT_ORDER: `${STORAGE_PREFIX}.task_sort_order`,
  PROJECT_VIEW_MODE: `${STORAGE_PREFIX}.project_view_mode`,

  // Sidebar
  SIDEBAR_COLLAPSED: `${STORAGE_PREFIX}.sidebar_collapsed`,
  SIDEBAR_WIDTH: `${STORAGE_PREFIX}.sidebar_width`,
} as const;

// ----------------------------------------------------------------------
// Task Priorities
// ----------------------------------------------------------------------

export const TASK_PRIORITIES = ['urgent', 'high', 'medium', 'low', 'none'] as const;

export const TASK_PRIORITY_COLORS = {
  urgent: '#FA383E', // error.main
  high: '#FA383E', // error.main
  medium: '#FFAB00', // warning.main
  low: '#00B8D9', // info.main
  none: '#919EAB', // text.disabled
} as const;

// ----------------------------------------------------------------------
// Default Values
// ----------------------------------------------------------------------

export const DEFAULT_PROJECT_COLOR = '#3B82F6';
export const DEFAULT_LABEL_COLORS = [
  '#FF5630', // Red
  '#FFAB00', // Orange
  '#FFD666', // Yellow
  '#22C55E', // Green
  '#00B8D9', // Cyan
  '#8E33FF', // Purple
  '#FA383E', // Pink
  '#607D8B', // Blue Grey
] as const;

export const DEFAULT_PROJECT_ICONS = [
  '📁',
  '📂',
  '🗂️',
  '📋',
  '📌',
  '📎',
  '🏠',
  '🏢',
  '💼',
  '🎯',
] as const;

// ----------------------------------------------------------------------
// View Modes
// ----------------------------------------------------------------------

export const PROJECT_VIEW_MODES = ['board', 'list'] as const;
export const TASK_GROUP_BY = ['section', 'priority', 'dueDate', 'label', 'assignee'] as const;
export const TASK_SORT_BY = ['position', 'dueDate', 'priority', 'title', 'createdAt'] as const;

// ----------------------------------------------------------------------
// Date Formats
// ----------------------------------------------------------------------

export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMM YYYY HH:mm',
  INPUT: 'YYYY-MM-DD',
  INPUT_WITH_TIME: 'YYYY-MM-DDTHH:mm',
  MONTH_YEAR: 'MMM YYYY',
  SHORT: 'DD MMM',
  RELATIVE: 'relative',
} as const;

// ----------------------------------------------------------------------
// Pagination
// ----------------------------------------------------------------------

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// ----------------------------------------------------------------------
// Transition Durations (for animations)
// ----------------------------------------------------------------------

export const TRANSITION_DURATION = {
  FASTEST: 100,
  FASTER: 150,
  FAST: 200,
  NORMAL: 300,
  SLOW: 400,
} as const;

// ----------------------------------------------------------------------
// Breakpoints (for responsive behavior)
// ----------------------------------------------------------------------

export const BREAKPOINTS = {
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
} as const;

// ----------------------------------------------------------------------
// Keyboard Shortcuts
// ----------------------------------------------------------------------

export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'Cmd+K',
  QUICK_ADD: 'Cmd+N',
  SUBMIT: 'Cmd+Enter',
  CLOSE: 'Escape',
  NAVIGATE_UP: 'ArrowUp',
  NAVIGATE_DOWN: 'ArrowDown',
  COMPLETE_TASK: 'C',
  SET_DUE_DATE: 'D',
  DELETE_TASK: 'Delete',
} as const;

// ----------------------------------------------------------------------
// API Endpoints
// ----------------------------------------------------------------------

export const API_ENDPOINTS = {
  PROJECTS: '/core/v1/projects',
  PROJECT_DETAIL: (id: string) => `/core/v1/projects/${id}`,
  PROJECT_SECTIONS: (projectId: string) => `/core/v1/projects/${projectId}/sections`,
  PROJECT_SECTION_DETAIL: (projectId: string, sectionId: string) =>
    `/core/v1/projects/${projectId}/sections/${sectionId}`,
  PROJECT_TASKS: (projectId: string) => `/core/v1/projects/${projectId}/tasks`,
  TASK_DETAIL: (projectId: string, taskId: string) =>
    `/core/v1/projects/${projectId}/tasks/${taskId}`,
  TASK_COMMENTS: (projectId: string, taskId: string) =>
    `/core/v1/projects/${projectId}/tasks/${taskId}/comments`,
  TASK_COMMENT_DETAIL: (projectId: string, taskId: string, commentId: string) =>
    `/core/v1/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
  TASK_SUBTASKS: (projectId: string, taskId: string) =>
    `/core/v1/projects/${projectId}/tasks/${taskId}/subtasks`,
  TASK_SUBTASK_DETAIL: (projectId: string, taskId: string, subtaskId: string) =>
    `/core/v1/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`,
  LABELS: '/core/v1/labels',
  LABEL_DETAIL: (id: string) => `/core/v1/labels/${id}`,
  TEAMS: '/core/v1/teams',
  TEAM_DETAIL: (id: string) => `/core/v1/teams/${id}`,
  TASKS_COMPLETE: (projectId: string, taskId: string) =>
    `/core/v1/projects/${projectId}/tasks/${taskId}/complete`,
  TASKS_UNCOMPLETE: (projectId: string, taskId: string) =>
    `/core/v1/projects/${projectId}/tasks/${taskId}/uncomplete`,
} as const;

// ----------------------------------------------------------------------
// Error Messages
// ----------------------------------------------------------------------

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'network_error',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  VALIDATION_ERROR: 'validation_error',
  SERVER_ERROR: 'server_error',
  UNKNOWN_ERROR: 'unknown_error',
} as const;

// ----------------------------------------------------------------------
// Validation Rules
// ----------------------------------------------------------------------

export const VALIDATION_RULES = {
  PROJECT_NAME_MIN: 1,
  PROJECT_NAME_MAX: 100,
  TASK_TITLE_MIN: 1,
  TASK_TITLE_MAX: 500,
  LABEL_NAME_MIN: 1,
  LABEL_NAME_MAX: 50,
  TEAM_NAME_MIN: 1,
  TEAM_NAME_MAX: 100,
  SECTION_NAME_MIN: 1,
  SECTION_NAME_MAX: 100,
} as const;

// ----------------------------------------------------------------------
// Feature Flags
// ----------------------------------------------------------------------

export const FEATURES = {
  ENABLE_TASK_COMMENTS: true,
  ENABLE_TASK_ATTACHMENTS: true,
  ENABLE_TASK_SUBTASKS: true,
  ENABLE_TEAMS: true,
  ENABLE_LABELS: true,
  ENABLE_FILTERS: true,
  ENABLE_SEARCH: true,
  ENABLE_KEYBOARD_SHORTCUTS: true,
  ENABLE_TIP_TAP_EDITOR: true,
  ENABLE_DRAG_AND_DROP: true,
} as const;
