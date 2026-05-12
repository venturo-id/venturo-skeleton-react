// Task-specific types and utilities

import type { Task, SortOrder, TaskPriority } from './index';

// ----------------------------------------------------------------------
// Task Priority Utilities
// ----------------------------------------------------------------------

/**
 * Convert API priority number to frontend priority string
 * API: 1=urgent, 2=high, 3=medium, 4=low, 5=none
 */
export function priorityFromApi(apiPriority: number): TaskPriority {
  const mapping: Record<number, TaskPriority> = {
    1: 'urgent',
    2: 'high',
    3: 'medium',
    4: 'low',
    5: 'none',
  };
  return mapping[apiPriority] ?? 'none';
}

/**
 * Convert frontend priority string to API priority number
 */
export function priorityToApi(priority: TaskPriority): number {
  const mapping: Record<TaskPriority, number> = {
    urgent: 1,
    high: 2,
    medium: 3,
    low: 4,
    none: 5,
  };
  return mapping[priority];
}

/**
 * Get priority color from theme
 */
export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    urgent: 'error.main',
    high: 'error.main',
    medium: 'warning.main',
    low: 'info.main',
    none: 'text.disabled',
  };
  return colors[priority];
}

/**
 * Get priority label
 */
export function getPriorityLabel(priority: TaskPriority): string {
  const labels: Record<TaskPriority, string> = {
    urgent: 'Urgent',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    none: 'None',
  };
  return labels[priority];
}

// ----------------------------------------------------------------------
// Task Status Utilities
// ----------------------------------------------------------------------

export function isTaskCompleted(task: Task): boolean {
  return task.completedAt !== null && task.completedAt !== undefined;
}

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || isTaskCompleted(task)) return false;
  return new Date(task.dueDate) < new Date();
}

export function isTaskDueToday(task: Task): boolean {
  if (!task.dueDate) return false;
  const today = new Date();
  const due = new Date(task.dueDate);
  return (
    today.getDate() === due.getDate() &&
    today.getMonth() === due.getMonth() &&
    today.getFullYear() === due.getFullYear()
  );
}

export function isTaskDueTomorrow(task: Task): boolean {
  if (!task.dueDate) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const due = new Date(task.dueDate);
  return (
    tomorrow.getDate() === due.getDate() &&
    tomorrow.getMonth() === due.getMonth() &&
    tomorrow.getFullYear() === due.getFullYear()
  );
}

// ----------------------------------------------------------------------
// Task Grouping
// ----------------------------------------------------------------------

export interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
}

export function groupTasksBySection(tasks: Task[]): TaskGroup[] {
  const groups = new Map<string, TaskGroup>();

  tasks.forEach((task) => {
    const sectionId = task.sectionId || 'no_section';
    const existing = groups.get(sectionId);

    if (existing) {
      existing.tasks.push(task);
    } else {
      groups.set(sectionId, {
        id: sectionId,
        title: sectionId === 'no_section' ? 'No Section' : sectionId,
        tasks: [task],
      });
    }
  });

  return Array.from(groups.values());
}

export function groupTasksByPriority(tasks: Task[]): TaskGroup[] {
  const priorities: TaskPriority[] = ['urgent', 'high', 'medium', 'low', 'none'];
  const groups: TaskGroup[] = [];

  priorities.forEach((priority) => {
    const filteredTasks = tasks.filter((task) => task.priority === priority);
    if (filteredTasks.length > 0) {
      groups.push({
        id: priority,
        title: getPriorityLabel(priority),
        tasks: filteredTasks,
      });
    }
  });

  return groups;
}

export function groupTasksByDueDate(tasks: Task[]): TaskGroup[] {
  const groupsMap = new Map<string, Task[]>();

  tasks.forEach((task) => {
    let groupKey = 'no_date';

    if (task.dueDate) {
      if (isTaskOverdue(task) && !isTaskCompleted(task)) {
        groupKey = 'overdue';
      } else if (isTaskDueToday(task)) {
        groupKey = 'today';
      } else if (isTaskDueTomorrow(task)) {
        groupKey = 'tomorrow';
      } else {
        const dueDate = new Date(task.dueDate);
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        if (dueDate <= nextWeek) {
          groupKey = 'this_week';
        } else {
          groupKey = 'later';
        }
      }
    }

    const existing = groupsMap.get(groupKey);
    if (existing) {
      existing.push(task);
    } else {
      groupsMap.set(groupKey, [task]);
    }
  });

  const titles: Record<string, string> = {
    overdue: 'Overdue',
    today: 'Today',
    tomorrow: 'Tomorrow',
    this_week: 'This Week',
    later: 'Later',
    no_date: 'No Date',
  };

  return Array.from(groupsMap.entries()).map(([key, groupedTasks]) => ({
    id: key,
    title: titles[key] || key,
    tasks: groupedTasks,
  }));
}

// ----------------------------------------------------------------------
// Task Sorting
// ----------------------------------------------------------------------

export type TaskSortBy = 'position' | 'dueDate' | 'priority' | 'title' | 'createdAt';

export function sortTasks(
  tasks: Task[],
  sortBy: TaskSortBy = 'position',
  order: SortOrder = 'asc'
): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'position':
        comparison = a.position - b.position;
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority': {
        const priorityOrder: TaskPriority[] = ['urgent', 'high', 'medium', 'low', 'none'];
        comparison = priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        break;
      }
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default: {
        // Handle unknown sortBy values
        break;
      }
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// ----------------------------------------------------------------------
// Task Filters
// ----------------------------------------------------------------------

export interface TaskFilterOptions {
  query?: string;
  labelIds?: string[];
  priorities?: TaskPriority[];
  projectIds?: string[];
  sectionIds?: string[];
  assigneeIds?: string[];
  dueBefore?: string;
  dueAfter?: string;
  includeCompleted?: boolean;
}

export function filterTasks(tasks: Task[], options: TaskFilterOptions): Task[] {
  return tasks.filter((task) => {
    // Query filter
    if (options.query) {
      const query = options.query.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Label filter
    if (options.labelIds && options.labelIds.length > 0) {
      const hasLabel = task.labels.some((label) => options.labelIds!.includes(label.id));
      if (!hasLabel) return false;
    }

    // Priority filter
    if (options.priorities && options.priorities.length > 0) {
      if (!options.priorities.includes(task.priority)) return false;
    }

    // Project filter
    if (options.projectIds && options.projectIds.length > 0) {
      if (!options.projectIds.includes(task.projectId)) return false;
    }

    // Section filter
    if (options.sectionIds && options.sectionIds.length > 0) {
      if (!task.sectionId || !options.sectionIds.includes(task.sectionId)) return false;
    }

    // Assignee filter
    if (options.assigneeIds && options.assigneeIds.length > 0) {
      const hasAssignee = task.assigneeIds?.some((id) => options.assigneeIds!.includes(id));
      if (!hasAssignee) return false;
    }

    // Due date filter
    if (options.dueBefore && task.dueDate) {
      if (new Date(task.dueDate) > new Date(options.dueBefore)) return false;
    }
    if (options.dueAfter && task.dueDate) {
      if (new Date(task.dueDate) < new Date(options.dueAfter)) return false;
    }

    // Completed filter
    if (options.includeCompleted === false) {
      if (isTaskCompleted(task)) return false;
    }

    return true;
  });
}
