import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 60], ['0 0 0 rgba(0,0,0,0)', '0 2px 24px rgba(109,40,217,0.08)']);
  const bg = useTransform(scrollY, [0, 60], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.97)']);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/vendors', label: 'Browse Vendors' },
    { to: '/events', label: 'My Events' },
    { to: '/notifications', label: 'Notifications' },
  ];

  return (
    <motion.nav style={{ background: bg, boxShadow: shadow }} className="navbar">
      <Link to="/" className="nav-logo">
        <img src="/logo.png" alt="EventConnect" className="logo-img" />
      </Link>
      <div className="nav-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}>
            {l.label}
            {location.pathname === l.to && <motion.div className="nav-dot" layoutId="dot" />}
          </Link>
        ))}
      </div>
      <div className="nav-actions">
        <Link to="/login" className="btn-outline" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>Sign In</Link>
        <Link to="/signup" className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>Join Free</Link>
      </div>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5rem; height: 68px;
          backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s;
        }
        .logo-img { height: 52px; width: auto; object-fit: contain; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-link {
          color: var(--gray); font-size: 0.9rem; font-weight: 500;
          position: relative; padding: 0.3rem 0;
          transition: color 0.2s; display: flex; flex-direction: column; align-items: center;
        }
        .nav-link:hover, .nav-link.active { color: var(--ink); }
        .nav-dot {
          position: absolute; bottom: -6px;
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--violet);
        }
        .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
      `}</style>
    </motion.nav>
  );
}
