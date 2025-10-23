import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// map role -> route (unchanged)
const roleToPath = (role) => {
  switch ((role || "").toLowerCase()) {
    case "superadmin":
      return "/superadmin/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    default:
      return "/student/dashboard";
  }
};

export default function Login() {
  const { login, user, ready } = useAuth();  // ✅ added user & ready here
  const [form, setForm] = useState({ email: "", password: "", deviceName: "" });
  const [needsNewPass, setNeedsNewPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);

    try {
      if (!needsNewPass) {
        // Step 1: normal login attempt (temp or permanent password)
        const out = await login({
          email: (form.email || "").trim().toLowerCase(),
          password: form.password || "",
          deviceName: form.deviceName || "",
        });

        if (out?.challenge === "NEW_PASSWORD_REQUIRED") {
          setNeedsNewPass(true); // switch UI to ask for new password
          setErr("Please set a new password to finish first-time sign-in.");
          setLoading(false);
          return;
        }

        navigate(roleToPath(out?.user?.role), { replace: true }); // ✅ replace history
        return;
      }

      // Step 2: completing the new password challenge
      if (!newPassword?.trim()) {
        setErr("Please enter a new password.");
        setLoading(false);
        return;
      }

      const out = await login({
        email: (form.email || "").trim().toLowerCase(),
        password: form.password || "",
        newPassword,
      });

      navigate(roleToPath(out?.user?.role), { replace: true }); // ✅ replace history
    } catch (error) {
      const s = error?.response?.status;
      const ch = error?.response?.data?.challenge;
      if (s === 409 && ch === "NEW_PASSWORD_REQUIRED") {
        setNeedsNewPass(true);
        setErr("Please set a new password to finish first-time sign-in.");
      } else if (s === 403) {
        setErr("Your email is not verified. Please verify first.");
      } else if (s === 401) {
        setErr("Invalid username or password.");
      } else {
        setErr(error?.response?.data?.message || error?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ redirect if already logged in
  useEffect(() => {
    if (ready && user) {
      navigate(roleToPath(user.role), { replace: true });
    }
  }, [ready, user, navigate]);
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="h4 mb-3 text-center">Sign in</h2>
              <p className="text-muted text-center mb-4">
                {needsNewPass
                  ? "Set a new password to finish sign-in."
                  : "Welcome back! Please enter your details."}
              </p>

              {err && (
                <div className="alert alert-danger py-2" role="alert">
                  {err}
                </div>
              )}

              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    disabled={needsNewPass} // lock email once challenge begins
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {needsNewPass ? "Current (temporary) password" : "Password"}
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete={needsNewPass ? "one-time-code" : "current-password"}
                    disabled={needsNewPass} // lock temp password during second step
                  />
                </div>

                {needsNewPass && (
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New password</label>
                    <input
                      id="newPassword"
                      type="password"
                      className="form-control"
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <div className="form-text">At least 8 characters recommended.</div>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="deviceName" className="form-label">
                    Device name <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    id="deviceName"
                    type="text"
                    className="form-control"
                    placeholder="e.g. My Laptop"
                    value={form.deviceName}
                    onChange={(e) => setForm({ ...form, deviceName: e.target.value })}
                    disabled={needsNewPass}
                  />
                  <div className="form-text">Helps you recognize active sessions.</div>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading
                    ? needsNewPass
                      ? "Setting password…"
                      : "Signing in…"
                    : needsNewPass
                      ? "Set password & continue"
                      : "Sign in"}
                </button>
              </form>

              {!needsNewPass && (
                <div className="text-center mt-3">
                  <span className="text-muted">Don’t have an account?</span>{" "}
                  <Link to="/register" className="link-primary">Create one</Link>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-muted mt-3 mb-0 small">
            By signing in you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
