import { useState } from 'react'
import { Cloud, CloudUpload, FolderPlus, User } from "lucide-react"
import UploadModal from './UploadModal'
import CreateFolderModal from './CreateFolderModal';
import { Link, NavLink, useNavigate } from 'react-router';
import UserMenu from './UserMenu';
import { useAppContext } from '../Context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [toggleUserMenu, setToggleUserMenu] = useState(false);
  const { user, setUser } = useAppContext();
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
        navigate("/Login");
        setUser(null);
        toast.success(data.message);
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

  const onLogoutAll = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/logoutAll", {
        method: "POST",
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        navigate("/Login");
        setUser(null);
        toast.success(data.message);
      }
    } catch (err) {
      toast.error("Error logging out from all devices:");
      console.error("Error logging out from all devices:", err);
    }
  }
  return (<nav class="z-50 flex items-center justify-between h-24 w-full py-6 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur">
    <div className="flex items-center">
      <Cloud className="text-primary-accent fill-current" size={40} />
      <span className="text-2xl text-primary font-bold ml-2">
        <i>Web</i>
        <span className="text-secondary-accent">
          <i>Drive</i>
        </span>
      </span>
    </div>

    <div className="hidden md:flex items-center gap-8 transition duration-500 text-lg text-white">
      <NavLink to="/" end className={({ isActive }) => `hover:text-slate-300 transition ${isActive ? 'text-secondary-accent font-semibold border-b-2 border-primary-accent' : ''}`}>
        Home
      </NavLink>
      <NavLink to="/directory" className={({ isActive }) => `hover:text-slate-300 transition ${isActive ? 'text-secondary-accent font-semibold border-b-2 border-primary-accent' : ''}`}>
        Files
      </NavLink>
      <NavLink to="/pricing" className={({ isActive }) => `hover:text-slate-300 transition ${isActive ? 'text-secondary-accent font-semibold border-b-2 border-primary-accent' : ''}`}>
        Pricing
      </NavLink>
      <NavLink to="/resources" className={({ isActive }) => `hover:text-slate-300 transition ${isActive ? 'text-secondary-accent font-semibold border-b-2 border-primary-accent' : ''}`}>
        Resources
      </NavLink>
    </div>

    {user ? (
      <div className="hidden md:flex space-x-8 text-md">
        <button onClick={() => setOpenUploadModal(true)} className='flex flex-col items-center hover:text-primary-accent hover:scale-105 transition-transform duration-200 cursor-pointer'>
          <CloudUpload className='text-secondary-accent' size={25} />
          <span className='text-sm text-primary-accent font-bold'>Upload</span>
        </button>
        <button onClick={() => setOpenCreateFolderModal(true)} className='flex flex-col items-center hover:text-primary-accent hover:scale-105 transition-transform duration-200 cursor-pointer'>
          <FolderPlus className='text-secondary-accent' size={25} />
          <span className='text-sm text-primary-accent font-bold'>Create</span>
        </button>
        <button onClick={() => setToggleUserMenu(!toggleUserMenu)} className='flex flex-col items-center hover:text-primary-accent hover:scale-105 transition-transform duration-200 cursor-pointer'>
          <User className='text-secondary-accent fill-current' size={25} />
          <span className='text-sm text-primary-accent font-bold'>Profile</span>
          {toggleUserMenu && <UserMenu user={user} onLogout={onLogout} onLogoutAll={onLogoutAll} />}
        </button>
      </div>
    ) : (
      <div class="hidden md:block space-x-3 text-md">
        <button class="px-6 py-2 bg-primary-accent hover:bg-primary-accent/80 transition text-white rounded-md">
          Get started
        </button>
        <button class="transition px-6 py-2 border border-secondary-400 font-bold rounded-md text-secondary-accent hover:border-slate-400 hover:text-slate-300">
          Login
        </button>
      </div>
    )}
    <button id="open-menu" class="md:hidden active:scale-90 transition">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-menu-icon lucide-menu"
      >
        <path d="M4 5h16" />
        <path d="M4 12h16" />
        <path d="M4 19h16" />
      </svg>
    </button>
    {openUploadModal && <UploadModal onClose={closeUploadModal} />}
      {openCreateFolderModal && (<CreateFolderModal
        onClose={() => setOpenCreateFolderModal(false)}
        onCreate={() => {
          setOpenCreateFolderModal(false);
        }}
      />)}
  </nav>)
  return (
    <div className='flex sticky top-0 z-50 items-center justify-between p-6 px-16 border-b border-primary bg-background shadow-md'>
      <div className='flex items-center'>
        <Cloud className='text-primary-accent' size={40} />
        <span className='text-2xl text-secondary font-bold ml-2'><i>Web</i><span className='text-secondary-accent'><i>Drive</i></span></span>
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
        {!user ? (
          <Link to={"/Login"} className='text-white bg-secondary-accent px-4 py-2 rounded-md cursor-pointer hover:bg-secondary hover:scale-110 transition-transform duration-200'>Login</Link>
        ) : (
          <button onClick={() => setToggleUserMenu(!toggleUserMenu)} className='flex flex-col items-center'>
            <User className='text-primary-accent cursor-pointer hover:text-secondary-accent hover:scale-110 transition-transform duration-200' size={30} />
            <span className='text-xs text-text-secondary'>Profile</span>
            {toggleUserMenu && <UserMenu user={user} onLogout={onLogout} onLogoutAll={onLogoutAll} />}
          </button>
        )}
      </div>
      
    </div>
  )
}

export default Navbar