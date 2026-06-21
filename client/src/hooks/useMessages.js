import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "../services/backendApi.js";
import { saveFeedback } from "../services/frontendState.js";

export function useMessages(sessionId) {
  return useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => backendApi.getSessionMessages(sessionId),
    enabled: Boolean(sessionId)
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: backendApi.sendMessage,
    onSuccess: (result, variables) => {
      queryClient.setQueryData(["messages", variables.sessionId], (current = []) => [
        ...current,
        result.userMessage,
        result.assistantMessage
      ]);
      queryClient.invalidateQueries({ queryKey: ["messages", variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    }
  });
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: saveFeedback
  });
}
