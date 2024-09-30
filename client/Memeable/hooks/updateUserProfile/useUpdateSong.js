import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { apiQueue } from "../../utils/helper";
import { handleUpdateSong } from "../../store/userActions";

export default useUpdateSong = (songData) => {
  const [newSong, setNewSong] = useState({
    uri: songData.songUri,
    name: songData.songName,
  });
  const [newCover, setNewCover] = useState(songData.imageUri);
  const [newColor, setNewColor] = useState(songData.borderColor);
  const initialSongRef = useRef(songData);
  const dispatch = useDispatch();

  const updateSongInfo = async () => {
    const updates = {};

    if (newCover !== initialSongRef.current.imageUri) {
      updates.imageUri = newCover;
    }
    if (newSong.uri !== initialSongRef.current.songUri) {
      updates.songUri = newSong.uri;
    }
    if (newSong.name !== initialSongRef.current.songName) {
      updates.songName = newSong.name;
    }
    if (newColor !== initialSongRef.current.borderColor) {
      updates.borderColor = newColor;
    }

    if (Object.keys(updates).length > 0) {
      console.log("Proceed to update song info!!");
      try {
        return await apiQueue.add(() => dispatch(handleUpdateSong(updates)));
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
    return Promise.resolve();
  };

  return {
    newSong,
    setNewSong,
    newCover,
    setNewCover,
    newColor,
    setNewColor,
    updateSongInfo,
  };
};
