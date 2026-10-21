import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import loginImage from "../assets/login.jpg";
import AuthLayout, { PasswordInput } from "../components/Common/AuthLayout";
import { clearError, forgotPassword, loginUser, resetPassword } from "../redux/slices/authSlice";
import useSeo from "../hooks/useSeo";

const Login = () => {
  useSeo({ title: "Sign in", noindex: true });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState(0);
  const [needsVerification, setNeedsVerification] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";

  useEffect(() => {
    if (user) navigate(safeRedirect, { replace: true });
  }, [user, navigate, safeRedirect]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setNeedsVerification(false);
    try {
      const signedIn = await dispatch(loginUser({ email, password })).unwrap();
      toast.success(`Welcome back, ${signedIn.name.split(" ")[0]}!`);
    } catch (err) {
      setNeedsVerification(Boolean(err.needsVerification));
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await dispatch(forgotPassword(resetEmail)).unwrap();
      setResetStep(2);
      toast.success("If that email has an account, a reset code is on its way");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      await dispatch(resetPassword({ email: resetEmail, otp: resetOtp, newPassword })).unwrap();
      toast.success("Password reset. You can sign in now.");
      setEmail(resetEmail);
      setResetStep(0);
      setResetOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const titles = [
    ["Welcome back", "Sign in to track orders and check out faster."],
    ["Reset password", "We'll email you a 6-digit code."],
    ["Choose a new password", `Enter the code sent to ${resetEmail}.`],
  ];

  return (
    <AuthLayout image={loginImage} title={titles[resetStep][0]} subtitle={titles[resetStep][1]}>
      {resetStep === 0 && (
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
              {needsVerification && (
                <Link to={`/register?email=${encodeURIComponent(email)}&verify=1`} className="ml-1 font-semibold underline">
                  Verify now
                </Link>
              )}
            </div>
          )}
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="label">Password</label>
              <button type="button" onClick={() => { setResetEmail(email); setResetStep(1); }} className="mb-1.5 text-xs font-semibold link-underline">
                Forgot password?
              </button>
            </div>
            <PasswordInput id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-center text-sm text-ink-muted">
            New to Nowhere?{" "}
            <Link to={`/register?redirect=${encodeURIComponent(safeRedirect)}`} className="font-semibold text-ink link-underline">
              Create an account
            </Link>
          </p>
          {safeRedirect === "/checkout" && (
            <Link to="/checkout" className="btn-outline w-full">Continue as guest</Link>
          )}
        </form>
      )}

      {resetStep === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label htmlFor="reset-email" className="label">Email</label>
            <input id="reset-email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="input" required />
          </div>
          <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
            {loading ? "Sending..." : "Send reset code"}
          </button>
          <button type="button" onClick={() => setResetStep(0)} className="btn-ghost w-full">Back to sign in</button>
        </form>
      )}

      {resetStep === 2 && (
        <form onSubmit={handlePasswordReset} className="space-y-5">
          <div>
            <label htmlFor="otp" className="label">Reset code</label>
            <input id="otp" inputMode="numeric" autoComplete="one-time-code" value={resetOtp} onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} className="input tracking-[0.5em]" placeholder="000000" required />
          </div>
          <div>
            <label htmlFor="new-password" className="label">New password</label>
            <PasswordInput id="new-password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
          </div>
          <div>
            <label htmlFor="confirm-password" className="label">Confirm password</label>
            <PasswordInput id="confirm-password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} required />
          </div>
          <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </button>
          <button type="button" onClick={() => setResetStep(1)} className="btn-ghost w-full">Resend code</button>
        </form>
      )}
    </AuthLayout>
  );
};

export default Login;
