// Mock API - Simulates API calls using local mock data
// Used when VITE_MOCK_API=true

import type {
  Label,
  Project,
  Section,
  Task,
  Team,
  TeamMember,
  LabelFormData,
  ProjectFormData,
  TaskFormData,
  TeamFormData,
} from 'src/module/timebox/types';

import {
  MOCK_LABELS,
  MOCK_PROJECTS,
  MOCK_SECTIONS,
  MOCK_TEAMS,
  getMockTaskById,
  getMockTasks,
  getMockProjectById,
  getMockTeamById,
} from './mock-data';

type Comment = NonNullable<Task['comments']>[number];
type Subtask = NonNullable<Task['subtasks']>[number];

// ----------------------------------------------------------------------
// Simulated network delay
// ----------------------------------------------------------------------

const API_DELAY = 300;

function simulateDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), API_DELAY);
  });
}

// ----------------------------------------------------------------------
// Tasks Mock API
// ----------------------------------------------------------------------

/** Get all tasks for a project */
export async function mockGetTasks(projectId: string): Promise<Task[]> {
  return simulateDelay(getMockTasks(projectId));
}

/** Get single task by ID */
export async function mockGetTaskById(projectId: string, taskId: string): Promise<Task> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);
  return simulateDelay(task);
}

/** Create new task */
export async function mockCreateTask(
  projectId: string,
  data: Omit<TaskFormData, 'projectId'>
): Promise<Task> {
  const newTask: Task = {
    id: `task-${Date.now()}`,
    projectId,
    title: data.title,
    description: data.description ?? null,
    priority: data.priority,
    sectionId: data.sectionId ?? null,
    dueDate: data.dueDate ?? null,
    dueDatetime: data.dueDatetime ?? null,
    reminderAt: data.reminderAt ?? null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    position: 0,
    labels: [],
    assigneeIds: data.assigneeIds ?? [],
    comments: [],
  };

  return simulateDelay(newTask);
}

/** Update existing task */
export async function mockUpdateTask(
  projectId: string,
  taskId: string,
  data: Partial<Omit<TaskFormData, 'projectId'>>
): Promise<Task> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);

  const updatedTask: Task = {
    ...task,
    title: data.title ?? task.title,
    description: data.description !== undefined ? (data.description ?? null) : task.description,
    priority: data.priority ?? task.priority,
    sectionId: data.sectionId !== undefined ? (data.sectionId ?? null) : task.sectionId,
    dueDate: data.dueDate !== undefined ? (data.dueDate ?? null) : task.dueDate,
    dueDatetime: data.dueDatetime !== undefined ? (data.dueDatetime ?? null) : task.dueDatetime,
    reminderAt: data.reminderAt !== undefined ? (data.reminderAt ?? null) : task.reminderAt,
    assigneeIds: data.assigneeIds ?? task.assigneeIds,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedTask);
}

/** Delete task */
export async function mockDeleteTask(projectId: string, taskId: string): Promise<void> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);
  return simulateDelay(undefined);
}

/** Mark task as complete */
export async function mockCompleteTask(projectId: string, taskId: string): Promise<Task> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);

  const updatedTask: Task = {
    ...task,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedTask);
}

/** Mark task as incomplete */
export async function mockUncompleteTask(projectId: string, taskId: string): Promise<Task> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);

  const updatedTask: Task = {
    ...task,
    completedAt: null,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedTask);
}

/** Move task to different project/section */
export async function mockMoveTask(
  projectId: string,
  taskId: string,
  targetProjectId: string,
  targetSectionId?: string
): Promise<Task> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);

  const updatedTask: Task = {
    ...task,
    projectId: targetProjectId,
    sectionId: targetSectionId ?? null,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedTask);
}

/** Duplicate task */
export async function mockDuplicateTask(projectId: string, taskId: string): Promise<Task> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);

  const duplicatedTask: Task = {
    ...task,
    id: `task-${Date.now()}`,
    title: `${task.title} (copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  };

  return simulateDelay(duplicatedTask);
}

// ----------------------------------------------------------------------
// Comments Mock API
// ----------------------------------------------------------------------

/** Get comments for a task */
export async function mockGetComments(projectId: string, taskId: string): Promise<Comment[]> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);
  return simulateDelay((task.comments ?? []) as Comment[]);
}

/** Create comment */
export async function mockCreateComment(
  projectId: string,
  taskId: string,
  content: string
): Promise<Comment> {
  const newComment = {
    id: `comment-${Date.now()}`,
    taskId,
    content,
    authorId: 'current-user',
    authorName: 'Current User',
    authorAvatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(newComment);
}

/** Update comment */
export async function mockUpdateComment(
  projectId: string,
  taskId: string,
  commentId: string,
  content: string
): Promise<Comment> {
  return simulateDelay({
    id: commentId,
    taskId,
    content,
    authorId: 'current-user',
    authorName: 'Current User',
    authorAvatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/** Delete comment */
export async function mockDeleteComment(projectId: string, taskId: string, commentId: string): Promise<void> {
  return simulateDelay(undefined);
}

// ----------------------------------------------------------------------
// Subtasks Mock API
// ----------------------------------------------------------------------

/** Get subtasks for a task */
export async function mockGetSubtasks(projectId: string, taskId: string): Promise<Subtask[]> {
  const task = getMockTaskById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);
  return simulateDelay((task.subtasks ?? []) as Subtask[]);
}

/** Create subtask */
export async function mockCreateSubtask(
  projectId: string,
  taskId: string,
  title: string
): Promise<Subtask> {
  const newSubtask = {
    id: `subtask-${Date.now()}`,
    taskId,
    title,
    completed: false,
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(newSubtask);
}

/** Update subtask */
export async function mockUpdateSubtask(
  projectId: string,
  taskId: string,
  subtaskId: string,
  data: { title?: string; completed?: boolean }
): Promise<Subtask> {
  return simulateDelay({
    id: subtaskId,
    taskId,
    title: data.title ?? 'Untitled',
    completed: data.completed ?? false,
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/** Delete subtask */
export async function mockDeleteSubtask(projectId: string, taskId: string, subtaskId: string): Promise<void> {
  return simulateDelay(undefined);
}

/** Toggle subtask completion */
export async function mockToggleSubtask(
  projectId: string,
  taskId: string,
  subtaskId: string
): Promise<Subtask> {
  return simulateDelay({
    id: subtaskId,
    taskId,
    title: 'Untitled',
    completed: true,
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// ----------------------------------------------------------------------
// Projects Mock API
// ----------------------------------------------------------------------

/** Get all projects */
export async function mockGetProjects(): Promise<Project[]> {
  return simulateDelay(MOCK_PROJECTS);
}

/** Get project by ID */
export async function mockGetProjectById(id: string): Promise<Project> {
  const project = getMockProjectById(id);
  if (!project) throw new Error(`Project ${id} not found`);
  return simulateDelay(project);
}

/** Create new project */
export async function mockCreateProject(data: ProjectFormData): Promise<Project> {
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    name: data.name,
    description: null,
    color: data.color,
    icon: data.icon ?? null,
    isFavorite: false,
    isArchived: false,
    isInbox: false,
    viewMode: 'board',
    position: 0,
    teamId: data.teamId ?? null,
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(newProject);
}

/** Update project */
export async function mockUpdateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
  const project = getMockProjectById(id);
  if (!project) throw new Error(`Project ${id} not found`);

  const updatedProject: Project = {
    ...project,
    name: data.name ?? project.name,
    color: data.color ?? project.color,
    icon: data.icon !== undefined ? (data.icon ?? null) : project.icon,
    teamId: data.teamId !== undefined ? (data.teamId ?? null) : project.teamId,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedProject);
}

/** Delete project */
export async function mockDeleteProject(id: string): Promise<void> {
  const project = getMockProjectById(id);
  if (!project) throw new Error(`Project ${id} not found`);
  return simulateDelay(undefined);
}

/** Toggle project favorite */
export async function mockToggleProjectFavorite(id: string): Promise<Project> {
  const project = getMockProjectById(id);
  if (!project) throw new Error(`Project ${id} not found`);

  const updatedProject: Project = {
    ...project,
    isFavorite: !project.isFavorite,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedProject);
}

/** Toggle project archive */
export async function mockToggleProjectArchive(id: string): Promise<Project> {
  const project = getMockProjectById(id);
  if (!project) throw new Error(`Project ${id} not found`);

  const updatedProject: Project = {
    ...project,
    isArchived: !project.isArchived,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedProject);
}

/** Move project to team */
export async function mockMoveProject(id: string, teamId: string): Promise<Project> {
  const project = getMockProjectById(id);
  if (!project) throw new Error(`Project ${id} not found`);

  const updatedProject: Project = {
    ...project,
    teamId,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedProject);
}

// ----------------------------------------------------------------------
// Sections Mock API
// ----------------------------------------------------------------------

/** Get sections for a project */
export async function mockGetSections(projectId: string): Promise<Section[]> {
  return simulateDelay(MOCK_SECTIONS.filter((s) => s.projectId === projectId));
}

/** Create section */
export async function mockCreateSection(projectId: string, name: string): Promise<Section> {
  const newSection: Section = {
    id: `sec-${Date.now()}`,
    projectId,
    name,
    collapsed: false,
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(newSection);
}

/** Update section */
export async function mockUpdateSection(projectId: string, sectionId: string, name: string): Promise<Section> {
  return simulateDelay({
    id: sectionId,
    projectId,
    name,
    collapsed: false,
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/** Delete section */
export async function mockDeleteSection(projectId: string, sectionId: string): Promise<void> {
  return simulateDelay(undefined);
}

// ----------------------------------------------------------------------
// Labels Mock API
// ----------------------------------------------------------------------

/** Get all labels */
export async function mockGetLabels(): Promise<Label[]> {
  return simulateDelay(MOCK_LABELS);
}

/** Get label by ID */
export async function mockGetLabelById(id: string): Promise<Label> {
  const label = MOCK_LABELS.find((l) => l.id === id);
  if (!label) throw new Error(`Label ${id} not found`);
  return simulateDelay(label);
}

/** Create label */
export async function mockCreateLabel(data: LabelFormData): Promise<Label> {
  const newLabel: Label = {
    id: `label-${Date.now()}`,
    name: data.name,
    color: data.color,
    position: MOCK_LABELS.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(newLabel);
}

/** Update label */
export async function mockUpdateLabel(id: string, data: Partial<LabelFormData>): Promise<Label> {
  const label = MOCK_LABELS.find((l) => l.id === id);
  if (!label) throw new Error(`Label ${id} not found`);

  const updatedLabel: Label = {
    ...label,
    name: data.name ?? label.name,
    color: data.color ?? label.color,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedLabel);
}

/** Delete label */
export async function mockDeleteLabel(id: string): Promise<void> {
  return simulateDelay(undefined);
}

/** Reorder labels */
export async function mockReorderLabels(labelIds: string[]): Promise<void> {
  return simulateDelay(undefined);
}

// ----------------------------------------------------------------------
// Teams Mock API
// ----------------------------------------------------------------------

/** Get all teams */
export async function mockGetTeams(): Promise<Team[]> {
  return simulateDelay(MOCK_TEAMS);
}

/** Get team by ID */
export async function mockGetTeamById(id: string): Promise<Team> {
  const team = getMockTeamById(id);
  if (!team) throw new Error(`Team ${id} not found`);
  return simulateDelay(team);
}

/** Create team */
export async function mockCreateTeam(data: TeamFormData): Promise<Team> {
  const newTeam: Team = {
    id: `team-${Date.now()}`,
    name: data.name,
    description: data.description ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    position: 0,
  };

  return simulateDelay(newTeam);
}

/** Update team */
export async function mockUpdateTeam(id: string, data: Partial<TeamFormData>): Promise<Team> {
  const team = getMockTeamById(id);
  if (!team) throw new Error(`Team ${id} not found`);

  const updatedTeam: Team = {
    ...team,
    name: data.name ?? team.name,
    description: data.description !== undefined ? (data.description ?? null) : team.description,
    updatedAt: new Date().toISOString(),
  };

  return simulateDelay(updatedTeam);
}

/** Delete team */
export async function mockDeleteTeam(id: string): Promise<void> {
  const team = getMockTeamById(id);
  if (!team) throw new Error(`Team ${id} not found`);
  return simulateDelay(undefined);
}

/** Get team members */
export async function mockGetTeamMembers(teamId: string): Promise<TeamMember[]> {
  const team = getMockTeamById(teamId);
  if (!team) throw new Error(`Team ${teamId} not found`);
  return simulateDelay(team.members ?? []);
}

/** Add team member */
export async function mockAddTeamMember(teamId: string, userId: string, role: TeamMember['role']): Promise<TeamMember> {
  const newMember: TeamMember = {
    userId,
    userName: 'New Member',
    userEmail: `${userId}@example.com`,
    role,
    joinedAt: new Date().toISOString(),
  };

  return simulateDelay(newMember);
}

/** Update team member role */
export async function mockUpdateTeamMemberRole(
  teamId: string,
  userId: string,
  role: TeamMember['role']
): Promise<TeamMember> {
  return simulateDelay({
    userId,
    userName: 'Updated Member',
    userEmail: `${userId}@example.com`,
    role,
    joinedAt: new Date().toISOString(),
  });
}

/** Remove team member */
export async function mockRemoveTeamMember(teamId: string, userId: string): Promise<void> {
  return simulateDelay(undefined);
}

/** Leave team */
export async function mockLeaveTeam(teamId: string): Promise<void> {
  return simulateDelay(undefined);
}