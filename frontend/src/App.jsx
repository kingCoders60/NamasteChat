import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'
import {useAuthStore} from './store/useAuthStore.js'
import {useEffect} from "react"
import {Loader} from "lucide-react";

const App = () => {
   const { authUser,checkAuth,isCheckingAuth } = useAuthStore();
   useEffect(()=>{
    checkAuth();
   },[checkAuth])
   console.log({authUser});
   if(/*isCheckingAuth && !authUser*/ true) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
   )
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
