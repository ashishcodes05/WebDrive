import React, { useEffect, useState } from 'react'
import { Cloud, CloudUpload, FolderPlus, User } from "lucide-react"
import UploadModal from './UploadModal'
import CreateFolderModal from './CreateFolderModal';
import { Link, useNavigate } from 'react-router';
import UserMenu from './UserMenu';
import { useAppContext } from '../Context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [toggleUserMenu, setToggleUserMenu] = useState(false);
  const { loggedIn, setLoggedIn, user, setUser } = useAppContext();
  const closeUploadModal = () => {
    setOpenUploadModal(false)
  };
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/logout", {
        method: "POST",
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setLoggedIn(false);
        navigate("/Login");
        setUser(null);
        toast.success(data.message);
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }
  return (
    <div className='flex sticky top-0 z-50 items-center justify-between p-6 px-16 border-b border-primary bg-background shadow-md'>
      <div className='flex items-center'>
        <Cloud className='text-primary-accent' size={40} />
        <span className='text-2xl text-secondary font-bold ml-2'>Web<span className='text-secondary-accent'>Drive</span></span>
      </div>
      <div className='px-4 flex items-center space-x-12'>
        <button onClick={() => setOpenUploadModal(true)} className='flex flex-col items-center'>
          <CloudUpload className='text-primary-accent hover:text-secondary-accent hover:scale-110 transition-transform duration-200 cursor-pointer' size={30} />
          <span className='text-xs text-text-secondary'>Upload</span>
        </button>
        <button onClick={() => setOpenCreateFolderModal(true)} className='flex flex-col items-center'>
          <FolderPlus className='text-primary-accent cursor-pointer hover:text-secondary-accent hover:scale-110 transition-transform duration-200' size={30} />
          <span className='text-xs text-text-secondary'>Create</span>
        </button>
        {!loggedIn ? (
          <Link to={"/Login"} className='text-white bg-secondary-accent px-4 py-2 rounded-md cursor-pointer hover:bg-secondary hover:scale-110 transition-transform duration-200'>Login</Link>
        ) : (
          <button onClick={() => setToggleUserMenu(!toggleUserMenu)} className='flex flex-col items-center'>
            <User className='text-primary-accent cursor-pointer hover:text-secondary-accent hover:scale-110 transition-transform duration-200' size={30} />
            <span className='text-xs text-text-secondary'>Profile</span>
            {toggleUserMenu && <UserMenu user={user} onLogout={onLogout} />}
          </button>
        )}
      </div>
      {openUploadModal && <UploadModal onClose={closeUploadModal} />}
      {openCreateFolderModal && (<CreateFolderModal
        onClose={() => setOpenCreateFolderModal(false)}
        onCreate={() => {
          setOpenCreateFolderModal(false);
        }}
      />)}
    </div>
  )
}

export default Navbar