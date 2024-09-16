import { useCallback, useEffect, useRef, useState } from "react";
import { getTokens } from "../utils/tokenActions";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/userActions";

export default useFetchAllPosts = (mode) => {
  const { allPosts } = useSelector((state) => state.post);
  const allPostsRef = useRef(allPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const dispatch = useDispatch();

  // this helps to get the lastest value of allPosts
  useEffect(() => {
    allPostsRef.current = allPosts;
  }, [allPosts]);

  const fetchAllPosts = useCallback(
    async (page, reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      const tokens = await getTokens();
      try {
        const response = await dispatch(
          fetchPosts({
            page,
            limit: 3,
            mode,
            since: reset ? allPosts[0]?.createDate : undefined,
            reset,
            jwtToken: tokens.jwtToken,
            refreshToken: tokens.refreshToken,
          })
        ).unwrap();

        if (reset) {
          setCurrentPage(1);
        } else {
          setCurrentPage(page);
          setHasMore(response.hasMore);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, mode, isLoading, hasMore]
  );

  const loadMorePosts = async () => {
    if (isLoading || !hasMore || allPosts.length === 0) return;
    await fetchAllPosts(currentPage + 1);
  };

  const refreshPosts = async () => {
    await fetchAllPosts(1, true);
  };

  return { isLoading, fetchAllPosts, loadMorePosts, refreshPosts };
};
