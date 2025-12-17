import { Outlet } from "react-router"
import Content from "./Components/Content"
import Footer from "./Components/Footer"
import Navbar from "./components/Navbar"

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
