import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.email.trim())
      return toast.error("Email required");

    if (!formData.password)
      return toast.error("Password required");

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm() !== true) return;

  const res = await login(formData);

  if (res) {
    const userData = res.user || res; // handles both cases

    localStorage.setItem("userId", userData._id);
    localStorage.setItem("user", JSON.stringify(userData));
    toast.success("Welcome back 👋");
    navigate("/"); 
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center">Login</h1>

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
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
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm mt-2">
            Don’t have an account?
            <span
              className="link link-primary ml-1"
              onClick={() => navigate("/signup")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}