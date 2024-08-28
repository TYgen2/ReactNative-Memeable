import React, { createContext, useState } from "react";

export const UpdateContext = createContext();

export const LoadingContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <UpdateContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};
