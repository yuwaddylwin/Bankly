import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PINPage() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleNumberClick = (num) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  // 🔥 AUTO CHECK PIN
  useEffect(() => {
  if (pin.length !== 6) return;

  if (pin === "111222") {
    setTimeout(() => {
      navigate("/transfer");
    }, 200);
  } else {
    alert("Incorrect PIN");
    setPin("");
  }
}, [pin, navigate]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-between py-10 relative">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md active:scale-95 transition"
      >
        <ArrowLeft size={20} />
      </button>

      {/* TOP */}
      <div className="flex flex-col items-center">
        
        <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
          Bankly
        </div>

        <h2 className="mt-4 text-xl font-semibold">Enter PIN</h2>
        <p className="text-gray-500 text-sm">
          Enter your 6-digit security PIN
        </p>

        {/* PIN DOTS */}
        <div className="flex gap-3 mt-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < pin.length ? "bg-indigo-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* KEYPAD */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {[1,2,3,4,5,6,7,8,9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="w-16 h-16 rounded-full bg-white shadow-md text-lg font-semibold flex items-center justify-center active:scale-95 transition"
          >
            {num}
          </button>
        ))}

        <div></div>

        <button
          onClick={() => handleNumberClick("0")}
          className="w-16 h-16 rounded-full bg-white shadow-md text-lg font-semibold flex items-center justify-center active:scale-95 transition"
        >
          0
        </button>

        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-full bg-white shadow-md text-lg flex items-center justify-center active:scale-95 transition"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}