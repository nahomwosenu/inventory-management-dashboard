import { useAuth } from "@/context/auth";
import backend from "~backend/client";

export function useBackend() {
  const { user: currentUser, getUserToken } = useAuth();
  if (!currentUser) {
    console.log("#### No current user, returning backend without auth");
    return backend;
  }
  return backend.with({
    auth: async () => {
      const token = getUserToken();
      console.log("####token", token);
      if (!token) return undefined;
      // backend auth expects an Authorization header with Basic <base64>
      return { authorization: `Basic ${token}` };
    },
  });
}
