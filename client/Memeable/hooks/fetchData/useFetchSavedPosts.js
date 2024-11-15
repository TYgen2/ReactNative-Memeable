import { useCallback, useEffect, useState } from "react";
import { apiQueue } from "../../utils/helper";
import { fetchSavedPosts } from "../../handleAPIs/fetchData";

const useFetchSavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchPosts = useCallback(
    async (page, reset = false) => {
      if (isPostsLoading) return;
      setIsPostsLoading(true);
      try {
        const response = await apiQueue.add(() => fetchSavedPosts(page, 9));

        if (reset) {
          setSavedPosts(response.postData);
        } else {
          // append next page's posts to the bottom
          setSavedPosts([...savedPosts, ...response.postData]);
        }

        setCurrentPage(page);
        setHasMore(response.hasMore);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPostsLoading(false);
      }
    },
    [isPostsLoading, hasMore]
  );

  const loadMorePosts = useCallback(async () => {
    if (isPostsLoading || !hasMore || savedPosts.length === 0) return;
    console.log("fetching more...");
    await fetchPosts(currentPage + 1);
  }, [isPostsLoading, hasMore, savedPosts.length, currentPage]);

  const refreshPosts = async () => {
    console.log("refreshing...");
    await fetchPosts(1, true);
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  return {
    fetchPosts,
    savedPosts,
    isPostsLoading,
    loadMorePosts,
    refreshPosts,
  };
};

export default useFetchSavedPosts;
