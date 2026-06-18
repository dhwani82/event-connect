import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const submit = async () => {
    setStatus('loading');
    try {
      const res = await userApi.login({ email: form.email, password: form.password });
      const user = res.data;
      localStorage.setItem('ec_user', JSON.stringify(user));
      if (user.role === 'CUSTOMER') navigate('/dashboard/customer');
      else navigate('/dashboard/vendor');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="auth-shell">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-logo"><img src="/logo.png" alt="EventConnect" style={{ height: '44px' }} /></div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to manage your events and bookings.</p>

        <div className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          {status === 'error' && <p className="form-error">Invalid email or password. Please try again.</p>}
          <motion.button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderRadius: '12px', opacity: status === 'loading' ? 0.7 : 1 }}
            onClick={submit} disabled={status === 'loading'} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            {status === 'loading' ? 'Signing in...' : 'Sign In →'}
          </motion.button>
        </div>
        <p className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/signup" className="auth-link">Join free</Link>
        </p>
      </motion.div>

      <style>{`
        .auth-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 5rem 1.5rem; background: var(--bg-soft); }
        .auth-card { background: white; border-radius: 28px; padding: 3rem; width: 100%; max-width: 480px; box-shadow: 0 8px 48px rgba(109,40,217,0.08); border: 1px solid var(--border-soft); }
        .auth-logo { margin-bottom: 1.5rem; }
        .auth-title { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.4rem; }
        .auth-sub { color: var(--gray); margin-bottom: 2rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.76rem; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: 0.07em; font-family: 'Inter', sans-serif; }
        .form-group input { background: var(--surface); border: 1.5px solid var(--gray-light); border-radius: 10px; padding: 0.8rem 1rem; color: var(--ink); font-size: 0.95rem; outline: none; transition: all 0.2s; }
        .form-group input:focus { border-color: var(--violet); box-shadow: 0 0 0 3px var(--violet-pale); }
        .form-group input::placeholder { color: var(--gray); }
        .form-error { color: #dc2626; font-size: 0.85rem; text-align: center; background: #fee2e2; padding: 0.75rem; border-radius: 10px; }
        .auth-footer { text-align: center; color: var(--gray); font-size: 0.875rem; }
        .auth-link { color: var(--violet); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
}