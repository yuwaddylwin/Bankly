import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const initialState = {
    fullName: "",
    email: "",
    password: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initialState);

  const validateForm = () => {
    if (!formData.fullName.trim())
      return toast.error("Full name required");

    if (!formData.email.trim())
      return toast.error("Email required");

    // ✅ EXACT 10 DIGITS ONLY
    if (!/^\d{10}$/.test(formData.phone))
      return toast.error("Phone number must be exactly 10 digits");

    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm() !== true) return;

    const res = await signup(formData);

    if (res) {
      toast.success("Signup successful! We will get back to you soon. Thank you");

      // ✅ CLEAR FORM AFTER SUCCESS
      setFormData(initialState);

      // optional: reset password visibility
      setShowPassword(false);

      // optional: redirect
      // navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center">
            Create Account
          </h1>

          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* ✅ PHONE (10 DIGITS) */}
          <input
            type="tel"
            placeholder="Phone No."
            maxLength={10} // prevents typing more
            className="input input-bordered"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value.replace(/\D/g, ""), // only numbers
              })
            }
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            className="btn btn-primary mt-4"
            disabled={isSigningUp}
          >
            {isSigningUp ? "Signing..." : "Sign Up"}
          </button>

          <p className="text-center text-sm mt-2">
            Already have an account?
            <span
              className="link link-primary ml-1"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}