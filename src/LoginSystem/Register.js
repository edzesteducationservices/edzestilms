// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Register() {
//   const { register } = useAuth();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [msg, setMsg] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setErr("");
//     setMsg("");
//     setLoading(true);
//     try {
//       await register(form);
//       setMsg("Registered! Check your email to verify.");
//     } catch (e) {
//       setErr("Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-5">
//       <div className="row justify-content-center">
//         <div className="col-sm-10 col-md-8 col-lg-5">
//           <div className="card shadow-sm">
//             <div className="card-body p-4 p-md-5">
//               <h2 className="h4 mb-3 text-center">Create your account</h2>
//               <p className="text-muted text-center mb-4">
//                 Start your learning journey today.
//               </p>

//               {msg && (
//                 <div className="alert alert-success py-2" role="alert">
//                   {msg}
//                 </div>
//               )}
//               {err && (
//                 <div className="alert alert-danger py-2" role="alert">
//                   {err}
//                 </div>
//               )}

//               <form onSubmit={onSubmit} noValidate>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label">
//                     Full name
//                   </label>
//                   <input
//                     id="name"
//                     type="text"
//                     className="form-control"
//                     placeholder="Jane Doe"
//                     value={form.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     required
//                     autoComplete="name"
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="regEmail" className="form-label">
//                     Email
//                   </label>
//                   <input
//                     id="regEmail"
//                     type="email"
//                     className="form-control"
//                     placeholder="you@example.com"
//                     value={form.email}
//                     onChange={(e) =>
//                       setForm({ ...form, email: e.target.value })
//                     }
//                     required
//                     autoComplete="email"
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="regPassword" className="form-label">
//                     Password
//                   </label>
//                   <input
//                     id="regPassword"
//                     type="password"
//                     className="form-control"
//                     placeholder="Create a strong password"
//                     value={form.password}
//                     onChange={(e) =>
//                       setForm({ ...form, password: e.target.value })
//                     }
//                     required
//                     autoComplete="new-password"
//                   />
//                   <div className="form-text">
//                     At least 8 characters recommended.
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100"
//                   disabled={loading}
//                 >
//                   {loading ? "Creating account…" : "Create account"}
//                 </button>
//               </form>

//               <div className="text-center mt-3">
//                 <span className="text-muted">Already have an account?</span>{" "}
//                 <Link to="/login" className="link-primary">
//                   Sign in
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <p className="text-center text-muted mt-3 mb-0 small">
//             We’ll send a verification link to your email.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // ← adjust path if needed
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double submit
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const payload = {
        name: (form.name || "").trim(),
        email: (form.email || "").trim().toLowerCase(),
        password: form.password || "",
      };

      await register(payload);
      setMsg("Registered! Check your email to verify.");
      navigate(`/verify-email?email=${encodeURIComponent(payload.email)}`);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Registration failed. Please try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="h4 mb-3 text-center">Create your account</h2>
              <p className="text-muted text-center mb-4">
                Start your learning journey today.
              </p>

              {msg && (
                <div className="alert alert-success py-2" role="alert">
                  {msg}
                </div>
              )}
              {err && (
                <div className="alert alert-danger py-2" role="alert">
                  {err}
                </div>
              )}

              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="regEmail" className="form-label">
                    Email
                  </label>
                  <input
                    id="regEmail"
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="regPassword" className="form-label">
                    Password
                  </label>
                  <input
                    id="regPassword"
                    type="password"
                    className="form-control"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    autoComplete="new-password"
                  />
                  <div className="form-text">At least 8 characters recommended.</div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">Already have an account?</span>{" "}
                <Link to="/login" className="link-primary">
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-muted mt-3 mb-0 small">
            We’ll send a verification code to your email.
          </p>
        </div>
      </div>
    </div>
  );
}
