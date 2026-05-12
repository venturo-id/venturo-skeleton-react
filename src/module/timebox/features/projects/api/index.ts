// Projects API - Create, Read, Update, Delete operations

import type {
  Project,
  Section,
  ProjectFormData,
} from 'src/module/timebox/types';

import { CONFIG } from 'src/shared/config';
import axios, { endpoints } from 'src/shared/lib/axios';
import * as mockApi from 'src/module/timebox/utils/mock-api';
import { unwrap } from 'src/module/timebox/utils/api.helpers';

// ----------------------------------------------------------------------
// Projects API
// ----------------------------------------------------------------------

/**
 * Get all projects
 */
export async function getProjects(): Promise<Project[]> {
  if (CONFIG.isMockApi) return mockApi.mockGetProjects();
  return unwrap<Project[]>(axios.get(endpoints.timebox.projects.list));
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project> {
  if (CONFIG.isMockApi) return mockApi.mockGetProjectById(id);
  return unwrap<Project>(axios.get(endpoints.timebox.projects.byId(id)));
}

/**
 * Create new project
 */
export async function createProject(data: ProjectFormData): Promise<Project> {
  if (CONFIG.isMockApi) return mockApi.mockCreateProject(data);
  return unwrap<Project>(axios.post(endpoints.timebox.projects.list, data));
}

/**
 * Update project
 */
export async function updateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
  if (CONFIG.isMockApi) return mockApi.mockUpdateProject(id, data);
  return unwrap<Project>(axios.patch(endpoints.timebox.projects.byId(id), data));
}

/**
 * Delete project
 */
export async function deleteProject(id: string): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockDeleteProject(id);
  return axios.delete(endpoints.timebox.projects.byId(id));
}

/**
 * Toggle project favorite
 */
export async function toggleProjectFavorite(id: string): Promise<Project> {
  if (CONFIG.isMockApi) return mockApi.mockToggleProjectFavorite(id);
  return unwrap<Project>(axios.post(`${endpoints.timebox.projects.byId(id)}/favorite`));
}

/**
 * Toggle project archive
 */
export async function toggleProjectArchive(id: string): Promise<Project> {
  if (CONFIG.isMockApi) return mockApi.mockToggleProjectArchive(id);
  return unwrap<Project>(axios.post(`${endpoints.timebox.projects.byId(id)}/archive`));
}

/**
 * Move project to team
 */
export async function moveProject(id: string, teamId: string): Promise<Project> {
  if (CONFIG.isMockApi) return mockApi.mockMoveProject(id, teamId);
  return unwrap<Project>(
    axios.post(`${endpoints.timebox.projects.byId(id)}/move`, { teamId })
  );
}

// ----------------------------------------------------------------------
// Sections API
// ----------------------------------------------------------------------

/**
 * Get sections for a project
 */
export async function getSections(projectId: string): Promise<Section[]> {
  if (CONFIG.isMockApi) return mockApi.mockGetSections(projectId);
  return unwrap<Section[]>(axios.get(endpoints.timebox.projects.sections(projectId)));
}

/**
 * Create section
 */
export async function createSection(
  projectId: string,
  name: string
): Promise<Section> {
  if (CONFIG.isMockApi) return mockApi.mockCreateSection(projectId, name);
  return unwrap<Section>(
    axios.post(endpoints.timebox.projects.sections(projectId), { name })
  );
}

/**
 * Update section
 */
export async function updateSection(
  projectId: string,
  sectionId: string,
  name: string
): Promise<Section> {
  if (CONFIG.isMockApi) return mockApi.mockUpdateSection(projectId, sectionId, name);
  return unwrap<Section>(
    axios.patch(endpoints.timebox.sections.byId(projectId, sectionId), { name })
  );
}

/**
 * Delete section
 */
export async function deleteSection(projectId: string, sectionId: string): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockDeleteSection(projectId, sectionId);
  return axios.delete(endpoints.timebox.sections.byId(projectId, sectionId));
}