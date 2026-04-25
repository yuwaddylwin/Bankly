import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const state = location.state || {};
  console.log("CONFIRM STATE:", state);

  // ✅ Prevent crash if accessed directly or refreshed
  if (!state || !state.sender || !state.receiver || !state.amount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Invalid or expired transaction data
          </p>
          <button
            onClick={() => navigate("/transfer")}
            className="btn btn-primary"
          >
            Back to Transfer
          </button>
        </div>
      </div>
    );
  }

  const { sender, receiver, amount } = state;

  // ✅ Safe mask
  const maskAccount = (acc) => {
    if (!acc) return "-";
    return acc.slice(0, 3) + "-xxxx-xx" + acc.slice(-2);
  };

  // ✅ Confirm transfer
  const handleConfirm = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
  "/api/transfer",
  {
    receiverAcc: receiver.accountNumber,
    amount,
  },
  { withCredentials: true }
);

    const data = res.data;

    navigate("/success", {
      state: {
        sender,
        receiver,
        amount,
        transactionId: data.transactionId, // ✅ REAL
      },
    });
  } catch (err) {
    alert(err.response?.data?.message || "Transfer failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md px-4">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl font-bold mx-auto mb-2">
            {receiver?.fullName?.charAt(0) || "Bankly"}
          </div>
          <h1 className="text-xl font-semibold">Confirm Transaction</h1>
          <p className="text-gray-400 text-sm">Bankly Bank</p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow p-4">

          {/* AMOUNT */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Amount</span>
            <span className="font-semibold text-lg">
              {Number(amount).toLocaleString()} THB
            </span>
          </div>

          <hr className="my-3" />

          {/* FROM */}
          <div className="mb-3">
            <p className="text-gray-400 text-sm mb-1">From</p>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Name</span>
              <span>{sender?.fullName || "-"}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account</span>
              <span>{maskAccount(sender?.accountNumber)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Bank</span>
              <span>Bankly</span>
            </div>
          </div>

          <hr className="my-3" />

          {/* TO */}
          <div className="mb-3">
            <p className="text-gray-400 text-sm mb-1">To</p>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Name</span>
              <span>{receiver?.fullName || "-"}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account</span>
              <span>{maskAccount(receiver?.accountNumber)}</span>
            </div>

            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID</span>
                <span>{state.transactionId || "Processing..."}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Note</span>
              <span>—</span>
            </div>
          </div>

          <hr className="my-3" />

          {/* FEE */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fee</span>
            <span className="text-green-900">0.00 THB</span>
          </div>
        </div>

        {/* BUTTONS */}
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full mt-6 bg-blue-700 text-white py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm"}
        </button>

        <button
          onClick={() => navigate(-1)}
          disabled={loading}
          className="w-full mt-2 text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}