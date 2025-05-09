import { Dashboard } from "./pages/Dashboard"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login/>}/>
    </Routes>
  </BrowserRouter>
}

export default App