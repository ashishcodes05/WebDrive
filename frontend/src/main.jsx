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
  
]);

createRoot(document.getElementById('root')).render(
    <AppProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AppProvider>
)
