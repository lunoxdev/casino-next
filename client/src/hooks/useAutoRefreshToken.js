import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { usePlayerStore } from "../stores/usePlayerStore";

const REFRESH_OFFSET_MS = 60 * 60 * 1000; // 1 hour before expiration

const getRefreshTime = (token) => {
  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000; // convert to ms
    const now = Date.now();
    const refreshTime = exp - now - REFRESH_OFFSET_MS;
    console.log("🔄 Refresh time:", refreshTime);

    return refreshTime > 0 ? refreshTime : 0;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};

export const useAutoRefreshToken = () => {
  const token = usePlayerStore((state) => state.token);
  const refreshAccessToken = usePlayerStore(
    (state) => state.refreshAccessToken
  );

  useEffect(() => {
    if (!token) return;

    const refreshTime = getRefreshTime(token);
    let timeoutId;

    if (refreshTime === null || refreshTime === 0) {
      refreshAccessToken();
    } else {
      timeoutId = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime);
    }

    return () => clearTimeout(timeoutId);
  }, [token, refreshAccessToken]);
};
