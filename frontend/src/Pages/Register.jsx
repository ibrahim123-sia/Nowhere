import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import registerImg from "../assets/register.jpg";
import { registerUser, verifyOtp, resetOtpState } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

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

  // Styling constants - updated to match the login theme
  const formWrapper = "w-full max-w-md bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100";
  const inputClass = "w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm";
  const buttonPrimary = "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg";
  const linkBtn = "text-indigo-600 hover:text-indigo-800 transition text-sm font-medium";

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
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // useEffect(() => {
  //   if (user) {
  //     if (cart?.products.length > 0 && guestId) {
  //       dispatch(mergeCart({ guestId, user })).then(() => {
  //         toast.success("Account created successfully!");
  //         navigate(isCheckoutRedirect ? "/checkout" : "/");
  //       });
  //     } else {
  //       toast.success("Account created successfully!");
  //       navigate(isCheckoutRedirect ? "/checkout" : "/");
  //     }
  //   }
  // }, [user, guestId, cart, navigate, isCheckoutRedirect]);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        toast.success("OTP sent to your email!");
        setResendDisabled(true);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to send OTP");
      });
  };

  const handleVerifyOtp = async (e) => {
  e.preventDefault();
  try {
    // 1. Verify OTP and get token
    const user = await dispatch(verifyOtp({ email, otp })).unwrap();
    
    // 2. Wait a moment for token to be stored
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 3. Check if token is available
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error("Authentication failed. Please try again.");
      return;
    }
    
    // 4. Merge cart if needed
   // In handleVerifyOtp function, change this:
if (cart?.products.length > 0 && guestId) {
  await dispatch(mergeCart({ guestId })).unwrap(); // Remove userId
}
    
    // 5. Show success and redirect
    toast.success("Account created successfully!");
    navigate(isCheckoutRedirect ? "/checkout" : "/");
    
  } catch (error) {
    toast.error(error.message || "OTP verification failed");
  }
};

  const handleResendOtp = () => {
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        toast.success("New OTP sent to your email!");
        setResendDisabled(true);
        setResendTimer(30);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to resend OTP");
      });
  };

  const handleResetOtpState = () => {
    dispatch(resetOtpState());
    toast.info("You can now register again");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        {!otpSent ? (
          <form onSubmit={handleRegister} className={formWrapper}>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2 text-gray-600">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Enter your full name"
                required
              />
            </div>
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
                placeholder="Create a password (min 6 characters)"
                minLength="6"
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
              ) : "Sign Up"}
            </button>
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to={`/login?redirect=${encodeURIComponent(redirect)}`}
                className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className={formWrapper}>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Verify Email</h2>
            <p className="mb-5 text-center text-sm text-gray-500">
              We sent a 6-digit code to <span className="font-medium text-indigo-600">{email}</span>
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600">Verification Code</label>
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
                className={inputClass}
                placeholder="Enter 6-digit code"
                autoFocus
                required
              />
            </div>
            <button type="submit" className={buttonPrimary} disabled={loading}>
              {loading ? "Verifying..." : "Verify Account"}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className={`text-sm ${resendDisabled ? "text-gray-400" : "text-indigo-600 hover:underline font-medium"}`}
              >
                {resendDisabled ? `Resend code in ${resendTimer}s` : "Resend verification code"}
              </button>
            </div>
            <button
              type="button"
              onClick={handleResetOtpState}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 hover:underline w-full text-center"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <img
          src={registerImg}
          alt="Register"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/70 to-indigo-200/40"></div>
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-bold mb-2">Join Us</h1>
          <p className="text-lg opacity-90">Create an account to unlock exclusive features</p>
        </div>
      </div>
    </div>
  );
};

export default Register;