import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import WelcomePage from "./pages/WelcomePage";
import CreateBlog from "./pages/CreateBlog";
import Profile from "./pages/ProfilePage";
import ViewBlog from "./pages/ViewBlog.tsx";
import Home from "./pages/HomePage";
import ResetPassword from "./pages/ResetPassword.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  return (
    <>
    <ToastContainer
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
        <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>

    </BrowserRouter>
    </>
  );
}


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Root element not found!");
}
