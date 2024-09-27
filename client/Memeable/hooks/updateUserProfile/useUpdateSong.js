import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { apiQueue } from "../../utils/helper";

export default useUpdateSong = (songData) => {
  const [newSong, setNewSong] = useState(null);
  const initialSongRef = useRef(newSong);
  const dispatch = useDispatch();

  const updateSongInfo = async () => {
    if (newSong !== initialSongRef.current) {
      console.log("Proceed to update song info!!");
      try {
        // return await apiQueue.add(() =>
        //   dispatch(
        //     handleUpdateIcon({
        //       icon: newIcon.customIcon,
        //     })
        //   )
        // );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
    return Promise.resolve();
  };

  return { newSong, setNewSong };
};
