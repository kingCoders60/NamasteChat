import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'
import {useAuthStore} from './store/useAuthStore.js'

const App = () => {
   const { authUser,checkAuth } = useAuthStore();
   useEffect(()=>{
    checkAuth();
   },[checkAuth])
   console.log({authUser});
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App
