import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNotifications } from "../../handleAPIs/fetchData";

const LIMIT = 20;

const useFetchNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [states, setStates] = useState({
    isLoading: false,
    isLoadingMore: false,
    isRefreshing: false,
  });

  const notificationsRef = useRef(notifications);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const cancelPreviousRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
  };

  const fetchNotificationsData = useCallback(async (page, options = {}) => {
    const { reset = false, retry = 0 } = options;
    cancelPreviousRequest();

    try {
      const response = await fetchNotifications({
        page,
        limit: LIMIT,
        signal: abortControllerRef.current.signal,
      });

      const newNotifications = response.notificationData;
      console.log(newNotifications[0]);
      setNotifications((prev) =>
        reset ? newNotifications : [...prev, ...newNotifications]
      );
      setHasMore(response.hasMore);
      setCurrentPage(page);
      setError(null);
      return response;
    } catch (err) {
      if (err.name === "AbortError") return;

      setError(err.message);
      if (retry < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retry + 1)));
        return fetchNotificationsData(page, { ...options, retry: retry + 1 });
      }
      throw err;
    }
  }, []);

  const loadInitialNotifications = useCallback(async () => {
    setStates((prev) => ({ ...prev, isLoading: true }));
    try {
      await fetchNotificationsData(1, { reset: true });
    } finally {
      setStates((prev) => ({ ...prev, isLoading: false }));
    }
  }, [fetchNotificationsData]);

  const loadMoreNotifications = useCallback(async () => {
    if (states.isLoadingMore || !hasMore) return;

    setStates((prev) => ({ ...prev, isLoadingMore: true }));
    try {
      await fetchNotificationsData(currentPage + 1);
    } finally {
      setStates((prev) => ({ ...prev, isLoadingMore: false }));
    }
  }, [currentPage, hasMore, states.isLoadingMore, fetchNotificationsData]);

  const refreshNotifications = useCallback(async () => {
    setStates((prev) => ({ ...prev, isRefreshing: true }));
    try {
      await fetchNotificationsData(1, { reset: true });
    } finally {
      setStates((prev) => ({ ...prev, isRefreshing: false }));
    }
  }, [fetchNotificationsData]);

  useEffect(() => {
    loadInitialNotifications();
    return () => cancelPreviousRequest();
  }, []);

  return {
    notifications,
    error,
    hasMore,
    ...states,
    loadMoreNotifications,
    refreshNotifications,
  };
};

export default useFetchNotifications;
