import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { translateBackendError } from '../utils/backendErrors';
import { toast } from 'sonner';

export function useFlagMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      messageId, 
      reason, 
      location 
    }: { 
      messageId: string; 
      reason: string; 
      location: 'global' | 'private' | 'household' | 'staffGroup';
    }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.flagMessage(messageId, reason, { [`#${location}`]: null });
    },
    onSuccess: () => {
      toast.success('Message flagged for staff review');
      queryClient.invalidateQueries({ queryKey: ['flaggedMessages'] });
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}

export function useGetFlaggedMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['flaggedMessages'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return await actor.getFlaggedMessages();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      messageId, 
      location 
    }: { 
      messageId: string; 
      location: 'global' | 'private' | 'household' | 'staffGroup';
    }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.deleteMessage(messageId, { [`#${location}`]: null });
    },
    onSuccess: (_, variables) => {
      toast.success('Message deleted');
      // Invalidate all message queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['globalMessages'] });
      queryClient.invalidateQueries({ queryKey: ['privateMessages'] });
      queryClient.invalidateQueries({ queryKey: ['staffGroupMessages'] });
      queryClient.invalidateQueries({ queryKey: ['householdMessages'] });
      queryClient.invalidateQueries({ queryKey: ['flaggedMessages'] });
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}

export function useResolveFlaggedMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (flagId: string) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.resolveFlaggedMessage(flagId);
    },
    onSuccess: () => {
      toast.success('Flag resolved');
      queryClient.invalidateQueries({ queryKey: ['flaggedMessages'] });
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}
