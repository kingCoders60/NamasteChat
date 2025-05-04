import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from "./pages/SettingsPage";
import {useAuthStore} from './store/useAuthStore.js'
import {useThemeStore} from "./store/useThemeStore"
import {useEffect} from "react"
import {Loader} from "lucide-react";
import { Navigate } from "react-router-dom";
import {Toaster} from "react-hot-toast"
import Footer from "./components/Footer.jsx"

const App = () => {
    const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
    const {theme}=useThemeStore();

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
    <div data-theme={theme}>
      <Navbar className="swap swap-rotate" />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={authUser===null ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<SettingsPage/>}/>
      </Routes>
      <Toaster />
      <Footer/>
    </div>
  );
}

export default App
