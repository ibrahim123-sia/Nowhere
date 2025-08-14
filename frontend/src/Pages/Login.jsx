import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.webp";
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
  const [resetStep, setResetStep] = useState(0); // 0 = login, 1 = enter email, 2 = enter OTP

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Redirect logic
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

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(forgotPassword(resetEmail));
      if (forgotPassword.fulfilled.match(result)) {
        setResetStep(2); // Move to OTP entry
        alert("OTP has been sent to your email");
      }
    } catch (err) {
      alert("Failed to send OTP: " + (err.message || "Please try again"));
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!resetOtp || !newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({
          email: resetEmail,
          otp: resetOtp,
          newPassword,
        })
      );

      if (resetPassword.fulfilled.match(result)) {
        alert("Password reset successfully!");
        setResetStep(0); // Return to login
        setResetOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      alert(error.message || "Password reset failed. Please try again.");
    }
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        {resetStep === 0 ? (
          // Login Form
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md bg-white p-8 rounded-lg border shadow-md"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setResetStep(1)}
              className="mt-4 text-blue-500 text-sm"
            >
              Forgot Password?
            </button>
            <p className="mt-6 text-center text-sm">
            Don't have an account? {}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">
              Register
            </Link>
          </p>
          </form>
        ) : resetStep === 1 ? (
          // Email Entry for Password Reset
          <form
            onSubmit={handleSendOtp}
            className="w-full max-w-md bg-white p-8 rounded-lg border shadow-md"
          >
            <h2 className="text-2xl font-bold text-center mb-6">
              Reset Password
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <button
              type="button"
              onClick={() => setResetStep(0)}
              className="mt-4 text-blue-500 text-sm"
            >
              Back to Login
            </button>
          </form>
        ) : (
          // OTP and New Password Entry
          <form
            onSubmit={handlePasswordReset}
            className="w-full max-w-md bg-white p-8 rounded-lg border shadow-md"
          >
            <h2 className="text-2xl font-bold text-center mb-6">
              Reset Password
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">OTP</label>
              <input
                type="text"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
                minLength={6}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <img
          src={login}
          alt="Login"
          className="h-[750px] w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
