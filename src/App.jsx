import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './navbarcomponent/navbar'
import SellerHome from './sellercomponent/sellerhome'
import './App.css'

function App() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/'

  return (
    <div className="App">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/seller" replace />} />
        <Route path="/seller" element={<SellerHome />} />
        <Route path="*" element={<Navigate to="/seller" replace />} />
      </Routes>
    </div>
  )
}

export default App
