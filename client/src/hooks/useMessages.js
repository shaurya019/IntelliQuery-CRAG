import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../services/mockApi.js";

export function useMessages(sessionId) {
  return useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => mockApi.getMessages(sessionId),
    enabled: Boolean(sessionId)
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.sendMessage,
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    }
  });
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: mockApi.submitFeedback
  });
}
