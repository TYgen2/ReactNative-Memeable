import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { apiQueue } from "../../utils/helper";
import { handleUpdateGradient } from "../../store/userActions";

export const useUpdateGradient = (gradientData) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [startColor, setStartColor] = useState(gradientData.colors[0]);
  const [endColor, setEndColor] = useState(gradientData.colors[1]);

  const [gradientConfig, setGradientConfig] = useState({
    start: gradientData.start,
    end: gradientData.end,
    colors: [startColor, endColor],
  });

  const initialGradientRef = useRef(gradientData);
  const dispatch = useDispatch();

  const updateGradientInfo = async () => {
    if (gradientConfig !== initialGradientRef.current) {
      console.log("Proceed to update gradient info!!");
      try {
        return await apiQueue.add(() =>
          dispatch(
            handleUpdateGradient({
              gradientConfig,
            })
          )
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
    return Promise.resolve();
  };

  useEffect(() => {
    const angle = sliderValue * Math.PI * 2;
    const start = {
      x: 0.5 + 0.5 * Math.cos(angle),
      y: 0.5 + 0.5 * Math.sin(angle),
    };
    const end = {
      x: 0.5 + 0.5 * Math.cos(angle + Math.PI),
      y: 0.5 + 0.5 * Math.sin(angle + Math.PI),
    };

    setGradientConfig({
      start,
      end,
      colors: [startColor, endColor],
    });
  }, [sliderValue, startColor, endColor]);

  return {
    sliderValue,
    setSliderValue,
    startColor,
    setStartColor,
    endColor,
    setEndColor,
    gradientConfig,
    updateGradientInfo,
  };
};
