import { NativeModules } from "react-native";

const { FFmpegAudioTrimmerModule } = NativeModules;

export const trimAudio = async (
  sourcePath,
  outputPath,
  startMs,
  durationMs
) => {
  try {
    const trimmedPath = await FFmpegAudioTrimmerModule.trimAudio(
      sourcePath,
      outputPath,
      startMs,
      durationMs
    );
    console.log("Audio trimmed successfully:", trimmedPath);
    return trimmedPath;
  } catch (error) {
    console.error("Error trimming audio:", error);
    throw error;
  }
};
