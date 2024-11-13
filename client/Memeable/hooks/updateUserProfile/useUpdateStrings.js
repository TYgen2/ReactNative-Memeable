import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleUpdateStrings } from "../../store/actions/userActions";
import { apiQueue } from "../../utils/helper";

export default useUpdateStrings = (stringData) => {
  const [newDisplayName, setNewDisplayName] = useState(stringData.displayName);
  const [newUsername, setNewUsername] = useState(stringData.username);
  const [newUserBio, setNewUserBio] = useState(stringData.userBio);
  const initialStringsRef = useRef(stringData);
  const dispatch = useDispatch();

  const updateStringInfo = async () => {
    const updates = {};

    if (newDisplayName !== initialStringsRef.current.displayName) {
      updates.displayName = newDisplayName;
    }
    if (newUsername !== initialStringsRef.current.username) {
      updates.username = newUsername;
    }
    if (newUserBio !== initialStringsRef.current.userBio) {
      updates.userBio = newUserBio;
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
    newDisplayName,
    setNewDisplayName,
    newUsername,
    setNewUsername,
    newUserBio,
    setNewUserBio,
    updateStringInfo,
  };
};
