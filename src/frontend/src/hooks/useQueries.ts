import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Budget, PublicProfile, HouseholdInvite } from '../backend';

// Personal Budget Queries
export function useGetPersonalBudget() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Budget | null>({
    queryKey: ['personalBudget'],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getPersonalBudget();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSavePersonalBudget() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budget: Budget) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.savePersonalBudget(budget);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalBudget'] });
    },
  });
}

// Household Queries - Backend methods not yet exposed in interface
// Commenting out until backend interface is updated
/*
export function useGetMyHouseholdId() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['myHouseholdId'],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getMyHouseholdId();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetHouseholdBudget() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Budget | null>({
    queryKey: ['householdBudget'],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getHouseholdBudget();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetHouseholdMembers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[any, string, Budget | null]> | null>({
    queryKey: ['householdMembers'],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getHouseholdMembers();
    },
    enabled: !!actor && !actorFetching,
  });
}
*/

export function useGetPendingInvites() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[string, HouseholdInvite]>>({
    queryKey: ['pendingInvites'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getPendingInvites();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useInviteToHousehold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteeUsername: string) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.inviteToHousehold(inviteeUsername);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
    },
  });
}

export function useAcceptHouseholdInvite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.acceptHouseholdInvite(inviteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
    },
  });
}

export function useDeclineHouseholdInvite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.declineHouseholdInvite(inviteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
    },
  });
}

// Public Profiles
export function useGetAllPublicProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicProfile[]>({
    queryKey: ['publicProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllPublicProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllUsernames() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['allUsernames'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.allUsernames();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Staff Queries
export function useGetAllUsersAsStaff() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['allUsersAsStaff'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllUsersAsStaff();
    },
    enabled: !!actor && !actorFetching,
  });
}
