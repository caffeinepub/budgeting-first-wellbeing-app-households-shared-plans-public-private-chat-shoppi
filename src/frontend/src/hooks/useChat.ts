import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { translateBackendError } from '../utils/backendErrors';
import { toast } from 'sonner';

// Note: These hooks are ready for backend implementation
// They will work once the backend methods are deployed

export function useGetGlobalMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['globalMessages'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return await actor.getGlobalMessages(100, 0);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1000, // 1-second polling
    retry: false,
  });
}

export function useSendGlobalMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, image }: { content: string; image?: any }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.sendGlobalMessage(content, image || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalMessages'] });
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}

export function useGetPrivateConversations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['privateConversations'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return await actor.getPrivateConversations();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1000, // 1-second polling
    retry: false,
  });
}

export function useGetPrivateMessages(otherUserPrincipal: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['privateMessages', otherUserPrincipal],
    queryFn: async () => {
      if (!actor || !otherUserPrincipal) return [];
      // @ts-ignore - Backend method not yet implemented
      return await actor.getPrivateMessages(otherUserPrincipal, 100, 0);
    },
    enabled: !!actor && !actorFetching && !!otherUserPrincipal,
    refetchInterval: otherUserPrincipal ? 1000 : false, // 1-second polling when conversation is open
    retry: false,
  });
}

export function useSendPrivateMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipient, content, image }: { recipient: string; content: string; image?: any }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.sendPrivateMessage(recipient, content, image || null);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['privateMessages', variables.recipient] });
      queryClient.invalidateQueries({ queryKey: ['privateConversations'] });
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}

export function useGetConversationStatus(otherUserPrincipal: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['conversationStatus', otherUserPrincipal],
    queryFn: async () => {
      if (!actor || !otherUserPrincipal) return { paused: false, pausedBy: null };
      // @ts-ignore - Backend method not yet implemented
      return await actor.getConversationStatus(otherUserPrincipal);
    },
    enabled: !!actor && !actorFetching && !!otherUserPrincipal,
    retry: false,
  });
}

export function usePauseConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUser: string) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.pauseConversation(otherUser);
    },
    onSuccess: (_, otherUser) => {
      queryClient.invalidateQueries({ queryKey: ['conversationStatus', otherUser] });
      toast.success('Conversation paused');
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}

export function useUnpauseConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUser: string) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.unpauseConversation(otherUser);
    },
    onSuccess: (_, otherUser) => {
      queryClient.invalidateQueries({ queryKey: ['conversationStatus', otherUser] });
      toast.success('Conversation resumed');
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}

export function useGetStaffGroupMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['staffGroupMessages'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return await actor.getStaffGroupMessages(100, 0);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1000, // 1-second polling
    retry: false,
  });
}

export function useSendStaffGroupMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, image }: { content: string; image?: any }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.sendStaffGroupMessage(content, image || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffGroupMessages'] });
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}

export function useGetHouseholdMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['householdMessages'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return await actor.getHouseholdMessages(100, 0);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 1000, // 1-second polling
    retry: false,
  });
}

export function useSendHouseholdMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, image }: { content: string; image?: any }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return await actor.sendHouseholdMessage(content, image || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['householdMessages'] });
    },
    onError: (error) => {
      toast.error(translateBackendError(error));
    },
  });
}
