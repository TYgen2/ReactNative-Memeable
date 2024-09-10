import { useContext, useState } from "react";
import { getTokens } from "../utils/tokenActions";
import { fetchProfile } from "../api/userActions";
import { UpdateContext } from "../context/loading";

export default useFetchProfileInfo = (userId, targetId) => {
  const [userData, setUserData] = useState(null);
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const { shouldFetch, setShouldFetch } = useContext(UpdateContext);

  if (!userId || !targetId) return;

  const fetchUserProfile = async () => {
    setIsInfoLoading(true);
    try {
      const tokens = await getTokens();
      const res = await fetchProfile(
        userId,
        targetId,
        tokens.jwtToken,
        tokens.refreshToken
      );
      setUserData(res);
    } catch (error) {
      console.error(
        error.response?.data?.msg || "Error when fetching additional info"
      );
    } finally {
      setIsInfoLoading(false);
    }
  };

  const handleFollowersCount = (action) => {
    setUserData((prev) => {
      switch (action) {
        case "follow":
          return {
            ...prev,
            followersCount: prev.followersCount + 1,
            isFollowing: true,
          };
        case "unfollow":
          return {
            ...prev,
            followersCount: prev.followersCount - 1,
            isFollowing: false,
          };
        default:
          return prev;
      }
    });
    setShouldFetch(true);
  };

  return { userData, isInfoLoading, fetchUserProfile, handleFollowersCount };
};
