import { useCallback, useEffect, useState } from "react";
import { handleSearch } from "../handleAPIs/userActions";

export default useSearch = (initialQuery = "") => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);

  const search = useCallback(async () => {
    setIsSearching(true);
    const res = await handleSearch(query);
    setResults(res.searchRes);
    setIsSearching(false);
  }, [query]);

  const updateFollowStatus = (userId, isFollowing) => {
    setResults((prev) =>
      prev.map((user) => {
        user._id === userId ? { ...user, isFollowing } : user;
      })
    );
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, search]);

  return {
    query,
    setQuery,
    results,
    setResults,
    isSearching,
    updateFollowStatus,
  };
};
