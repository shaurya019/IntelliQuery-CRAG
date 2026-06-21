import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "../services/backendApi.js";

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: backendApi.getDocuments
  });
}

export function useDocument(documentId) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["documents", documentId],
    queryFn: () => backendApi.getDocument(documentId),
    enabled: Boolean(documentId),
    placeholderData: () =>
      queryClient
        .getQueryData(["documents"])
        ?.find((document) => document.id === documentId)
  });
}

export function useUploadDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files) => backendApi.registerS3AndIngest(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });
}
