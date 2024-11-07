import { useCallback, useEffect, useState } from "react";
import TrackPlayer from "react-native-track-player";

const usePlaybackPreview = (songUri) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const setupPlayer = useCallback(async () => {
    try {
      const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();
      const queue = await TrackPlayer.getQueue();

      if (activeTrackIndex === undefined || queue[0]?.url !== songUri) {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          url: songUri,
        });
        await TrackPlayer.seekTo(0);
      }
    } catch (error) {
      console.log({ error });
    }
  });

  const togglePlayback = useCallback(async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  }, [isPlaying, songUri]);

  const resetPlayer = useCallback(async () => {
    await setupPlayer();
    await TrackPlayer.seekTo(0);
  }, [songUri]);

  const cleanup = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isPlaying,
    togglePlayback,
    resetPlayer,
    cleanup,
  };
};

export default usePlaybackPreview;
