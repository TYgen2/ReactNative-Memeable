import { useContext, useEffect, useState } from "react";
import { getTokens } from "../utils/tokenActions";
import { UpdateContext } from "../context/loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../handleAPIs/fetchData";
import { handleFollow } from "../store/userActions";

export default useFetchProfileInfo = (userId, targetId) => {
  const [userData, setUserData] = useState(null);
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const { shouldFetch, setShouldFetch } = useContext(UpdateContext);
  const { userDetails } = useSelector((state) => state.user);
  const isMe = userDetails?.userId === targetId;
  const dispatch = useDispatch();

  useEffect(() => {
    // prevent crash when user logout (reset userDetails)
    if (userId === undefined) return;

    // use global state userDetails for display
    if (isMe) {
      setUserData(userDetails);
      setIsInfoLoading(false);
      return;
    }

    // fetching user profile data by API
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

  // button actions for follow / unfollow in UserProfile
  const handlePressed = async () => {
    const tokens = await getTokens();
    // handle follow API, also update global state
    dispatch(
      handleFollow({
        targetId,
        action: userData.isFollowing ? "unfollow" : "follow",
        jwtToken: tokens.jwtToken,
        refreshToken: tokens.refreshToken,
      })
    ).then(() => {
      handleFollowersCount(userData.isFollowing ? "unfollow" : "follow");
    });
  };

  return {
    userData,
    setUserData,
    isInfoLoading,
    handleFollowersCount,
    isMe,
    handlePressed,
  };
};
