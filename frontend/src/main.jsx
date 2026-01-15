import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './Context/AppContext.jsx'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from "react-router";
import Content from './Components/Content.jsx'
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
    children: [
      {
        path: "/",
        element: <Content />
      },
      {
        path: "/directory/:dirId",
        element: <Content />
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
  }
]);

createRoot(document.getElementById('root')).render(
    <AppProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AppProvider>
)
