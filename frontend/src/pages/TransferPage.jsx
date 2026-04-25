import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function TransferPage() {
  const navigate = useNavigate();
  const { user, getMe } = useAuthStore();

  const [receiver, setReceiver] = useState(null);
  const [receiverAcc, setReceiverAcc] = useState("AC");
  const [receiverError, setReceiverError] = useState("");
  const [checking, setChecking] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Mask account
  const maskAccount = (acc) => {
    if (!acc) return "";
    return acc.slice(0, 4) + "xxxxx" + acc.slice(-3);
  };

  // ✅ EXACT format
  const validateAccountFormat = (acc) => {
    return /^AC\d{10}$/.test(acc);
  };

  // ✅ Load user
  useEffect(() => {
    const fetchData = async () => {
      await getMe();
      setLoading(false);
    };
    fetchData();
  }, []);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  // ✅ STRICT INPUT CONTROL
  const handleAccountChange = (e) => {
    let value = e.target.value.toUpperCase();

    if (!value.startsWith("AC")) value = "AC";

    const digits = value.slice(2).replace(/\D/g, "").slice(0, 10);

    setReceiverAcc("AC" + digits);
  };

  // ❌ Prevent deleting AC
  const handleKeyDown = (e) => {
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      receiverAcc.length <= 2
    ) {
      e.preventDefault();
    }
  };

  // ✅ CHECK DATABASE
  const fetchReceiver = async (acc) => {
  if (!user) return;

  // reset
  setReceiver(null);
  setReceiverError("");

  // ✅ ONLY CALL API WHEN FULL LENGTH = 12
  if (acc.length !== 12) {
    return;
  }

  // ✅ STRICT FORMAT
  if (!/^AC\d{10}$/.test(acc)) {
    setReceiverError("Invalid account format");
    return;
  }

  try {
    setChecking(true);

    const res = await axios.get(
  "http://localhost:5000/api/user/account/" + acc,
  { withCredentials: true }
);

    const data = res.data;

    // ❌ SELF TRANSFER BLOCK
    if (data.accountNumber === user.accountNumber) {
      setReceiver(null);
      setReceiverError("You cannot transfer to your own account");
      return;
    }

    // ✅ SUCCESS
    setReceiver(data);
    setReceiverError("");

  } catch (err) {
    setReceiver(null);

    if (err.response?.status === 404) {
      setReceiverError("Account does not exist");
    } else {
      setReceiverError("Error checking account");
    }
  } finally {
    setChecking(false);
  }
};

  // ✅ Debounce
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

  // ✅ Amount
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value < 0) return;
    setAmount(value);
  };

  // ✅ Continue
  const handleNext = () => {
  const amt = Number(amount);

  if (!receiver) return alert("Receiver not valid");
  if (!amt || amt <= 0) return alert("Enter valid amount");
  if (amt > user.balance) return alert("Insufficient balance");

  console.log("SENDING DATA:", {
    sender: user,
    receiver,
    amount: amt,
  });
  console.log("Receiver:", receiver);
  console.log("NAVIGATING WITH:", {
  sender: user,
  receiver,
  amount: amt,
});
  navigate("/confirm", {
    state: {
      sender: user,
      receiver: {...receiver}, // 🔥 MUST EXIST
      amount: amt,
    },
  });
};

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!user) return <div className="p-4 text-center">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-4">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Transfer Money
        </h1>

        {/* FROM */}
        <div className="bg-white p-4 rounded-2xl shadow mb-4">
          <p className="text-gray-400 text-sm">From</p>
          <h2 className="font-semibold text-lg">{user.fullName}</h2>
          <p className="text-gray-500 text-sm">
            {maskAccount(user.accountNumber)}
          </p>
          <p className="text-blue-600 font-medium mt-1">
            {(user.balance || 0).toLocaleString()} THB
          </p>
        </div>

        {/* TO */}
        <div className="bg-white p-4 rounded-2xl shadow mb-4">
          <p className="text-gray-400 text-sm mb-1">To</p>

          <input
            type="text"
            value={receiverAcc}
            onChange={handleAccountChange}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full"
          />

          {/* STATUS */}
          {checking && (
            <p className="mt-2 text-blue-500 text-sm">
              Checking account...
            </p>
          )}

          {receiver && !checking && (
            <p className="mt-2 text-green-600 font-medium">
              {receiver.fullName}
            </p>
          )}

          {receiverError && !checking && (
            <p className="mt-2 text-red-500 text-sm">
              {receiverError}
            </p>
          )}
        </div>

        {/* AMOUNT */}
        <div className="bg-white p-4 rounded-2xl shadow mb-4">
          <p className="text-gray-400 text-sm mb-1">Amount</p>

          <input
            type="number"
            placeholder="0.00 THB"
            className="input input-bordered w-full text-xl"
            value={amount}
            onChange={handleAmountChange}
          />

          {amount > user.balance && (
            <p className="text-red-500 text-sm mt-1">
              Exceeds available balance
            </p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!receiver || checking}
          className="btn btn-primary w-full mb-2 rounded-xl disabled:opacity-50"
        >
          Continue
        </button>

        <button
          onClick={() => navigate("/home")}
          className="text-gray-500 w-full text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}