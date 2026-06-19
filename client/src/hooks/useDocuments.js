import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../services/mockApi.js";

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: mockApi.getDocuments
  });
}

export function useUploadDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files) => mockApi.uploadDocuments(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApi.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });
}
