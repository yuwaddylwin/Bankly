// import Navbar from "./components/Navbar";

import {Routes, Route} from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";

export default function App() {
  return (
    
    <div>
      {/* <Navbar/> */}

      <Routes>
        <Route path="/" element={<SignUpPage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        {/* <Route path="/login" element={<LoginPage/>} />
        <Route path="/logout" element={<LogoutPage/>} /> */}
      </Routes>
    </div>
  );
}
