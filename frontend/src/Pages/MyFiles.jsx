import React, { useEffect } from "react";
import DirectoryView from "../Components/DirectoryView";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useAppContext } from "../Context/AppContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";

const MyFiles = () => {
  const { user, loadingUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && !user) {
      toast.error("Please login to access your files");
      navigate("/");
    }
  }, [user, loadingUser]);

  if (loadingUser) return <Loader />;

  if (!user) return null;

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Navbar />
      <DirectoryView />
    </div>
  );
};

export default MyFiles;