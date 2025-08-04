import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { usePlayerStore } from "../stores/usePlayerStore";

export const useAuthRefresh = () => {
  const token = usePlayerStore((state) => state.token);
  const refreshAccessToken = usePlayerStore(
    (state) => state.refreshAccessToken
  );

  useEffect(() => {
    if (!token) return;

    let timeoutId;

    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000; // timestamp in ms
      const now = Date.now();
      const refreshTime = exp - now - 3600000; // 1h before expiration

      if (refreshTime <= 0) {
        refreshAccessToken();
        return;
      }

      timeoutId = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime);
    } catch (err) {
      console.error("Error decoding token:", err);
      refreshAccessToken();
    }

    return () => clearTimeout(timeoutId);
  }, [token, refreshAccessToken]);
};
