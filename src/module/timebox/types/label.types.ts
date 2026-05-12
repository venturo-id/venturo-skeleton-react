// Label-specific types and utilities

import type { Label, SortOrder } from './index';

// ----------------------------------------------------------------------
// Default Label Colors
// ----------------------------------------------------------------------

export const DEFAULT_LABEL_COLORS = [
  '#FF5630', // Red (error)
  '#FFAB00', // Orange (warning)
  '#FFD666', // Yellow
  '#22C55E', // Green (success)
  '#00B8D9', // Cyan (info)
  '#8E33FF', // Purple (secondary)
  '#FA383E', // Pink
  '#607D8B', // Blue Grey
] as const;

// ----------------------------------------------------------------------
// Label Utilities
// ----------------------------------------------------------------------

/**
 * Get label color for display
 */
export function getLabelColor(label: Label): string {
  return label.color || DEFAULT_LABEL_COLORS[0];
}

/**
 * Check if label color is light (for text color calculation)
 */
export function isLabelColorLight(color: string): boolean {
  const hex = color.replace('#', '');
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Get contrast text color for label background
 */
export function getLabelTextColor(label: Label): string {
  return isLabelColorLight(label.color) ? '#000000' : '#FFFFFF';
}

// ----------------------------------------------------------------------
// Label Sorting
// ----------------------------------------------------------------------

export type LabelSortBy = 'position' | 'name' | 'createdAt';

export function sortLabels(
  labels: Label[],
  sortBy: LabelSortBy = 'position',
  order: SortOrder = 'asc'
): Label[] {
  const sorted = [...labels].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'position':
        comparison = a.position - b.position;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
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
// Label Filtering
// ----------------------------------------------------------------------

export interface LabelFilterOptions {
  query?: string;
}

export function filterLabels(labels: Label[], options: LabelFilterOptions): Label[] {
  return labels.filter((label) => {
    // Query filter
    if (options.query) {
      const query = options.query.toLowerCase();
      if (!label.name.toLowerCase().includes(query)) return false;
    }

    return true;
  });
}

// ----------------------------------------------------------------------
// Label Grouping
// ----------------------------------------------------------------------

export interface LabelGroup {
  id: string;
  title: string;
  labels: Label[];
}

export function groupLabelsByColor(labels: Label[]): LabelGroup[] {
  const groupsMap = new Map<string, Label[]>();

  labels.forEach((label) => {
    const color = label.color;
    const existing = groupsMap.get(color);

    if (existing) {
      existing.push(label);
    } else {
      groupsMap.set(color, [label]);
    }
  });

  return Array.from(groupsMap.entries()).map(([color, colorLabels]) => ({
    id: color,
    title: color,
    labels: colorLabels,
  }));
}

// ----------------------------------------------------------------------
// Task Label Utilities
// ----------------------------------------------------------------------

/**
 * Check if task has a specific label
 */
export function taskHasLabel(task: { labels: Label[] }, labelId: string): boolean {
  return task.labels.some((label) => label.id === labelId);
}

/**
 * Get task labels sorted by position
 */
export function getTaskLabelsSorted(task: { labels: Label[] }): Label[] {
  return sortLabels(task.labels, 'position', 'asc');
}

/**
 * Get task label names as comma-separated string
 */
export function getTaskLabelNames(task: { labels: Label[] }, maxLabels = 3): string {
  const labels = getTaskLabelsSorted(task);
  const names = labels.slice(0, maxLabels).map((l) => l.name);

  if (labels.length > maxLabels) {
    names.push(`+${labels.length - maxLabels}`);
  }

  return names.join(', ');
}
