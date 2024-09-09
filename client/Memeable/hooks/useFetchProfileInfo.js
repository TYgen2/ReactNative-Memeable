import { useState } from "react";
import { getTokens } from "../utils/tokenActions";
import { fetchAdditional } from "../api/userActions";

export default useFetchProfileInfo = (userId) => {
  const [userData, setUserData] = useState(null);
  const [isInfoLoading, setIsInfoLoading] = useState(true);

  const fetchUserAdditional = async () => {
    setIsInfoLoading(true);
    try {
      const tokens = await getTokens();
      const res = await fetchAdditional(
        userId,
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

  return { userData, isInfoLoading, fetchUserAdditional };
};
