import { useCurrentUserQuery } from "../../hooks/useAuthMutations.js";

export default function AuthBootstrap() {
  useCurrentUserQuery();
  return null;
}
