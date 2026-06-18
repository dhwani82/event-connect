import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationApi } from '../api/client';

export default function NotificationsPage() {
  const [customerId, setCustomerId] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetch = async () => {
    if (!customerId.trim()) return;
    setLoading(true);
    try {
      const r = await notificationApi.getByCustomer(customerId);
      setNotifications(r.data);
    } finally { setLoading(false); setSearched(true); }
  };

  return (
    <div className="page-shell" style={{ maxWidth: '760px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="eyebrow">Real-time Updates</div>
        <h1 style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
          Notifications <span className="gradient-text">Hub</span>
        </h1>
        <p style={{ color: 'var(--gray)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Stay updated on your booking requests and vendor responses — powered by Apache Kafka event streaming for real-time delivery.
        </p>
      </motion.div>

      <motion.div className="notif-search-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔔</div>
        <h3 style={{ marginBottom: '0.4rem' }}>Check your notifications</h3>
        <p style={{ color: 'var(--gray)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Enter your customer ID to see booking updates and vendor responses</p>
        <div className="notif-search-row">
          <input
            className="notif-input"
            placeholder="Paste your customer UUID..."
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetch()}
          />
          <motion.button className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', whiteSpace: 'nowrap' }}
            onClick={fetch} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} disabled={loading}>
            {loading ? 'Loading...' : 'Check updates'}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {searched && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="notif-list-header">
              <span>{notifications.length} notification{notifications.length !== 1 ? 's' : ''} found</span>
            </div>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
                <h3 style={{ color: 'var(--ink)', marginBottom: '0.4rem' }}>No notifications yet</h3>
                <p>Make a booking request and check back here for updates.</p>
              </div>
            ) : (
              <div className="notif-list">
                {notifications.map((n, i) => (
                  <motion.div key={n.id} className="notif-item"
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                    <div className="notif-dot" style={{ background: n.type === 'BOOKING_CREATED' ? '#16a34a' : '#7c3aed' }} />
                    <div className="notif-content">
                      <p className="notif-msg">{n.message}</p>
                      <div className="notif-meta">
                        <span className="notif-tag" style={{ background: n.type === 'BOOKING_CREATED' ? '#dcfce7' : '#ede9fe', color: n.type === 'BOOKING_CREATED' ? '#16a34a' : '#7c3aed' }}>
                          {n.type.replace('_', ' ')}
                        </span>
                        <span>{new Date(n.sentAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .notif-search-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 2.5rem; text-align: center; margin-bottom: 2rem; }
        .notif-search-card h3 { font-size: 1.25rem; color: var(--ink); }
        .notif-search-row { display: flex; gap: 0.75rem; }
        .notif-input { flex: 1; background: white; border: 1.5px solid var(--gray-light); border-radius: 10px; padding: 0.75rem 1rem; color: var(--ink); font-size: 0.9rem; outline: none; transition: all 0.2s; }
        .notif-input:focus { border-color: var(--violet); box-shadow: 0 0 0 3px var(--violet-pale); }
        .notif-input::placeholder { color: var(--gray); }
        .notif-list-header { color: var(--gray); font-size: 0.85rem; margin-bottom: 1rem; font-weight: 500; }
        .notif-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .notif-item { background: white; border: 1px solid var(--border-soft); border-radius: 16px; padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start; box-shadow: var(--shadow); }
        .notif-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .notif-content { flex: 1; }
        .notif-msg { font-size: 0.92rem; color: var(--ink); margin-bottom: 0.5rem; line-height: 1.5; }
        .notif-meta { display: flex; align-items: center; gap: 0.75rem; }
        .notif-tag { padding: 0.2rem 0.65rem; border-radius: 50px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Inter', sans-serif; }
        .notif-meta > span:last-child { color: var(--gray); font-size: 0.78rem; }
      `}</style>
    </div>
  );
}
