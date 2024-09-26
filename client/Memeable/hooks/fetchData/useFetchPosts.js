import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../store/userActions";
import { debounce } from "lodash";
import { apiQueue } from "../../utils/helper";

export default useFetchPosts = () => {
  const { allPosts } = useSelector((state) => state.post);
  const { userDetails } = useSelector((state) => state.user);

  const allPostsRef = useRef(allPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const dispatch = useDispatch();

  // this helps to get the lastest value of allPosts
  useEffect(() => {
    allPostsRef.current = allPosts;
  }, [allPosts]);

  const fetchPosts = useCallback(
    async (page, reset = false) => {
      // if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await dispatch(
          fetchAllPosts({
            page,
            limit: 5,
            reset,
          })
        ).unwrap();

        // refresh mode should not update hasMore
        if (reset) {
          setCurrentPage(1);
        } else {
          setCurrentPage(page);
        }

        setHasMore(response.hasMore);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, isLoading, hasMore]
  );

  const loadMorePosts = debounce(async () => {
    if (isLoading || !hasMore || allPosts.length === 0) return;
    console.log("fetching more...");
    await fetchPosts(currentPage + 1);
  }, 300);

  const refreshPosts = async () => {
    console.log("refreshing...");
    await fetchPosts(1, true);
  };

  // when home page first mount, fetch posts for page 1
  useEffect(() => {
    if (allPosts.length === 0) {
      apiQueue.add(() => fetchPosts(1));
    }

    // when user upload post, refresh immediately
  }, [userDetails.postsCount]);

  return { isLoading, fetchPosts, loadMorePosts, refreshPosts };
};
