import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { eventApi, bookingApi, notificationApi } from '../api/client';

export default function CustomerDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const u = localStorage.getItem('ec_user');
    if (!u) { navigate('/login'); return; }
    const parsed = JSON.parse(u);
    if (parsed.role !== 'CUSTOMER') { navigate('/dashboard/vendor'); return; }
    setUser(parsed);
    eventApi.getAll({ customerId: parsed.id }).then(r => setEvents(r.data)).catch(() => {});
    bookingApi.getAll({ customerId: parsed.id }).then(r => setBookings(r.data)).catch(() => {});
    notificationApi.getByCustomer(parsed.id).then(r => setNotifications(r.data)).catch(() => {});
  }, []);

  const logout = () => { localStorage.removeItem('ec_user'); navigate('/'); };

  if (!user) return null;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><img src="/logo.png" alt="EventConnect" style={{ height: '40px' }} /></div>
        <nav className="sidebar-nav">
          <div className="nav-section">My Events</div>
          <Link to="/dashboard/customer" className="sidebar-link active">📋 Overview</Link>
          <Link to="/events" className="sidebar-link">📅 All Events</Link>
          <Link to="/events/create" className="sidebar-link">✨ Plan New Event</Link>
          <div className="nav-section">Marketplace</div>
          <Link to="/vendors" className="sidebar-link">🔍 Browse Vendors</Link>
          <div className="nav-section">Account</div>
          <Link to="/notifications" className="sidebar-link">🔔 Notifications {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}</Link>
          <button className="sidebar-link logout" onClick={logout}>🚪 Sign Out</button>
        </nav>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Good to see you, {user.name.split(' ')[0]} 👋</h1>
            <p className="dash-sub">Here's what's happening with your events.</p>
          </div>
          <Link to="/events/create" className="btn-primary">+ Plan New Event</Link>
        </div>

        <div className="dash-stats">
          {[
            { label: 'Events Planned', value: events.length, icon: '📅', color: '#7c3aed' },
            { label: 'Active Bookings', value: bookings.length, icon: '📋', color: '#16a34a' },
            { label: 'Notifications', value: notifications.length, icon: '🔔', color: '#d97706' },
          ].map((s, i) => (
            <motion.div key={s.label} className="dash-stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="ds-icon" style={{ background: s.color + '15' }}>{s.icon}</div>
              <div className="ds-num" style={{ color: s.color }}>{s.value}</div>
              <div className="ds-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="dash-grid">
          <div className="dash-section">
            <div className="ds-header">
              <h2>Your Events</h2>
              <Link to="/events" className="ds-see-all">See all →</Link>
            </div>
            {events.length === 0 ? (
              <div className="dash-empty">
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📅</div>
                <p>No events yet. <Link to="/events/create" className="auth-link">Plan your first event</Link></p>
              </div>
            ) : events.slice(0, 3).map(ev => (
              <div key={ev.id} className="dash-item">
                <div className="di-icon">🎉</div>
                <div className="di-info">
                  <div className="di-title">{ev.title}</div>
                  <div className="di-meta">{ev.city} · {new Date(ev.eventDate).toLocaleDateString()} · {ev.guestCount} guests</div>
                </div>
                <span className={`di-status ${ev.status.toLowerCase()}`}>{ev.status}</span>
              </div>
            ))}
          </div>

          <div className="dash-section">
            <div className="ds-header">
              <h2>Recent Notifications</h2>
              <Link to="/notifications" className="ds-see-all">See all →</Link>
            </div>
            {notifications.length === 0 ? (
              <div className="dash-empty">
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
                <p>No notifications yet. Book a vendor to get started.</p>
              </div>
            ) : notifications.slice(0, 4).map(n => (
              <div key={n.id} className="dash-item">
                <div className="notif-dot-sm" style={{ background: n.type === 'BOOKING_CREATED' ? '#16a34a' : '#7c3aed' }} />
                <div className="di-info">
                  <div className="di-title" style={{ fontSize: '0.875rem' }}>{n.message}</div>
                  <div className="di-meta">{new Date(n.sentAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-section" style={{ marginTop: '1.5rem' }}>
          <div className="ds-header">
            <h2>Discover Vendors</h2>
            <Link to="/vendors" className="ds-see-all">Browse all →</Link>
          </div>
          <div className="vendor-quick">
            {['📸 Photographers', '🍽️ Caterers', '🌸 Decorators', '🎵 DJs & Bands', '🏛️ Venues', '🎂 Bakers'].map(cat => (
              <Link key={cat} to="/vendors" className="vq-chip">{cat}</Link>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        .dashboard { display: flex; min-height: 100vh; background: var(--bg-soft); }
        .sidebar { width: 240px; background: white; border-right: 1px solid var(--border-soft); padding: 1.5rem; display: flex; flex-direction: column; gap: 0; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .sidebar-logo { margin-bottom: 2rem; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; }
        .nav-section { font-size: 0.68rem; font-weight: 800; color: var(--gray); text-transform: uppercase; letter-spacing: 0.1em; margin: 1rem 0 0.4rem; font-family: 'Inter', sans-serif; }
        .sidebar-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.85rem; border-radius: 10px; color: var(--gray); font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: all 0.2s; background: transparent; border: none; cursor: pointer; width: 100%; text-align: left; }
        .sidebar-link:hover, .sidebar-link.active { background: var(--violet-pale); color: var(--violet); }
        .sidebar-link.logout:hover { background: #fee2e2; color: #dc2626; }
        .notif-badge { background: var(--violet); color: white; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 50px; margin-left: auto; font-weight: 700; }
        .dash-main { flex: 1; padding: 2.5rem 3rem; overflow-y: auto; }
        .dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .dash-title { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.25rem; }
        .dash-sub { color: var(--gray); font-size: 0.95rem; }
        .dash-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .dash-stat { background: white; border: 1px solid var(--border-soft); border-radius: 16px; padding: 1.5rem; text-align: center; box-shadow: 0 2px 12px rgba(109,40,217,0.04); }
        .ds-icon { font-size: 1.75rem; width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; }
        .ds-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; margin-bottom: 0.2rem; }
        .ds-label { color: var(--gray); font-size: 0.8rem; }
        .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .dash-section { background: white; border: 1px solid var(--border-soft); border-radius: 20px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(109,40,217,0.04); }
        .ds-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
        .ds-header h2 { font-size: 1rem; font-weight: 700; color: var(--ink); }
        .ds-see-all { color: var(--violet); font-size: 0.8rem; font-weight: 600; text-decoration: none; }
        .dash-item { display: flex; align-items: center; gap: 0.875rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border-soft); }
        .dash-item:last-child { border-bottom: none; }
        .di-icon { font-size: 1.5rem; }
        .di-info { flex: 1; }
        .di-title { font-size: 0.9rem; font-weight: 600; color: var(--ink); margin-bottom: 0.15rem; }
        .di-meta { font-size: 0.75rem; color: var(--gray); }
        .di-status { font-size: 0.68rem; font-weight: 700; padding: 0.25rem 0.65rem; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Inter', sans-serif; }
        .di-status.draft { background: #f3f4f6; color: #6b7280; }
        .di-status.published { background: #dcfce7; color: #16a34a; }
        .di-status.cancelled { background: #fee2e2; color: #dc2626; }
        .notif-dot-sm { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .dash-empty { text-align: center; padding: 1.5rem; color: var(--gray); font-size: 0.875rem; }
        .vendor-quick { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .vq-chip { background: var(--surface); border: 1.5px solid var(--border); color: var(--ink-soft); padding: 0.5rem 1.1rem; border-radius: 50px; font-size: 0.82rem; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .vq-chip:hover { border-color: var(--violet); color: var(--violet); background: var(--violet-pale); }
        .auth-link { color: var(--violet); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
}