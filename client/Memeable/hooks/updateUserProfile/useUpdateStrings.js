import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleUpdateStrings } from "../../store/userActions";

export default useUpdateStrings = (stringData) => {
  const [displayName, setdisplayName] = useState(stringData.displayName);
  const [username, setUsername] = useState(stringData.username);
  const [userBio, setUserBio] = useState(stringData.userBio);
  const initialStringsRef = useRef(stringData);
  const dispatch = useDispatch();

  const updateStringInfo = () => {
    if (
      displayName !== initialStringsRef.current.displayName ||
      username !== initialStringsRef.current.username ||
      userBio !== initialStringsRef.current.userBio
    ) {
      console.log("Proceed to update strings info!!");
      try {
        dispatch(
          handleUpdateStrings({
            displayName,
            username,
            userBio,
          })
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
  };

  return {
    displayName,
    setdisplayName,
    username,
    setUsername,
    userBio,
    setUserBio,
    updateStringInfo,
  };
};
