import React, { useEffect, useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const createUser = (username, id) => {
    setIsLoadingUser(true);
    //auth data
    setCurrentUser({
      username: username,
      uid: id
    })
    return Promise.resolve({
      username: username,
      uid: id
    })

  };

  useEffect(() => {
    if (currentUser != null) {
      setIsLoadingUser(false);
    } else {
      setIsLoadingUser(true);
    }
  }, [currentUser])
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoadingUser,
        createUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};