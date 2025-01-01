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
import SetNewPasswordPage from './pages/NewPassWord.tsx';
// import NotificationsPage from './pages/NotificationsPage.tsx';

import { AuthProvider } from './context/AuthContext.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/posts/:postId" element={<ViewBlog />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/new-pass" element={<SetNewPasswordPage />} />
        {/* <Route path="/notifications" element={<NotificationsPage />} /> */}
      </Routes>

    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
