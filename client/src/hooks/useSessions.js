import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setActiveSessionId } from "../features/chat/chatSlice.js";
import { mockApi } from "../services/mockApi.js";

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: mockApi.getSessions
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: mockApi.createSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.setQueryData(["messages", session.id], []);
      dispatch(setActiveSessionId(session.id));
    }
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: mockApi.deleteSession,
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.removeQueries({ queryKey: ["messages", sessionId] });
      dispatch(setActiveSessionId(null));
    }
  });
}
