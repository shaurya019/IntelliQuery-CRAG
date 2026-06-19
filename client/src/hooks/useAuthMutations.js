import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { clearCredentials, setCredentials } from "../features/auth/authSlice.js";
import { mockApi } from "../services/mockApi.js";

export function useLoginMutation() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: mockApi.login,
    onSuccess: (user) => {
      dispatch(setCredentials(user));
    }
  });
}

export function useLogout() {
  const dispatch = useDispatch();

  return () => {
    dispatch(clearCredentials());
  };
}
