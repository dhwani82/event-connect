import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { eventApi } from '../api/client';

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  DRAFT: { bg: '#f3f4f6', color: '#6b7280', label: 'Draft' },
  PUBLISHED: { bg: '#dcfce7', color: '#16a34a', label: 'Published' },
  CANCELLED: { bg: '#fee2e2', color: '#dc2626', label: 'Cancelled' },
};

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { eventApi.getAll().then(r => setEvents(r.data)).finally(() => setLoading(false)); }, []);

  return (
    <div className="page-shell">
      <div className="events-top">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="eyebrow">Event Management</div>
          <h1 className="page-h1">Your <span className="gradient-text">Events</span></h1>
          <p style={{ color: 'var(--gray)', marginBottom: 0 }}>Manage all your events and bookings in one place.</p>
        </motion.div>
        <Link to="/events/create" className="btn-primary">+ Plan New Event</Link>
      </div>

      {loading ? (
        <div className="events-grid">{[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '20px' }} />)}</div>
      ) : events.length === 0 ? (
        <motion.div className="empty-events" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
          <h3>No events planned yet</h3>
          <p>Create your first event and start browsing vendors to bring it to life.</p>
          <Link to="/events/create" className="btn-primary" style={{ marginTop: '1.5rem' }}>Plan Your First Event →</Link>
        </motion.div>
      ) : (
        <div className="events-grid">
          {events.map((ev, i) => {
            const sc = statusConfig[ev.status] || statusConfig.DRAFT;
            return (
              <motion.div key={ev.id} className="event-card"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(109,40,217,0.1)' }}
              >
                <div className="ec-top">
                  <span className="ec-status" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                  <span className="ec-date">📅 {new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="ec-title">{ev.title}</h3>
                <p className="ec-desc">{ev.description}</p>
                <div className="ec-meta">
                  <span>📍 {ev.city}</span>
                  <span>👥 {ev.guestCount} guests</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <style>{`
        .events-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; gap: 1rem; flex-wrap: wrap; }
        .page-h1 { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 0.5rem; }
        .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .event-card { background: white; border: 1px solid var(--border-soft); border-radius: 20px; padding: 1.75rem; box-shadow: var(--shadow); transition: all 0.3s; }
        .ec-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .ec-status { padding: 0.3rem 0.85rem; border-radius: 50px; font-size: 0.72rem; font-weight: 700; font-family: 'Inter', sans-serif; }
        .ec-date { color: var(--gray); font-size: 0.82rem; }
        .ec-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--ink); }
        .ec-desc { color: var(--gray); font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.25rem; }
        .ec-meta { display: flex; gap: 1.5rem; color: var(--gray); font-size: 0.82rem; }
        .empty-events { text-align: center; padding: 5rem 2rem; }
        .empty-events h3 { font-size: 1.5rem; color: var(--ink); margin-bottom: 0.5rem; }
        .empty-events p { color: var(--gray); }
        .skeleton { background: var(--surface); animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}
