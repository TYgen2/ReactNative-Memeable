import { useState, useEffect, useCallback } from "react";
import TrackPlayer from "react-native-track-player";

export const useAudioState = (leftTrim, rightTrim) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(leftTrim || 0);
  const [isDragging, setIsDragging] = useState(false);

  const checkPlaybackPosition = useCallback(async () => {
    if (isPlaying) {
      const position = await TrackPlayer.getPosition();
      setCurrentPosition(position * 1000);
      if (position >= rightTrim / 1000) {
        await stopPreview();
        setCurrentPosition(leftTrim);
      }
    }
  }, [isPlaying, rightTrim, stopPreview]);

  const playPreview = useCallback(async () => {
    await TrackPlayer.seekTo(currentPosition / 1000);
    await TrackPlayer.play();
    setIsPlaying(true);
  }, [currentPosition]);

  const stopPreview = useCallback(async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  }, []);

  const setPosition = useCallback(
    async (newPosition, isDragStart) => {
      if (isDragStart !== undefined) {
        setIsDragging(isDragStart);
        if (isDragStart) {
          await TrackPlayer.pause();
          setIsPlaying(false);
        } else {
          setCurrentPosition(newPosition);
          await TrackPlayer.seekTo(newPosition / 1000);
          await TrackPlayer.play();
          setIsPlaying(true);
        }
      } else {
        setCurrentPosition(newPosition);
        if (!isPlaying && isDragging) {
          await TrackPlayer.seekTo(newPosition / 1000);
        }
      }
    },
    [isPlaying, isDragging]
  );

  useEffect(() => {
    const interval = setInterval(checkPlaybackPosition, 16);
    return () => interval && clearInterval(interval);
  }, [checkPlaybackPosition]);

  return {
    isPlaying,
    currentPosition,
    playPreview,
    stopPreview,
    setPosition,
  };
};
