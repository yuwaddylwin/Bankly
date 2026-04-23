import { Home, CreditCard, Bell, Settings, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bg-base-100 border-t py-2 px-4 flex justify-between items-center">

      <div onClick={() => navigate("/")} className="flex flex-col items-center text-sm text-gray-500 cursor-pointer">
        <Home size={20} />
        Home
      </div>

      <div className="flex flex-col items-center text-sm text-gray-500">
        <CreditCard size={20} />
        Cards
      </div>

      <div className="bg-indigo-500 p-4 rounded-full -mt-8 shadow-lg">
        <ScanLine className="text-white" />
      </div>

      <div className="flex flex-col items-center text-sm text-gray-500">
        <Bell size={20} />
        Noti
      </div>

      <div className="flex flex-col items-center text-sm text-gray-500">
        <Settings size={20} />
        Setting
      </div>
    </div>
  );
}