import { useAuth } from "@clerk/clerk-react";
import backend from "~backend/client";

export function useBackend() {
  const { getToken, isSignedIn } = useAuth();
  if (!isSignedIn) return backend;
  return backend.with({
    auth: async () => {
      const token = await getToken();
      console.log("####token", token);
      return { authorization: `Bearer asldjflsjdfljsljdflkjsdfsadf` };
    },
  });
}
