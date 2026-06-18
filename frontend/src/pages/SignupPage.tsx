import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/" className="auth-back">← Back to home</Link>
        <div className="auth-logo">
          <img src="/logo.png" alt="EventConnect" style={{ height: '48px' }} />
        </div>
        <h1 className="auth-title">Join EventConnect</h1>
        <p className="auth-sub">Are you planning an event, or offering services as a vendor?</p>

        <div className="role-cards">
          <motion.button
            className="role-card"
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(109,40,217,0.14)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/signup/customer')}
          >
            <div className="role-icon">🎉</div>
            <div className="role-info">
              <h3>I'm planning an event</h3>
              <p>Create events, browse vendors, send booking requests, and manage everything in one place.</p>
              <ul className="role-perks">
                <li>✓ Create and manage events</li>
                <li>✓ Browse 500+ verified vendors</li>
                <li>✓ Compare prices and portfolios</li>
                <li>✓ Track all your bookings</li>
              </ul>
            </div>
            <span className="role-arrow">→</span>
          </motion.button>

          <motion.button
            className="role-card"
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(109,40,217,0.14)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/signup/vendor')}
          >
            <div className="role-icon">💼</div>
            <div className="role-info">
              <h3>I offer event services</h3>
              <p>Create a business profile, showcase your work, receive inquiries, and manage your bookings.</p>
              <ul className="role-perks">
                <li>✓ Build a professional profile</li>
                <li>✓ Showcase services & portfolio</li>
                <li>✓ Receive customer inquiries</li>
                <li>✓ Manage your availability</li>
              </ul>
            </div>
            <span className="role-arrow">→</span>
          </motion.button>
        </div>

        <p className="auth-footer">Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
      </motion.div>

      <style>{`
        .auth-shell {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 5rem 1.5rem; background: var(--bg-soft);
        }
        .auth-card {
          background: white; border-radius: 28px; padding: 3rem;
          width: 100%; max-width: 720px;
          box-shadow: 0 8px 48px rgba(109,40,217,0.08);
          border: 1px solid var(--border-soft);
        }
        .auth-back { color: var(--gray); font-size: 0.875rem; text-decoration: none; display: inline-block; margin-bottom: 2rem; }
        .auth-back:hover { color: var(--ink); }
        .auth-logo { margin-bottom: 1.5rem; }
        .auth-title { font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem; }
        .auth-sub { color: var(--gray); margin-bottom: 2rem; font-size: 1rem; line-height: 1.6; }
        .role-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .role-card {
          background: white; border: 1.5px solid var(--gray-light);
          border-radius: 20px; padding: 1.75rem; text-align: left;
          cursor: pointer; transition: all 0.3s; position: relative;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .role-card:hover { border-color: var(--violet); }
        .role-icon { font-size: 2.5rem; }
        .role-info h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--ink); }
        .role-info p { color: var(--gray); font-size: 0.85rem; line-height: 1.6; margin-bottom: 1rem; }
        .role-perks { list-style: none; display: flex; flex-direction: column; gap: 0.3rem; }
        .role-perks li { color: var(--violet); font-size: 0.8rem; font-weight: 500; }
        .role-arrow { position: absolute; top: 1.5rem; right: 1.5rem; color: var(--violet); font-size: 1.2rem; }
        .auth-footer { text-align: center; color: var(--gray); font-size: 0.875rem; }
        .auth-link { color: var(--violet); font-weight: 600; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}