import { Outlet } from "react-router"

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background w-full">
      <div className="mx-auto w-[1500px] grow">
        <Outlet />
      </div>
    </div>
  )
}

export default App
