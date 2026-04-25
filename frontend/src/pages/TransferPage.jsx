import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft } from "lucide-react";

export default function TransferPage() {
  const navigate = useNavigate();
  const { user, getMe } = useAuthStore();

  const [receiver, setReceiver] = useState(null);
  const [receiverAcc, setReceiverAcc] = useState("AC");
  const [receiverError, setReceiverError] = useState("");
  const [checking, setChecking] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const maskAccount = (acc) => {
    if (!acc) return "";
    return acc.slice(0, 4) + "xxxxx" + acc.slice(-3);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getMe();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  const handleAccountChange = (e) => {
    let value = e.target.value.toUpperCase();

    if (!value.startsWith("AC")) value = "AC";

    const digits = value.slice(2).replace(/\D/g, "").slice(0, 10);
    setReceiverAcc("AC" + digits);
  };

  const handleKeyDown = (e) => {
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      receiverAcc.length <= 2
    ) {
      e.preventDefault();
    }
  };

  const fetchReceiver = async (acc) => {
    if (!user) return;

    setReceiver(null);
    setReceiverError("");

    if (acc.length !== 12) return;

    try {
      setChecking(true);

      const res = await axios.get(
        "http://localhost:5001/api/user/account/" + acc,
        { withCredentials: true }
      );

      const data = res.data;

      if (data.accountNumber === user.accountNumber) {
        setReceiverError("Cannot transfer to your own account");
        return;
      }

      setReceiver(data);
    } catch (err) {
    console.log("ERROR:", err.response);

    if (err.response?.status === 404) {
      setReceiverError("Account does not exist");
    } else if (err.response?.status === 400) {
      setReceiverError("Invalid account format");
    } else {
      setReceiverError("Error checking account");
    }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (receiverAcc.length === 12) {
      const delay = setTimeout(() => {
        fetchReceiver(receiverAcc);
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setReceiver(null);
      setReceiverError("");
    }
  }, [receiverAcc]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value < 0) return;
    setAmount(value);
  };

  const handleNext = () => {
    const amt = Number(amount);

    if (!receiver) return alert("Receiver not valid");
    if (!amt || amt <= 0) return alert("Enter valid amount");
    if (amt > user.balance) return alert("Insufficient balance");

    navigate("/confirm", {
      state: {
        sender: user,
        receiver: { ...receiver },
        amount: amt,
      },
    });
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!user) return <div className="p-4 text-center">User not found</div>;

  return (
    <div className="min-h-screen bg-base-200">

      {/* 🔥 GRADIENT HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-b-3xl shadow-lg flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full bg-white/20"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-semibold">Transfer Money</h1>
      </div>

      <div className="p-4 space-y-4">

        {/* FROM CARD */}
        <div className="bg-base-100 p-4 rounded-2xl shadow-md">
          <p className="text-sm opacity-60">From</p>
          <h2 className="font-semibold">{user.fullName}</h2>
          <p className="text-sm opacity-60">
            {maskAccount(user.accountNumber)}
          </p>
          <p className="text-indigo-500 font-medium mt-1">
            ฿{(user.balance || 0).toLocaleString()}
          </p>
        </div>

        {/* TO CARD */}
        <div className="bg-base-100 p-4 rounded-2xl shadow-md">
          <p className="text-sm opacity-60 mb-1">To</p>

          <input
            type="text"
            value={receiverAcc}
            onChange={handleAccountChange}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full"
          />

          {checking && (
            <p className="mt-2 text-indigo-500 text-sm">
              Checking account...
            </p>
          )}

          {receiver && !checking && (
            <p className="mt-2 text-blue-600 font-medium">
              {receiver.fullName}
            </p>
          )}

          {receiverError && !checking && (
            <p className="mt-2 text-red-500 text-sm">
              {receiverError}
            </p>
          )}
        </div>

        {/* AMOUNT CARD */}
        <div className="bg-base-100 p-4 rounded-2xl shadow-md">
          <p className="text-sm opacity-60 mb-1">Amount</p>

          <input
            type="number"
            placeholder="0.00 THB"
            className="input input-bordered w-full text-xl"
            value={amount}
            onChange={handleAmountChange}
          />

          {amount > user.balance && (
            <p className="text-red-500 text-sm mt-1">
              Exceeds balance
            </p>
          )}
        </div>

        {/* BUTTONS */}
        <button
          onClick={handleNext}
          disabled={!receiver || checking}
          className="btn w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-black border-none rounded-xl disabled:opacity-80"
        >
          Continue
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-center w-full text-sm opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}