import * as Keychain from "react-native-keychain";

// store / update tokens
export const storeTokens = async (jwtToken, refreshToken) => {
  await Keychain.setGenericPassword("jwtToken", jwtToken, {
    service: "jwtToken",
  });
  await Keychain.setGenericPassword("refreshToken", refreshToken, {
    service: "refreshToken",
  });
};

// retrieve tokens
export const getTokens = async () => {
  const jwt = await Keychain.getGenericPassword({
    service: "jwtToken",
  });
  const refresh = await Keychain.getGenericPassword({
    service: "refreshToken",
  });
  return { jwtToken: jwt.password, refreshToken: refresh.password };
};

// remove tokens when logout
export const clearTokens = async () => {
  await Keychain.resetGenericPassword({ service: "jwtToken" });
  await Keychain.resetGenericPassword({ service: "refreshToken" });
};
