// src/pages/InviteAccept.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "./axios";

export default function InviteAccept() {
  const [search] = useSearchParams();
  const token = search.get("token");
  const userId = search.get("u");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      await API.post("/api/admin/invite-accept", { token, userId, password });
      setOk(true);
      setMsg("Invite accepted. You can login now.");
    } catch (e) {
      const m = e?.response?.data?.message || "Failed to accept invite.";
      setOk(false);
      setMsg(m);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !userId) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Invalid invite link.</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="h5 mb-3">Accept your invite</h3>

              {msg && (
                <div className={`alert ${ok ? "alert-success" : "alert-danger"}`}>{msg}</div>
              )}

              {!ok && (
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Set a new password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Choose a strong password"
                    />
                  </div>
                  <button className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Saving…" : "Accept Invite"}
                  </button>
                </form>
              )}

              {ok && (
                <Link to="/login" className="btn btn-primary mt-3">Go to Sign in</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
