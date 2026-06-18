import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../api/client';

export default function SignupCustomerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async () => {
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setStatus('loading'); setError('');
    try {
      const res = await userApi.register({ name: form.name, email: form.email, password: form.password, role: 'CUSTOMER' });
      localStorage.setItem('ec_user', JSON.stringify(res.data));
      setStatus('success');
      setTimeout(() => navigate('/dashboard/customer'), 1500);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed. Email may already be in use.');
      setStatus('error');
    }
  };

  return (
    <div className="auth-shell">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/signup" className="auth-back">← Back</Link>
        <div className="role-badge customer">🎉 Customer Account</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start planning your perfect event today.</p>

        {status === 'success' ? (
          <motion.div className="success-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3>Welcome to EventConnect!</h3>
            <p>Taking you to your dashboard...</p>
          </motion.div>
        ) : (
          <div className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="jane@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            <motion.button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderRadius: '12px', opacity: status === 'loading' ? 0.7 : 1 }}
              onClick={submit} disabled={status === 'loading'}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              {status === 'loading' ? 'Creating account...' : 'Create Customer Account →'}
            </motion.button>
            <p className="auth-footer" style={{ marginTop: '1.5rem' }}>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
          </div>
        )}
      </motion.div>

      <style>{`
        .auth-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 5rem 1.5rem; background: var(--bg-soft); }
        .auth-card { background: white; border-radius: 28px; padding: 3rem; width: 100%; max-width: 560px; box-shadow: 0 8px 48px rgba(109,40,217,0.08); border: 1px solid var(--border-soft); }
        .auth-back { color: var(--gray); font-size: 0.875rem; text-decoration: none; display: inline-block; margin-bottom: 1.5rem; }
        .role-badge { display: inline-block; padding: 0.35rem 1rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; margin-bottom: 1rem; font-family: 'Inter', sans-serif; }
        .role-badge.customer { background: #ede9fe; color: var(--violet); }
        .role-badge.vendor { background: #dcfce7; color: #16a34a; }
        .auth-title { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.4rem; }
        .auth-sub { color: var(--gray); margin-bottom: 2rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.76rem; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: 0.07em; font-family: 'Inter', sans-serif; }
        .form-group input { background: var(--surface); border: 1.5px solid var(--gray-light); border-radius: 10px; padding: 0.8rem 1rem; color: var(--ink); font-size: 0.95rem; outline: none; transition: all 0.2s; }
        .form-group input:focus { border-color: var(--violet); box-shadow: 0 0 0 3px var(--violet-pale); }
        .form-group input::placeholder { color: var(--gray); }
        .form-error { color: #dc2626; font-size: 0.85rem; text-align: center; background: #fee2e2; padding: 0.75rem; border-radius: 10px; }
        .success-box { text-align: center; padding: 2rem 0; }
        .success-box h3 { font-size: 1.4rem; margin-bottom: 0.5rem; color: var(--ink); }
        .success-box p { color: var(--gray); }
        .auth-footer { text-align: center; color: var(--gray); font-size: 0.875rem; }
        .auth-link { color: var(--violet); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
}