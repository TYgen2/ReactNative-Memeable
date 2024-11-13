import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../handleAPIs/fetchData";
import { handleFollow } from "../../store/actions/userActions";
import { UserProfileModel } from "../../models/UserProfileModel";
import { apiQueue } from "../../utils/helper";

export default useFetchProfileInfo = (userId, targetId) => {
  const [userData, setUserData] = useState(null);
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const { userDetails } = useSelector((state) => state.user);
  const isMe = userDetails?.userId === targetId;
  const dispatch = useDispatch();

  useEffect(() => {
    // prevent crash when user logout (reset userDetails)
    if (userId === undefined) return;

    // use global state userDetails for display
    if (isMe) {
      setUserData(new UserProfileModel(userDetails));
      setIsInfoLoading(false);
      return;
    }

    // fetching user profile data by API
    const fetchUserProfile = async () => {
      setIsInfoLoading(true);

      try {
        const res = await apiQueue.add(() => fetchProfile(targetId));
        setUserData(new UserProfileModel(res.userData));
      } catch (error) {
        console.error(
          error.response?.data?.msg || "Error when fetching additional info"
        );
        setUserData(null);
      } finally {
        setIsInfoLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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
  const handlePressedFollow = () => {
    // handle follow API, also update global state
    dispatch(
      handleFollow({
        targetId,
        action: userData.isFollowing ? "unfollow" : "follow",
      })
    ).then(() => {
      handleFollowersCount(userData.isFollowing ? "unfollow" : "follow");
    });
  };

  return {
    userData,
    setUserData,
    isInfoLoading,
    setIsInfoLoading,
    handleFollowersCount,
    isMe,
    handlePressedFollow,
  };
};
