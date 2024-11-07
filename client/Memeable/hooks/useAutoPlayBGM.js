import { useState, useEffect } from "react";
import { getData } from "../config/asyncStorage";

export const useAutoplayBGM = () => {
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadAutoplaySettings = async () => {
      const savedAutoplay = await getData("autoplayBGM");
      setShouldAutoplay(savedAutoplay ?? false);
      setIsLoaded(true);
    };
    loadAutoplaySettings();
  }, []);

  return { shouldAutoplay, isLoaded };
};
