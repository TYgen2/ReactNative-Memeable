import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleUpdateStrings } from "../../store/userActions";
import { apiQueue } from "../../utils/helper";

export default useUpdateStrings = (stringData) => {
  const [displayName, setDisplayName] = useState(stringData.displayName);
  const [username, setUsername] = useState(stringData.username);
  const [userBio, setUserBio] = useState(stringData.userBio);
  const initialStringsRef = useRef(stringData);
  const dispatch = useDispatch();

  const updateStringInfo = async () => {
    const updates = {};

    if (displayName !== initialStringsRef.current.displayName) {
      updates.displayName = displayName;
    }
    if (username !== initialStringsRef.current.username) {
      updates.username = username;
    }
    if (userBio !== initialStringsRef.current.userBio) {
      updates.userBio = userBio;
    }

    if (Object.keys(updates).length > 0) {
      console.log("Proceed to update strings info!!");
      try {
        return await apiQueue.add(() => dispatch(handleUpdateStrings(updates)));
      } catch (error) {
        console.error("Error when updating user profile", error.message);
        throw error;
      }
    }

    return Promise.resolve();
  };

  return {
    displayName,
    setDisplayName,
    username,
    setUsername,
    userBio,
    setUserBio,
    updateStringInfo,
  };
};
