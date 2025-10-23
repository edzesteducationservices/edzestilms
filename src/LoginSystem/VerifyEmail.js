// import React, { useEffect, useState } from "react";
// import { useSearchParams, Link } from "react-router-dom";
// import API from "../../api/axios";

// export default function VerifyEmail() {
//   const [search] = useSearchParams();
//   const token = search.get("token");
//   const u = search.get("u"); // ✅ backend expects "u"
//   const [state, setState] = useState({ done: false, ok: false, msg: "" });

//   useEffect(() => {
//     (async () => {
//       try {
//         if (!token || !u) {
//           setState({ done: true, ok: false, msg: "Missing or invalid link." });
//           return;
//         }

//         // ✅ send { token, u } to backend
//         await API.post("/api/auth/verify-email", { token, u });

//         setState({ done: true, ok: true, msg: "Email verified successfully!" });
//       } catch (e) {
//         const msg =
//           e?.response?.data?.message ||
//           "Verification failed. The link may be expired or already used.";
//         setState({ done: true, ok: false, msg });
//       }
//     })();
//   }, [token, u]);

//   return (
//     <div className="container py-5">
//       <div className="row justify-content-center">
//         <div className="col-sm-10 col-md-8 col-lg-6">
//           <div className="card shadow-sm">
//             <div className="card-body p-4">
//               <h3 className="h5 mb-3">Email verification</h3>

//               {!state.done && (
//                 <div className="alert alert-info">Verifying your email…</div>
//               )}

//               {state.done && state.ok && (
//                 <>
//                   <div className="alert alert-success">{state.msg}</div>
//                   <Link to="/login" className="btn btn-primary">
//                     Continue to sign in
//                   </Link>
//                 </>
//               )}

//               {state.done && !state.ok && (
//                 <>
//                   <div className="alert alert-danger">{state.msg}</div>
//                   <Link to="/" className="btn btn-outline-secondary">
//                     Go home
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//           <p className="text-muted small text-center mt-3">
//             If you still can’t verify, request a new verification email.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }





// src/pages/VerifyEmail.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";  // <-- add useNavigate
import API from "./axios";
import { useAuth } from "./context/AuthContext";

export default function VerifyEmail() {
  const { verifyEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();                                   // <-- here

  useEffect(() => {
    const e = searchParams.get("email");
    if (e) setEmail(e);
  }, [searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMsg(""); setErr(""); setLoading(true);
    try {
      await verifyEmail({ email: email.trim().toLowerCase(), code: code.trim() });
      setMsg("Email verified! You can now sign in.");
      // redirect after a short pause (or immediately if you prefer)
      setTimeout(() => {
        // pass email so the login page can prefill it
        navigate(`/login?email=${encodeURIComponent(email)}`);
      }, 800);
    } catch (e) {
      const m = e?.response?.data?.message || e?.message || "Verification failed.";
      setErr(m);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resending) return;
    setMsg(""); setErr(""); setResending(true);
    try {
      await API.post("/api/auth/resend-verify", { email: email.trim().toLowerCase() });
      setMsg("Verification code resent. Check your inbox.");
    } catch (e) {
      const m = e?.response?.data?.message || e?.message || "Could not resend code.";
      setErr(m);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="h4 mb-3 text-center">Verify your email</h2>
              <p className="text-muted text-center mb-4">
                Enter the 6-digit code we sent to your email.
              </p>

              {msg && <div className="alert alert-success py-2">{msg}</div>}
              {err && <div className="alert alert-danger py-2">{err}</div>}

              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="vEmail">Email</label>
                  <input
                    id="vEmail"
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="vCode">Verification code</label>
                  <input
                    id="vCode"
                    type="text"
                    className="form-control"
                    placeholder="6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Verifying…" : "Verify email"}
                </button>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={resend}
                  disabled={resending || !email}
                >
                  {resending ? "Resending…" : "Resend code"}
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-muted mt-3 mb-0 small">
            Didn’t get it? Check spam/promotions folders.
          </p>
        </div>
      </div>
    </div>
  );
}
