import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.jpg";
import { toast } from 'react-toastify';
import {
  loginUser,
  forgotPassword,
  resetPassword,
} from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(redirect);
        });
      } else {
        navigate(redirect);
      }
    }
  }, [user, guestId, cart, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(forgotPassword(resetEmail));
      if (forgotPassword.fulfilled.match(result)) {
        setResetStep(2);
        toast.success("OTP has been sent to your email");
      }
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetOtp || !newPassword || !confirmPassword) {
      toast.info("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.info("Passwords don't match!");
      return;
    }
    try {
      const result = await dispatch(
        resetPassword({ email: resetEmail, otp: resetOtp, newPassword })
      );
      if (resetPassword.fulfilled.match(result)) {
        toast.success("Password reset successfully!");
        setResetStep(0);
        setResetOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.message || "Password reset failed. Please try again.");
    }
  };

  const formWrapper = "w-full max-w-md bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100";
  const inputClass = "w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm";
  const buttonPrimary = "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg";
  const linkBtn = "mt-4 text-indigo-600 hover:text-indigo-800 transition text-sm font-medium";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        {resetStep === 0 ? (
          <form onSubmit={handleLogin} className={formWrapper}>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
            {error && <div className="text-red-500 mb-4 text-sm p-2 bg-red-50 rounded-md">{error}</div>}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2 text-gray-600">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={inputClass} 
                placeholder="Enter your email"
                required 
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={inputClass} 
                placeholder="Enter your password"
                required 
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Login"}
            </button>
            <button type="button" onClick={() => setResetStep(1)} className={linkBtn}>
              Forgot Password?
            </button>
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link 
                to={`/register?redirect=${encodeURIComponent(redirect)}`} 
                className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
              >
                Create account
              </Link>
            </p>
          </form>
        ) : resetStep === 1 ? (
          <form onSubmit={handleSendOtp} className={formWrapper}>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600">Email</label>
              <input 
                type="email" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)} 
                className={inputClass} 
                placeholder="Enter your email"
                required 
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <button type="button" onClick={() => setResetStep(0)} className={linkBtn}>
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className={formWrapper}>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-600">OTP</label>
              <input 
                type="text" 
                value={resetOtp} 
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))} 
                maxLength={6} 
                className={inputClass} 
                placeholder="Enter 6-digit OTP"
                required 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-600">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className={inputClass} 
                placeholder="Enter new password"
                required 
                minLength={6} 
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className={inputClass} 
                placeholder="Confirm new password"
                required 
                minLength={6} 
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <img src={login} alt="Login" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/70 to-indigo-200/40"></div>
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome</h1>
          <p className="text-lg opacity-90">Sign in to access your personalized dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Login;