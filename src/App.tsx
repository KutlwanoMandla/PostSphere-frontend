import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import WelcomePage from "./pages/WelcomePage";
import CreateBlog from "./pages/CreateBlog";
import Profile from "./pages/ProfilePage";
import Home from "./pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
    
      <Routes> 
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>

    </BrowserRouter>
  );
}


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Root element not found!");
}
