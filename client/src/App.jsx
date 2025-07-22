import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="*" element={<h1> PAGE NOT FOUND</h1>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
