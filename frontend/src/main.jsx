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
import Users from './Pages/Users.jsx';
import ManageRoles from './Pages/ManageRoles.jsx'

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
  },
  {
    path: "/users",
    element: (
      <Users />
    )
  },
  {
    path: "/users/update-roles",
    element: (
      <ManageRoles />
    )
  }
]);

const toastOptions = {
          duration: 4200,
          style: {
            background: "rgba(30, 41, 59, 0.85)",
            color: "#ffffff",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "14px",
            padding: "14px 16px",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
          },
          className: "text-sm",
          success: {
            iconTheme: {
              primary: "#4f8bff",
              secondary: "#0f0f1a",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0f0f1a",
            },
          },
          loading: {
            iconTheme: {
              primary: "#9ca3af",
              secondary: "#0f0f1a",
            },
          },
        };

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster
        position="bottom-right"
        toastOptions={toastOptions}
      />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </AppProvider>
)
