import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { vendorApi, bookingApi, notificationApi } from '../api/client';

export default function VendorDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const u = localStorage.getItem('ec_user');
    if (!u) { navigate('/login'); return; }
    const parsed = JSON.parse(u);
    if (parsed.role !== 'VENDOR') { navigate('/dashboard/customer'); return; }
    setUser(parsed);
    vendorApi.getAll().then(r => {
      const myProfile = r.data.find((v: any) => v.userId === parsed.id);
      setVendorProfile(myProfile);
      if (myProfile) bookingApi.getAll({ vendorId: myProfile.id }).then(rb => setBookings(rb.data)).catch(() => {});
    }).catch(() => {});
    notificationApi.getByCustomer(parsed.id).then(r => setNotifications(r.data)).catch(() => {});
  }, []);

  const logout = () => { localStorage.removeItem('ec_user'); navigate('/'); };

  if (!user) return null;

  const statusColors: Record<string,any> = {
    PENDING: { bg: '#fef3c7', color: '#d97706' },
    CONFIRMED: { bg: '#dcfce7', color: '#16a34a' },
    CANCELLED: { bg: '#fee2e2', color: '#dc2626' },
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><img src="/logo.png" alt="EventConnect" style={{ height: '40px' }} /></div>
        <nav className="sidebar-nav">
          <div className="nav-section">My Business</div>
          <Link to="/dashboard/vendor" className="sidebar-link active">📊 Overview</Link>
          <Link to="/vendors" className="sidebar-link">👁️ View My Profile</Link>
          <div className="nav-section">Bookings</div>
          <Link to="/dashboard/vendor" className="sidebar-link">📋 Manage Bookings</Link>
          <div className="nav-section">Account</div>
          <Link to="/notifications" className="sidebar-link">🔔 Notifications {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}</Link>
          <button className="sidebar-link logout" onClick={logout}>🚪 Sign Out</button>
        </nav>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Vendor Dashboard 💼</h1>
            <p className="dash-sub">{vendorProfile ? vendorProfile.businessName : 'Loading your profile...'}</p>
          </div>
        </div>

        {vendorProfile && (
          <div className="vendor-profile-card">
            <div className="vpc-icon">{vendorProfile.category === 'CATERING' ? '🍽️' : vendorProfile.category === 'PHOTOGRAPHY' ? '📸' : vendorProfile.category === 'DECOR' ? '🌸' : vendorProfile.category === 'MUSIC' ? '🎵' : '✨'}</div>
            <div className="vpc-info">
              <h3>{vendorProfile.businessName}</h3>
              <p>{vendorProfile.category} · 📍 {vendorProfile.city} · ${vendorProfile.pricePerHour}/hr</p>
            </div>
            <span className="vpc-avail" style={{ background: vendorProfile.available ? '#dcfce7' : '#fee2e2', color: vendorProfile.available ? '#16a34a' : '#dc2626' }}>
              {vendorProfile.available ? '● Available' : '● Unavailable'}
            </span>
          </div>
        )}

        <div className="dash-stats">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: '📋', color: '#7c3aed' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'PENDING').length, icon: '⏳', color: '#d97706' },
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'CONFIRMED').length, icon: '✅', color: '#16a34a' },
          ].map((s, i) => (
            <motion.div key={s.label} className="dash-stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="ds-icon" style={{ background: s.color + '15' }}>{s.icon}</div>
              <div className="ds-num" style={{ color: s.color }}>{s.value}</div>
              <div className="ds-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="dash-section">
          <div className="ds-header"><h2>Booking Requests</h2></div>
          {bookings.length === 0 ? (
            <div className="dash-empty">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
              <p>No booking requests yet. Make sure your profile is visible to customers.</p>
            </div>
          ) : bookings.map(b => {
            const sc = statusColors[b.status] || statusColors.PENDING;
            return (
              <div key={b.id} className="dash-item">
                <div className="di-icon">📋</div>
                <div className="di-info">
                  <div className="di-title">Booking #{b.id.slice(0, 8)}</div>
                  <div className="di-meta">Amount: ${b.totalAmount} · {new Date(b.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="di-status" style={{ background: sc.bg, color: sc.color }}>{b.status}</span>
              </div>
            );
          })}
        </div>
      </main>

      <style>{`
        .dashboard { display: flex; min-height: 100vh; background: var(--bg-soft); }
        .sidebar { width: 240px; background: white; border-right: 1px solid var(--border-soft); padding: 1.5rem; display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .sidebar-logo { margin-bottom: 2rem; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; }
        .nav-section { font-size: 0.68rem; font-weight: 800; color: var(--gray); text-transform: uppercase; letter-spacing: 0.1em; margin: 1rem 0 0.4rem; font-family: 'Inter', sans-serif; }
        .sidebar-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.85rem; border-radius: 10px; color: var(--gray); font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: all 0.2s; background: transparent; border: none; cursor: pointer; width: 100%; text-align: left; }
        .sidebar-link:hover, .sidebar-link.active { background: var(--violet-pale); color: var(--violet); }
        .sidebar-link.logout:hover { background: #fee2e2; color: #dc2626; }
        .notif-badge { background: var(--violet); color: white; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 50px; margin-left: auto; font-weight: 700; }
        .dash-main { flex: 1; padding: 2.5rem 3rem; overflow-y: auto; }
        .dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .dash-title { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.25rem; }
        .dash-sub { color: var(--gray); font-size: 0.95rem; }
        .vendor-profile-card { background: white; border: 1px solid var(--border-soft); border-radius: 16px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; box-shadow: 0 2px 12px rgba(109,40,217,0.04); }
        .vpc-icon { font-size: 2rem; }
        .vpc-info { flex: 1; }
        .vpc-info h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--ink); }
        .vpc-info p { color: var(--gray); font-size: 0.82rem; }
        .vpc-avail { padding: 0.3rem 0.85rem; border-radius: 50px; font-size: 0.72rem; font-weight: 700; font-family: 'Inter', sans-serif; }
        .dash-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .dash-stat { background: white; border: 1px solid var(--border-soft); border-radius: 16px; padding: 1.5rem; text-align: center; box-shadow: 0 2px 12px rgba(109,40,217,0.04); }
        .ds-icon { font-size: 1.75rem; width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; }
        .ds-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; margin-bottom: 0.2rem; }
        .ds-label { color: var(--gray); font-size: 0.8rem; }
        .dash-section { background: white; border: 1px solid var(--border-soft); border-radius: 20px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(109,40,217,0.04); }
        .ds-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
        .ds-header h2 { font-size: 1rem; font-weight: 700; color: var(--ink); }
        .dash-item { display: flex; align-items: center; gap: 0.875rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border-soft); }
        .dash-item:last-child { border-bottom: none; }
        .di-icon { font-size: 1.5rem; }
        .di-info { flex: 1; }
        .di-title { font-size: 0.9rem; font-weight: 600; color: var(--ink); margin-bottom: 0.15rem; }
        .di-meta { font-size: 0.75rem; color: var(--gray); }
        .di-status { font-size: 0.68rem; font-weight: 700; padding: 0.25rem 0.65rem; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Inter', sans-serif; }
        .dash-empty { text-align: center; padding: 1.5rem; color: var(--gray); font-size: 0.875rem; }
      `}</style>
    </div>
  );
}