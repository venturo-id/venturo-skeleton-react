// Teams data hooks with caching

import type { Team, TeamRole, TeamFormData } from 'src/module/timebox/types';

import { useState, useEffect, useCallback } from 'react';

import { toast } from 'src/shared/ui/snackbar';
import { TIMEBOX_STORAGE_KEYS } from 'src/module/timebox/utils/constants';
import {
  getCached,
  setCached,
  CACHE_DURATION,
  invalidateTeamsCache,
} from 'src/module/timebox/utils/cache.helpers';

import * as teamsApi from '../api';

// ----------------------------------------------------------------------
// Hook: useTeams
// ----------------------------------------------------------------------

/**
 * Fetch all teams with caching
 */
export function useTeams(options?: { skipCache?: boolean }) {
  const [data, setData] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { skipCache = false } = options || {};

  const fetchTeams = useCallback(async (forceRefetch = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      if (!skipCache && !forceRefetch) {
        const cached = getCached<Team[]>(TIMEBOX_STORAGE_KEYS.TEAMS_CACHE, {
          duration: CACHE_DURATION.MEDIUM,
        });
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }
      }

      // Fetch from API
      const teams = await teamsApi.getTeams();

      // Update cache
      setCached(TIMEBOX_STORAGE_KEYS.TEAMS_CACHE, teams);

      setData(teams);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch teams'));
      toast.error(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      setIsLoading(false);
    }
  }, [skipCache]);

  // Initial fetch
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Mutations
  const createTeam = useCallback(
    async (formData: TeamFormData) => {
      try {
        const newTeam = await teamsApi.createTeam(formData);

        // Update local state
        setData((prev) => [...prev, newTeam]);

        // Invalidate cache
        invalidateTeamsCache();

        toast.success('Team created successfully');
        return newTeam;
      } catch (err) {
        const teamError = err instanceof Error ? err : new Error('Failed to create team');
        toast.error(teamError.message);
        throw teamError;
      }
    },
    []
  );

  const updateTeam = useCallback(
    async (id: string, formData: Partial<TeamFormData>) => {
      try {
        const updatedTeam = await teamsApi.updateTeam(id, formData);

        // Update local state
        setData((prev) => prev.map((t) => (t.id === id ? updatedTeam : t)));

        // Invalidate cache
        invalidateTeamsCache();

        toast.success('Team updated successfully');
        return updatedTeam;
      } catch (err) {
        const teamError = err instanceof Error ? err : new Error('Failed to update team');
        toast.error(teamError.message);
        throw teamError;
      }
    },
    []
  );

  const deleteTeam = useCallback(
    async (id: string) => {
      try {
        await teamsApi.deleteTeam(id);

        // Update local state
        setData((prev) => prev.filter((t) => t.id !== id));

        // Invalidate cache
        invalidateTeamsCache();

        toast.success('Team deleted successfully');
      } catch (err) {
        const teamError = err instanceof Error ? err : new Error('Failed to delete team');
        toast.error(teamError.message);
        throw teamError;
      }
    },
    []
  );

  const refetch = useCallback(() => {
    fetchTeams(true);
  }, [fetchTeams]);

  return {
    data,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    refetch,
  };
}

// ----------------------------------------------------------------------
// Hook: useTeam
// ----------------------------------------------------------------------

/**
 * Fetch single team by ID with members
 */
export function useTeam(id: string) {
  const [data, setData] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Define TeamMember type locally
  type TeamMember = {
    userId: string;
    userName: string;
    userEmail: string;
    role: TeamRole;
    joinedAt: string;
  };

  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function fetchTeam() {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const [teamData, membersData] = await Promise.all([
          teamsApi.getTeamById(id),
          teamsApi.getTeamMembers(id),
        ]);

        setData(teamData);
        setMembers(membersData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch team'));
        toast.error(err instanceof Error ? err.message : 'Failed to fetch team');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeam();
  }, [id]);

  return {
    data,
    members,
    isLoading,
    error,
  };
}

// ----------------------------------------------------------------------
// Hook: useTeamMembers
// ----------------------------------------------------------------------

/**
 * Get team members for a team
 */
export function useTeamMembers(teamId: string) {
  const [data, setData] = useState<Team['members']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      if (!teamId) return;

      try {
        setIsLoading(true);
        setError(null);

        const members = await teamsApi.getTeamMembers(teamId);
        setData(members);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch team members'));
        toast.error(err instanceof Error ? err.message : 'Failed to fetch team members');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [teamId]);

  const addMember = useCallback(
    async (userId: string, role: TeamRole) => {
      try {
        const newMember = await teamsApi.addTeamMember(teamId, userId, role);

        // Update local state
        setData((prev) => [...(prev || []), newMember]);

        toast.success('Member added successfully');
        return newMember;
      } catch (err) {
        const memberError = err instanceof Error ? err : new Error('Failed to add member');
        toast.error(memberError.message);
        throw memberError;
      }
    },
    [teamId]
  );

  const updateMemberRole = useCallback(
    async (userId: string, role: TeamRole) => {
      try {
        const updatedMember = await teamsApi.updateTeamMemberRole(teamId, userId, role);

        // Update local state
        setData((prev) => (prev || []).map((m) => (m.userId === userId ? updatedMember : m)));

        toast.success('Member role updated successfully');
        return updatedMember;
      } catch (err) {
        const memberError = err instanceof Error ? err : new Error('Failed to update member role');
        toast.error(memberError.message);
        throw memberError;
      }
    },
    [teamId]
  );

  const removeMember = useCallback(
    async (userId: string) => {
      try {
        await teamsApi.removeTeamMember(teamId, userId);

        // Update local state
        setData((prev) => (prev || []).filter((m) => m.userId !== userId));

        toast.success('Member removed successfully');
      } catch (err) {
        const memberError = err instanceof Error ? err : new Error('Failed to remove member');
        toast.error(memberError.message);
        throw memberError;
      }
    },
    [teamId]
  );

  return {
    data,
    isLoading,
    error,
    addMember,
    updateMemberRole,
    removeMember,
  };
}
