import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setActiveSessionId } from "../features/chat/chatSlice.js";
import { backendApi } from "../services/backendApi.js";

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: backendApi.getSessions
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: backendApi.createSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.setQueryData(["messages", session.id], []);
      dispatch(setActiveSessionId(session.id));
    }
  });
}
