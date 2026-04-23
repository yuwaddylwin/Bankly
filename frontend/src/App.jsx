// import Navbar from "./components/Navbar";

import {Routes, Route} from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";
import TopupPage from "./pages/TopupPage";
import BalancePage from "./pages/BalancePage";
import PINPage from "./pages/PINPage";

export default function App() {
  return (
    
    <div>
      {/* <Navbar/> */}

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/pin" element={<PINPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/topup" element={<TopupPage />} />
        <Route path="/balance" element={<BalancePage />} />


        {/* <Route path="/logout" element={<LogoutPage/>} /> */}
      </Routes>
    </div>
  );
}
