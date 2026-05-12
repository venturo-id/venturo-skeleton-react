// Teams API - Create, Read, Update, Delete operations

import type {
  Team,
  TeamRole,
  TeamMember,
  TeamFormData,
} from 'src/module/timebox/types';

import { CONFIG } from 'src/shared/config';
import axios, { endpoints } from 'src/shared/lib/axios';
import * as mockApi from 'src/module/timebox/utils/mock-api';
import { unwrap } from 'src/module/timebox/utils/api.helpers';

// ----------------------------------------------------------------------
// Teams API
// ----------------------------------------------------------------------

/**
 * Get all teams
 */
export async function getTeams(): Promise<Team[]> {
  if (CONFIG.isMockApi) return mockApi.mockGetTeams();
  return unwrap<Team[]>(axios.get(endpoints.timebox.teams.list));
}

/**
 * Get team by ID
 */
export async function getTeamById(id: string): Promise<Team> {
  if (CONFIG.isMockApi) return mockApi.mockGetTeamById(id);
  return unwrap<Team>(axios.get(endpoints.timebox.teams.byId(id)));
}

/**
 * Create new team
 */
export async function createTeam(data: TeamFormData): Promise<Team> {
  if (CONFIG.isMockApi) return mockApi.mockCreateTeam(data);
  return unwrap<Team>(axios.post(endpoints.timebox.teams.list, data));
}

/**
 * Update team
 */
export async function updateTeam(id: string, data: Partial<TeamFormData>): Promise<Team> {
  if (CONFIG.isMockApi) return mockApi.mockUpdateTeam(id, data);
  return unwrap<Team>(axios.patch(endpoints.timebox.teams.byId(id), data));
}

/**
 * Delete team
 */
export async function deleteTeam(id: string): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockDeleteTeam(id);
  return axios.delete(endpoints.timebox.teams.byId(id));
}

// ----------------------------------------------------------------------
// Team Members API
// ----------------------------------------------------------------------

/**
 * Get team members
 */
export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  if (CONFIG.isMockApi) return mockApi.mockGetTeamMembers(teamId);
  return unwrap<TeamMember[]>(axios.get(`${endpoints.timebox.teams.byId(teamId)}/members`));
}

/**
 * Add member to team
 */
export async function addTeamMember(
  teamId: string,
  userId: string,
  role: TeamRole
): Promise<TeamMember> {
  if (CONFIG.isMockApi) return mockApi.mockAddTeamMember(teamId, userId, role);
  return unwrap<TeamMember>(
    axios.post(`${endpoints.timebox.teams.byId(teamId)}/members`, { user_id: userId, role })
  );
}

/**
 * Update team member role
 */
export async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  role: TeamRole
): Promise<TeamMember> {
  if (CONFIG.isMockApi) return mockApi.mockUpdateTeamMemberRole(teamId, userId, role);
  return unwrap<TeamMember>(
    axios.patch(`${endpoints.timebox.teams.byId(teamId)}/members/${userId}`, { role })
  );
}

/**
 * Remove member from team
 */
export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockRemoveTeamMember(teamId, userId);
  return axios.delete(`${endpoints.timebox.teams.byId(teamId)}/members/${userId}`);
}

/**
 * Leave team (for current user)
 */
export async function leaveTeam(teamId: string): Promise<void> {
  if (CONFIG.isMockApi) return mockApi.mockLeaveTeam(teamId);
  return axios.post(`${endpoints.timebox.teams.byId(teamId)}/leave`);
}