import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './navbarcomponent/navbar'
import Login from './loginpagecomponent/loginpages'
import Signup from './loginpagecomponent/signuppage'
import RequireAuth from './auth/RequireAuth'
import SellerHome from './sellercomponent/sellerhome'
import ProductListingForm from './sellercomponent/productlistingform'
import BuyerDashboard from './buyercomponent/buyerdashboard'
import './App.css'

function App() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/signup'

  return (
    <div className="App">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/seller"
          element={
            <RequireAuth>
              <SellerHome />
            </RequireAuth>
          }
        />
        <Route
          path="/seller/products/new"
          element={
            <RequireAuth>
              <ProductListingForm />
            </RequireAuth>
          }
        />
        <Route
          path="/buyer"
          element={
            <RequireAuth>
              <BuyerDashboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
