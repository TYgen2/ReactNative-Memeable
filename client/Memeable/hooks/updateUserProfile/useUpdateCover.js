import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { apiQueue } from "../../utils/helper";
import { handleUpdateCover } from "../../store/userActions";

export default useUpdateCover = (coverData) => {
  const [newCover, setNewCover] = useState(coverData);
  const initialCoverRef = useRef(coverData);
  const dispatch = useDispatch();

  const updateCoverInfo = async () => {
    if (newCover !== initialCoverRef.current) {
      console.log("Proceed to update cover info!!");

      try {
        return await apiQueue.add(() =>
          dispatch(handleUpdateCover({ cover: newCover }))
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }

    return Promise.resolve();
  };

  return {
    newCover,
    setNewCover,
    updateCoverInfo,
  };
};
