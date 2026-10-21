import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import registerImage from "../assets/register.jpg";
import AuthLayout, { PasswordInput } from "../components/Common/AuthLayout";
import { clearError, registerUser, resetOtpState, verifyOtp } from "../redux/slices/authSlice";
import api from "../utils/api";
import usePageTitle from "../hooks/usePageTitle";

const RESEND_SECONDS = 30;

const Register = () => {
  usePageTitle("Create account");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [verifyOnly, setVerifyOnly] = useState(params.get("verify") === "1");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, otpSent, error } = useSelector((state) => state.auth);

  const redirect = params.get("redirect") || "/";
  const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
  const showOtpStep = otpSent || verifyOnly;

  useEffect(() => {
    if (user) navigate(safeRedirect, { replace: true });
  }, [user, navigate, safeRedirect]);

  useEffect(() => {
    if (resendTimer <= 0) return undefined;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      toast.success("We've emailed you a 6-digit code");
      setResendTimer(RESEND_SECONDS);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyOtp({ email, otp })).unwrap();
      toast.success("Welcome to Nowhere!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/users/resend-otp", { email });
      toast.success("A new code is on its way");
      setResendTimer(RESEND_SECONDS);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't resend the code");
    }
  };

  const switchEmail = () => {
    dispatch(resetOtpState());
    setVerifyOnly(false);
    setOtp("");
  };

  return (
    <AuthLayout
      image={registerImage}
      title={showOtpStep ? "Verify your email" : "Create an account"}
      subtitle={showOtpStep ? `Enter the 6-digit code we sent to ${email || "your email"}.` : "Track orders, save your address and check out in seconds."}
    >
      {!showOtpStep ? (
        <form onSubmit={handleRegister} className="space-y-5">
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
          </div>
          <div>
            <label htmlFor="reg-email" className="label">Email</label>
            <input id="reg-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
          </div>
          <div>
            <label htmlFor="reg-password" className="label">Password</label>
            <PasswordInput id="reg-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required />
          </div>
          <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
          <p className="text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(safeRedirect)}`} className="font-semibold text-ink link-underline">
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          {verifyOnly && (
            <div>
              <label htmlFor="verify-email" className="label">Email</label>
              <input id="verify-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
            </div>
          )}
          <div>
            <label htmlFor="otp" className="label">Verification code</label>
            <input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="input text-center text-lg tracking-[0.6em]"
              placeholder="000000"
              autoFocus
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3.5" disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify and continue"}
          </button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || !email} className="font-semibold link-underline disabled:no-underline disabled:opacity-50">
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </button>
            <button type="button" onClick={switchEmail} className="text-ink-muted hover:text-ink">
              Use a different email
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default Register;
