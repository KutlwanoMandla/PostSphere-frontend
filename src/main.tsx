import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WelcomePage from "./pages/WelcomePage.tsx";
import CreateBlog from "./pages/CreateBlog.tsx";
import Profile from "./pages/ProfilePage.tsx";
import Home from "./pages/HomePage.tsx";
import ViewBlog from "./pages/ViewBlog.tsx";

import { AuthProvider } from './context/AuthContext.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import { ToastContainer } from 'react-toastify';  // Add this import
import 'react-toastify/dist/ReactToastify.css'
// import SetNewPasswordPage from './pages/NewPassWord.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <ToastContainer  // Add this component
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/posts/:postId" element={<ViewBlog />} />
        <Route path="/profile/:id" element={<Profile />} />
        {/* <Route path="/new-password" element={<SetNewPasswordPage />} /> */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
