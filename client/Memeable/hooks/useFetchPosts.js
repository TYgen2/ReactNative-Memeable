import { useState } from "react";
import { getTokens } from "../utils/tokenActions";
import { handleFetchPosts } from "../api/userActions";

export default useFetchPosts = (targetId, mode) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  if (!targetId) return;

  const fetchPosts = async (page) => {
    setIsLoading(true);
    const tokens = await getTokens();

    try {
      const { postData } = await handleFetchPosts(
        page,
        9,
        targetId,
        mode,
        tokens.jwtToken,
        tokens.refreshToken
      );
      if (page === 1) {
        setPosts(postData);
      } else {
        setPosts((prev) => [...prev, ...postData]);
      }
      setCurrentPage(page);
      setHasMore(postData.length > 0);
    } catch (error) {
      console.error(
        error.response?.data?.msg ||
          "Error when fetching posts from custom hook!!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (isLoading || !hasMore || posts.length === 0) return;
    await fetchPosts(currentPage + 1);
  };

  return { posts, isLoading, fetchPosts, loadMorePosts };
};
