import React, { createContext, useState } from "react";

// Create Context
export const UserContext = createContext();

// Context Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: "", // "admin" or "user"
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
