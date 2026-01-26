import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './Context/AppContext.jsx'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import MyFiles from './Pages/MyFiles.jsx'
import Home from './Pages/Home.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProfileSettings from './Pages/ProfileSettings.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/directory",
        element: <MyFiles />
      },
      {
        path: "/directory/:dirId",
        element: <MyFiles />
      }
    ],
  },
  {
    path: "/login",
    element: (
      <Login />
    )
  },
  {
    path: "/register",
    element: (
      <Register />
    )
  },
  {
    path: "/settings",
    element: (
      <ProfileSettings />
    )
  }
]);

createRoot(document.getElementById('root')).render(
    <AppProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster />
      <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </AppProvider>
)
