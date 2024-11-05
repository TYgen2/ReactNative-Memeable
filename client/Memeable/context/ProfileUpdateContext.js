import React, { createContext, useContext, useRef, useState } from "react";

const ProfileUpdateContext = createContext(null);

export const ProfileUpdateProvider = ({ children }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateFunctions = useRef(new Map());

  const registerUpdate = (key, updateFn) => {
    updateFunctions.current.set(key, updateFn);
  };

  const unregisterUpdate = (key) => {
    updateFunctions.current.delete(key);
  };

  const handleUpdateAll = async () => {
    try {
      const updates = Array.from(updateFunctions.current.values());
      const results = await Promise.allSettled(updates.map((fn) => fn()));

      return results.every(
        (result) =>
          result.status === "fulfilled" &&
          (result.value === undefined ||
            result.value?.meta?.requestStatus === "fulfilled")
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  const handleSave = async (navigation) => {
    setIsUpdating(true);
    try {
      const success = await handleUpdateAll();
      if (success) {
        navigation.goBack();
        unregisterUpdate("gradient");
        unregisterUpdate("cover");
        unregisterUpdate("song");
      } else {
        console.log("Some updates failed");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProfileUpdateContext.Provider
      value={{
        isUpdating,
        setIsUpdating,
        handleSave,
        registerUpdate,
        unregisterUpdate,
        handleUpdateAll,
      }}
    >
      {children}
    </ProfileUpdateContext.Provider>
  );
};

export const useProfileUpdates = () => {
  const context = useContext(ProfileUpdateContext);
  if (!context) {
    throw new Error(
      "useProfileUpdates must be used within a ProfileUpdateProvider"
    );
  }
  return context;
};
