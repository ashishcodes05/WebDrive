import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import toast from "react-hot-toast";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const BASE_URL = "http://localhost:4000"
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const fetchDirectoryContents = async (dirId) => {
    try {
      const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
        method: "GET",
        credentials: 'include'
      });
      const data = await response.json();
      if (response.status === 404) {
        toast.error("Directory not found");
        return;
      }
      if (data.success) {
        setFiles(data.directoryData.files);
        setDirectories(data.directoryData.directories);
      }
    } catch (err) {
      console.error("Error fetching directory contents:", err);
    }
  }
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/`, {
        method: "GET",
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }
  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user]);
  const value = {
    files,
    setFiles,
    directories,
    setDirectories,
    fetchDirectoryContents,
    fetchUserData,
    user,
    setUser,
    loggedIn,
    setLoggedIn
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}