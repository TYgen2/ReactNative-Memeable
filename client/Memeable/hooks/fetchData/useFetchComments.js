import { useCallback, useEffect, useRef, useState } from "react";
import { fetchComments } from "../../handleAPIs/fetchData";
import { debounce } from "lodash";

const useFetchComments = (postId) => {
  const [comments, setComments] = useState([]);
  const commentsRef = useRef(comments);

  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  const fetchCommentsForPost = useCallback(
    async (page) => {
      setIsCommentLoading(true);
      try {
        const response = await fetchComments(page, 20, postId);

        setComments([...comments, ...response.commentData]);
        setCurrentPage(page);
        setHasMore(response.hasMore);
      } catch (error) {
        console.error(error);
      } finally {
        setIsCommentLoading(false);
      }
    },
    [postId, comments]
  );

  const loadMoreComments = useCallback(
    debounce(async () => {
      if (isCommentLoading || !hasMore || comments.length === 0) return;
      console.log("fetching more comments...");
      setIsLoadingMore(true);
      await fetchCommentsForPost(currentPage + 1);
      setIsLoadingMore(false);
    }, 300),
    [
      isCommentLoading,
      hasMore,
      comments.length,
      currentPage,
      fetchCommentsForPost,
    ]
  );

  const fetchSubComments = useCallback((parentCommentId) => {});

  return {
    comments,
    setComments,
    isCommentLoading,
    fetchCommentsForPost,
    loadMoreComments,
    isLoadingMore,
  };
};

export default useFetchComments;
