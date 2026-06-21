import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCredentials,
  selectAccessToken,
  setCredentials
} from "../features/auth/authSlice.js";
import { backendApi } from "../services/backendApi.js";

export function useLoginMutation() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: backendApi.login,
    onSuccess: (session) => {
      dispatch(setCredentials(session));
    }
  });
}

export function useRegisterMutation() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: backendApi.register,
    onSuccess: (session) => {
      dispatch(setCredentials(session));
    }
  });
}

export function useLogout() {
  const dispatch = useDispatch();

  return () => {
    backendApi.logout();
    dispatch(clearCredentials());
  };
}

export function useCurrentUserQuery() {
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: backendApi.getCurrentUser,
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 60_000
  });

  useEffect(() => {
    if (query.data) {
      dispatch(
        setCredentials({
          user: query.data,
          accessToken
        })
      );
    }
  }, [accessToken, dispatch, query.data]);

  useEffect(() => {
    if (query.error?.status === 401 || query.error?.status === 403) {
      backendApi.logout();
      dispatch(clearCredentials());
    }
  }, [dispatch, query.error]);

  return query;
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: backendApi.healthCheck,
    retry: false,
    staleTime: 30_000
  });
}
