import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:5001/api/auth";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,

  signup: async (data) => {
    try {
      set({ isSigningUp: true });

      const res = await axios.post(`${API}/signup`, data, {
        withCredentials: true,
      });

      set({ isSigningUp: false });
      return res.data;
    } catch (err) {
      set({ isSigningUp: false });
      toast.error(err.response?.data?.message || "Signup failed");
      return false;
    }
  },

  // ✅ LOGIN FUNCTION
  login: async (data) => {
  try {
    set({ isLoggingIn: true });

    const res = await axios.post(`${API}/login`, data, {
      withCredentials: true,
    });

    // ✅ STORE USER HERE
    set({ user: res.data.user });

    set({ isLoggingIn: false });
    return res.data;
  } catch (err) {
    set({ isLoggingIn: false });
    toast.error(err.response?.data?.message || "Login failed");
    return false;
  }
},

// LOG OUT
logout: async () => {
  try {
    await axios.post(
      "http://localhost:5001/api/auth/logout",
      {},
      { withCredentials: true }
    );

    set({ user: null });
  } catch (err) {
    console.log(err);
  }
},


  getMe: async () => {
    try {
      const res = await axios.get(`${API}/me`, {
        withCredentials: true,
      });

      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },

  refreshUser: async () => {
  try {
    const res = await axios.get("/api/auth/me", {
      withCredentials: true,
    });
    set({ user: res.data });
  } catch {}
}

}));