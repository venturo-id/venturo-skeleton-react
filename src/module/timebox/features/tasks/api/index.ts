// Tasks API - Create, Read, Update, Delete operations

import type {
  Task,
  TaskFormData,
} from 'src/module/timebox/types';

import { CONFIG } from 'src/shared/config';
import axios, { endpoints } from 'src/shared/lib/axios';
import * as mockApi from 'src/module/timebox/utils/mock-api';
import { unwrap, priorityToApi } from 'src/module/timebox/utils/api.helpers';

// ----------------------------------------------------------------------
// Tasks API
// ----------------------------------------------------------------------

/**
 * Get tasks for a project
 */
export async function getTasks(projectId: string): Promise<Task[]> {
  if (CONFIG.isMockApi) return mockApi.mockGetTasks(projectId);
  return unwrap<Task[]>(axios.get(endpoints.timebox.projects.tasks(projectId)));
}

/**
 * Get task by ID
 */
export async function getTaskById(projectId: string, taskId: string): Promise<Task> {
  if (CONFIG.isMockApi) return mockApi.mockGetTaskById(projectId, taskId);
  return unwrap<Task>(axios.get(endpoints.timebox.projects.taskById(projectId, taskId)));
}

/**
 * Create new task
 */
export async function createTask(
  projectId: string,
  data: Omit<TaskFormData, 'projectId'>
): Promise<Task> {
  if (CONFIG.isMockApi) return mockApi.mockCreateTask(projectId, data);
  // Convert priority from string to number
  const payload = {
    ...data,
    priority: data.priority ? priorityToApi(data.priority) : undefined,
  };

  return unwrap<Task>(axios.post(endpoints.timebox.projects.tasks(projectId), payload));
}

/**
 * Update task
 */
export async function updateTask(
  projectId: string,
  taskId: string,
  data: Partial<Omit<TaskFormData, 'projectId'>>
): Promise<Task> {
  if (CONFIG.isMockApi) return mockApi.mockUpdateTask(projectId, taskId, data);
  // Convert priority from string to number if provided
  const payload = {
    ...data,
    priority: data.priority !== undefined ? priorityToApi(data.priority) : undefined,
  };

  return unwrap<Task>(
    axios.patch(endpoints.timebox.projects.taskById(projectId, taskId), payload)
  );
}

/**
 * Delete task
 */
export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockDeleteTask(projectId, taskId);
  return axios.delete(endpoints.timebox.projects.taskById(projectId, taskId));
}

/**
 * Mark task as complete
 */
export async function completeTask(projectId: string, taskId: string): Promise<Task> {
  if (CONFIG.isMockApi) return mockApi.mockCompleteTask(projectId, taskId);
  return unwrap<Task>(axios.post(endpoints.timebox.tasks.complete(projectId, taskId)));
}

/**
 * Mark task as incomplete
 */
export async function uncompleteTask(projectId: string, taskId: string): Promise<Task> {
  if (CONFIG.isMockApi) return mockApi.mockUncompleteTask(projectId, taskId);
  return unwrap<Task>(axios.post(endpoints.timebox.tasks.uncomplete(projectId, taskId)));
}

/**
 * Move task to different project/section
 */
export async function moveTask(
  projectId: string,
  taskId: string,
  targetProjectId: string,
  targetSectionId?: string
): Promise<Task> {
  if (CONFIG.isMockApi) return mockApi.mockMoveTask(projectId, taskId, targetProjectId, targetSectionId);
  return unwrap<Task>(
    axios.post(endpoints.timebox.projects.taskById(projectId, taskId), {
      action: 'move',
      target_project_id: targetProjectId,
      target_section_id: targetSectionId,
    })
  );
}

/**
 * Duplicate task
 */
export async function duplicateTask(projectId: string, taskId: string): Promise<Task> {
  if (CONFIG.isMockApi) return mockApi.mockDuplicateTask(projectId, taskId);
  return unwrap<Task>(
    axios.post(`${endpoints.timebox.projects.taskById(projectId, taskId)}/duplicate`)
  );
}

// ----------------------------------------------------------------------
// Comments API
// ----------------------------------------------------------------------

type Comment = NonNullable<Task['comments']>[number];
type Subtask = NonNullable<Task['subtasks']>[number];

/**
 * Get comments for a task
 */
export async function getComments(projectId: string, taskId: string): Promise<Comment[]> {
  if (CONFIG.isMockApi) return mockApi.mockGetComments(projectId, taskId);
  return unwrap<Comment[]>(axios.get(endpoints.timebox.tasks.comments(projectId, taskId)));
}

/**
 * Create comment
 */
export async function createComment(
  projectId: string,
  taskId: string,
  content: string
): Promise<Comment> {
  if (CONFIG.isMockApi) return mockApi.mockCreateComment(projectId, taskId, content);
  return unwrap<Comment>(
    axios.post(endpoints.timebox.tasks.comments(projectId, taskId), { content })
  );
}

/**
 * Update comment
 */
export async function updateComment(
  projectId: string,
  taskId: string,
  commentId: string,
  content: string
): Promise<Comment> {
  if (CONFIG.isMockApi) return mockApi.mockUpdateComment(projectId, taskId, commentId, content);
  return unwrap<Comment>(
    axios.patch(endpoints.timebox.tasks.commentById(projectId, taskId, commentId), {
      content,
    })
  );
}

/**
 * Delete comment
 */
export async function deleteComment(
  projectId: string,
  taskId: string,
  commentId: string
): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockDeleteComment(projectId, taskId, commentId);
  return axios.delete(endpoints.timebox.tasks.commentById(projectId, taskId, commentId));
}

// ----------------------------------------------------------------------
// Subtasks API
// ----------------------------------------------------------------------

/**
 * Get subtasks for a task
 */
export async function getSubtasks(projectId: string, taskId: string): Promise<Subtask[]> {
  if (CONFIG.isMockApi) return mockApi.mockGetSubtasks(projectId, taskId);
  return unwrap<Subtask[]>(axios.get(endpoints.timebox.tasks.subtasks(projectId, taskId)));
}

/**
 * Create subtask
 */
export async function createSubtask(
  projectId: string,
  taskId: string,
  title: string
): Promise<Subtask> {
  if (CONFIG.isMockApi) return mockApi.mockCreateSubtask(projectId, taskId, title);
  return unwrap<Subtask>(
    axios.post(endpoints.timebox.tasks.subtasks(projectId, taskId), { title })
  );
}

/**
 * Update subtask
 */
export async function updateSubtask(
  projectId: string,
  taskId: string,
  subtaskId: string,
  data: { title?: string; completed?: boolean }
): Promise<Subtask> {
  if (CONFIG.isMockApi) return mockApi.mockUpdateSubtask(projectId, taskId, subtaskId, data);
  return unwrap<Subtask>(
    axios.patch(endpoints.timebox.tasks.subtaskById(projectId, taskId, subtaskId), data)
  );
}

/**
 * Delete subtask
 */
export async function deleteSubtask(
  projectId: string,
  taskId: string,
  subtaskId: string
): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockDeleteSubtask(projectId, taskId, subtaskId);
  return axios.delete(endpoints.timebox.tasks.subtaskById(projectId, taskId, subtaskId));
}

/**
 * Toggle subtask completion
 */
export async function toggleSubtask(
  projectId: string,
  taskId: string,
  subtaskId: string
): Promise<Subtask> {
  if (CONFIG.isMockApi) return mockApi.mockToggleSubtask(projectId, taskId, subtaskId);
  const subtask = await unwrap<Subtask>(
    axios.get(endpoints.timebox.tasks.subtaskById(projectId, taskId, subtaskId))
  );

  return updateSubtask(projectId, taskId, subtaskId, {
    completed: !subtask.completed,
  });
}