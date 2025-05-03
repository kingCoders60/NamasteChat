import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from "./pages/SettingsPage";
import {useAuthStore} from './store/useAuthStore.js'
import {useEffect} from "react"
import {Loader} from "lucide-react";
import { Navigate } from "react-router-dom";
import {Toaster} from "react-hot-toast"


const App = () => {
    const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

    console.log({ onlineUsers });

    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    console.log({ authUser });

    if (isCheckingAuth && !authUser)
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader className="loading loading-bars loading-" />
        </div>
      );

  return (
    <div>
      <Navbar className="swap swap-rotate" />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App
