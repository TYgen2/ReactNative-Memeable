import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { apiQueue } from "../../utils/helper";
import { handleUpdateSong } from "../../store/actions/userActions";

export default useUpdateSong = (songData) => {
  const [newSong, setNewSong] = useState({
    songUri: songData.songUri,
    songName: songData.songName,
  });
  const initialSongRef = useRef(songData);
  const dispatch = useDispatch();

  const updateSongInfo = async () => {
    if (
      newSong.songUri !== initialSongRef.current.songUri ||
      newSong.songName !== initialSongRef.current.songName
    ) {
      console.log("Proceed to update song info!!");
      try {
        return await apiQueue.add(() =>
          dispatch(
            handleUpdateSong({
              songUri: newSong.songUri,
              songName: newSong.songName,
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
    newSong,
    setNewSong,
    updateSongInfo,
  };
};
