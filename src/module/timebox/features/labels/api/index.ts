// Labels API - Create, Read, Update, Delete operations

import type {
  Label,
  LabelFormData,
} from 'src/module/timebox/types';

import { CONFIG } from 'src/shared/config';
import axios, { endpoints } from 'src/shared/lib/axios';
import * as mockApi from 'src/module/timebox/utils/mock-api';
import { unwrap } from 'src/module/timebox/utils/api.helpers';

// ----------------------------------------------------------------------
// Labels API
// ----------------------------------------------------------------------

/**
 * Get all labels
 */
export async function getLabels(): Promise<Label[]> {
  if (CONFIG.isMockApi) return mockApi.mockGetLabels();
  return unwrap<Label[]>(axios.get(endpoints.timebox.labels.list));
}

/**
 * Get label by ID
 */
export async function getLabelById(id: string): Promise<Label> {
  if (CONFIG.isMockApi) return mockApi.mockGetLabelById(id);
  return unwrap<Label>(axios.get(endpoints.timebox.labels.byId(id)));
}

/**
 * Create new label
 */
export async function createLabel(data: LabelFormData): Promise<Label> {
  if (CONFIG.isMockApi) return mockApi.mockCreateLabel(data);
  return unwrap<Label>(axios.post(endpoints.timebox.labels.list, data));
}

/**
 * Update label
 */
export async function updateLabel(id: string, data: Partial<LabelFormData>): Promise<Label> {
  if (CONFIG.isMockApi) return mockApi.mockUpdateLabel(id, data);
  return unwrap<Label>(axios.patch(endpoints.timebox.labels.byId(id), data));
}

/**
 * Delete label
 */
export async function deleteLabel(id: string): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockDeleteLabel(id);
  return axios.delete(endpoints.timebox.labels.byId(id));
}

/**
 * Reorder labels
 */
export async function reorderLabels(labelIds: string[]): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockReorderLabels(labelIds);
  return axios.post(`${endpoints.timebox.labels.list}/reorder`, { label_ids: labelIds });
}