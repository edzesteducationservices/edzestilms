// src/pages/FirstLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const roleToPath = (role) => {
  switch ((role || '').toLowerCase()) {
    case 'superadmin': return '/superadmin-dashboard';
    case 'admin':      return '/admin-dashboard';
    case 'teacher':    return '/teacher-dashboard';
    default:           return '/student-dashboard';
  }
};

export default function FirstLogin() {
  const nav = useNavigate();
  const { completeNewPassword } = useAuth();
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const username = sessionStorage.getItem('cognitoFirstLoginUsername') || '';

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const session = sessionStorage.getItem('cognitoFirstLoginSession');
      const { user } = await completeNewPassword({
        username, session, newPassword: pwd,
      });
      sessionStorage.removeItem('cognitoFirstLoginSession');
      sessionStorage.removeItem('cognitoFirstLoginUsername');
      nav(roleToPath(user?.role));
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to set new password.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="h4 mb-3 text-center">Set your new password</h2>
              <p className="text-muted text-center mb-4">{username}</p>
              {err && <div className="alert alert-danger py-2">{err}</div>}
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">New password</label>
                  <input
                    type="password" className="form-control"
                    value={pwd} onChange={(e) => setPwd(e.target.value)}
                    required autoComplete="new-password"
                  />
                </div>
                <button className="btn btn-primary w-100">Continue</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
