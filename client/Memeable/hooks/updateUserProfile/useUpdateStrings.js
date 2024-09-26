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
    if (
      displayName !== initialStringsRef.current.displayName ||
      username !== initialStringsRef.current.username ||
      userBio !== initialStringsRef.current.userBio
    ) {
      console.log("Proceed to update strings info!!");
      try {
        return await apiQueue.add(() =>
          dispatch(
            handleUpdateStrings({
              displayName,
              username,
              userBio,
            })
          )
        );
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
