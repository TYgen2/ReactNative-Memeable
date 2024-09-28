import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPosts } from "../../handleAPIs/fetchData";
import { apiQueue } from "../../utils/helper";

export default useFetchPostsForUser = (targetId) => {
  const { userDetails } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const userPostsRef = useRef(userPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const dispatch = useDispatch();

  const fetchPosts = useCallback(
    async (page, reset = false) => {
      if (isPostsLoading) return;
      setIsPostsLoading(true);
      try {
        const response = await apiQueue.add(() =>
          fetchUserPosts(page, 9, targetId)
        );

        if (reset) {
          setUserPosts(response.postData);
        } else {
          // append next page's posts to the bottom
          setUserPosts([...userPosts, ...response.postData]);
        }

        setCurrentPage(page);
        setHasMore(response.hasMore);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPostsLoading(false);
      }
    },
    [dispatch, isPostsLoading, hasMore]
  );

  const loadMorePosts = useCallback(async () => {
    if (isPostsLoading || !hasMore || userPosts.length === 0) return;
    console.log("fetching more...");
    await fetchPosts(currentPage + 1);
  }, [isPostsLoading, hasMore, userPosts.length, currentPage]);

  // this helps to get the lastest value of allPosts
  useEffect(() => {
    userPostsRef.current = userPosts;
  }, [userPosts]);

  useEffect(() => {
    // first mount, or when user upload a new posts
    console.log("UserProfile rendered");
    fetchPosts(1, true);
  }, [userDetails.postsCount]);

  return { userPosts, isPostsLoading, loadMorePosts };
};
