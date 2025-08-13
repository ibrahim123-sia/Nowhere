import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import registerImg from "../assets/register.webp";
import { registerUser, verifyOtp, resetOtpState } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, otpSent, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // Resend OTP timer
  useEffect(() => {
    let timer;
    if (resendDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
      setResendTimer(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, resendTimer]);

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect]);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
    setResendDisabled(true);
  };

  const handleVerifyOtp = (e) => {
  e.preventDefault();
  console.log("Verifying OTP with:", { email, otp }); // Add this line
  dispatch(verifyOtp({ email, otp }));
};

  const handleResendOtp = () => {
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        setResendDisabled(true);
        setResendTimer(30);
      });
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        {!otpSent ? (
          <form
            onSubmit={handleRegister}
            className="w-full max-w-md bg-white p-8 rounded-lg border shadow-md"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            {error && (
              <div className="mb-4 text-red-500 text-center text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your password"
                minLength="6"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            className="w-full max-w-md bg-white p-8 rounded-lg border shadow-md"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
            {error && (
              <div className="mb-4 text-red-500 text-center text-sm">
                {error}
              </div>
            )}
            <p className="mb-4 text-center text-sm">
              OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                  setOtp(value);
                }
              }}
              maxLength={6}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter 6-digit OTP"
              autoFocus
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className={`text-sm ${resendDisabled ? 'text-gray-400' : 'text-blue-500 hover:underline'}`}
              >
                {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => dispatch(resetOtpState())}
              className="mt-2 text-sm text-gray-500 hover:underline w-full text-center"
            >
              Back to Registration
            </button>
          </form>
        )}
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <img
          src={registerImg}
          alt="Register"
          className="h-[750px] w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;