import React, { createContext, useState } from "react";

export const UpdateContext = createContext();

export const LoadingContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true);

  return (
    <UpdateContext.Provider
      value={{
        // isLoading,
        // setIsLoading,
        shouldFetch,
        setShouldFetch,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};
