import { useContext, useEffect, useState } from "react";
import { getTokens } from "../utils/tokenActions";
import { UpdateContext } from "../context/loading";
import { useSelector } from "react-redux";
import { fetchProfile } from "../handleAPIs/fetchData";

export default useFetchProfileInfo = (userId, targetId) => {
  const [userData, setUserData] = useState(null);
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const { shouldFetch, setShouldFetch } = useContext(UpdateContext);
  const { userDetails } = useSelector((state) => state.user);
  const isMe = userDetails?.userId === targetId;

  useEffect(() => {
    // prevent crash when user logout (reset userDetails)
    if (userId === undefined) return;

    if (isMe) {
      setUserData(userDetails);
      setIsInfoLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setIsInfoLoading(true);

      try {
        const tokens = await getTokens();
        const res = await fetchProfile(
          targetId,
          tokens.jwtToken,
          tokens.refreshToken
        );
        setUserData(res.userData);
      } catch (error) {
        console.error(
          error.response?.data?.msg || "Error when fetching additional info"
        );
      } finally {
        setIsInfoLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, targetId]);

  // handle local UI state update
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
  };

  return { userData, setUserData, isInfoLoading, handleFollowersCount, isMe };
};
