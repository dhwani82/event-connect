import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { userApi, vendorApi } from '../api/client';

const CATEGORIES = ['CATERING', 'PHOTOGRAPHY', 'DECOR', 'MUSIC', 'OTHER'];
const categoryLabels: Record<string,string> = { CATERING: '🍽️ Catering', PHOTOGRAPHY: '📸 Photography', DECOR: '🌸 Décor', MUSIC: '🎵 Music / DJ', OTHER: '✨ Other' };

export default function SignupVendorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [profile, setProfile] = useState({ businessName: '', category: '', description: '', city: '', pricePerHour: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const submitStep1 = () => {
    if (account.password !== account.confirmPassword) { setError('Passwords do not match'); return; }
    if (account.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setStep(2);
  };

  const submitStep2 = async () => {
    if (!profile.category) { setError('Please select a category'); return; }
    setStatus('loading'); setError('');
    try {
      const userRes = await userApi.register({ name: account.name, email: account.email, password: account.password, role: 'VENDOR' });
      const user = userRes.data;
      await vendorApi.create({ userId: user.id, businessName: profile.businessName, category: profile.category, description: profile.description, city: profile.city, pricePerHour: parseFloat(profile.pricePerHour) });
      localStorage.setItem('ec_user', JSON.stringify(user));
      setStatus('success');
      setTimeout(() => navigate('/dashboard/vendor'), 1500);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed. Email may already be in use.');
      setStatus('error');
    }
  };

  return (
    <div className="auth-shell">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/signup" className="auth-back">← Back</Link>
        <div className="role-badge vendor">💼 Vendor Account</div>

        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line" />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>
        <h1 className="auth-title">{step === 1 ? 'Create your account' : 'Set up your business profile'}</h1>
        <p className="auth-sub">{step === 1 ? 'First, create your login credentials.' : 'Tell customers about your services.'}</p>

        {status === 'success' ? (
          <motion.div className="success-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3>Your vendor profile is live!</h3>
            <p>Taking you to your dashboard...</p>
          </motion.div>
        ) : step === 1 ? (
          <div className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Your name" value={account.name} onChange={e => setAccount({ ...account, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@business.com" value={account.email} onChange={e => setAccount({ ...account, email: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Min. 6 characters" value={account.password} onChange={e => setAccount({ ...account, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Repeat password" value={account.confirmPassword} onChange={e => setAccount({ ...account, confirmPassword: e.target.value })} />
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            <motion.button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderRadius: '12px' }}
              onClick={submitStep1} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              Continue to Business Profile →
            </motion.button>
          </div>
        ) : (
          <div className="auth-form">
            <div className="form-group">
              <label>Business Name</label>
              <input placeholder="e.g. Lumière Photography Studio" value={profile.businessName} onChange={e => setProfile({ ...profile, businessName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Service Category</label>
              <div className="cat-picker">
                {CATEGORIES.map(cat => (
                  <button key={cat} className={`cat-option ${profile.category === cat ? 'selected' : ''}`} onClick={() => setProfile({ ...profile, category: cat })}>
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe your services, style, and what makes you unique..." value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} rows={3} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input placeholder="e.g. New York" value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Starting Price ($/hr)</label>
                <input type="number" placeholder="e.g. 150" value={profile.pricePerHour} onChange={e => setProfile({ ...profile, pricePerHour: e.target.value })} />
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            <motion.button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderRadius: '12px', opacity: status === 'loading' ? 0.7 : 1 }}
              onClick={submitStep2} disabled={status === 'loading'} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              {status === 'loading' ? 'Creating your profile...' : 'Launch My Vendor Profile 🚀'}
            </motion.button>
          </div>
        )}

        <p className="auth-footer" style={{ marginTop: '1.5rem' }}>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
      </motion.div>

      <style>{`
        .auth-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 5rem 1.5rem; background: var(--bg-soft); }
        .auth-card { background: white; border-radius: 28px; padding: 3rem; width: 100%; max-width: 580px; box-shadow: 0 8px 48px rgba(109,40,217,0.08); border: 1px solid var(--border-soft); }
        .auth-back { color: var(--gray); font-size: 0.875rem; text-decoration: none; display: inline-block; margin-bottom: 1.25rem; }
        .role-badge { display: inline-block; padding: 0.35rem 1rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; margin-bottom: 1.25rem; font-family: 'Inter', sans-serif; }
        .role-badge.vendor { background: #dcfce7; color: #16a34a; }
        .step-indicator { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; font-family: 'Inter', sans-serif; background: var(--surface); color: var(--gray); border: 1.5px solid var(--gray-light); transition: all 0.3s; }
        .step-dot.active { background: var(--violet); color: white; border-color: var(--violet); }
        .step-line { flex: 1; height: 1px; background: var(--gray-light); }
        .auth-title { font-size: 1.7rem; font-weight: 900; margin-bottom: 0.4rem; }
        .auth-sub { color: var(--gray); margin-bottom: 2rem; font-size: 0.95rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.76rem; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: 0.07em; font-family: 'Inter', sans-serif; }
        .form-group input, .form-group textarea { background: var(--surface); border: 1.5px solid var(--gray-light); border-radius: 10px; padding: 0.8rem 1rem; color: var(--ink); font-size: 0.95rem; outline: none; transition: all 0.2s; font-family: 'Inter', sans-serif; resize: vertical; }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--violet); box-shadow: 0 0 0 3px var(--violet-pale); }
        .form-group input::placeholder, .form-group textarea::placeholder { color: var(--gray); }
        .cat-picker { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .cat-option { background: var(--surface); border: 1.5px solid var(--gray-light); color: var(--gray); padding: 0.45rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .cat-option:hover { border-color: var(--violet); color: var(--violet); }
        .cat-option.selected { background: var(--violet-pale); border-color: var(--violet); color: var(--violet); }
        .form-error { color: #dc2626; font-size: 0.85rem; text-align: center; background: #fee2e2; padding: 0.75rem; border-radius: 10px; }
        .success-box { text-align: center; padding: 2rem 0; }
        .success-box h3 { font-size: 1.4rem; margin-bottom: 0.5rem; }
        .success-box p { color: var(--gray); }
        .auth-footer { text-align: center; color: var(--gray); font-size: 0.875rem; }
        .auth-link { color: var(--violet); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
}