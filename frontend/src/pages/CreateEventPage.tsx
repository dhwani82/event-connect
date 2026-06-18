import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { eventApi } from '../api/client';

const fields = [
  { key: 'title', label: 'Event Title', placeholder: 'e.g. Sarah & James Wedding Reception', span: 2 },
  { key: 'description', label: 'Description', placeholder: 'Tell vendors what you\'re planning, your vision, and any special requirements...', span: 2 },
  { key: 'city', label: 'City', placeholder: 'e.g. New York', span: 1 },
  { key: 'guestCount', label: 'Guest Count', placeholder: 'e.g. 150', span: 1, type: 'number' },
  { key: 'eventDate', label: 'Event Date', placeholder: '', span: 1, type: 'date' },
  { key: 'customerId', label: 'Your Customer ID', placeholder: 'Your user UUID from registration', span: 1 },
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Record<string,string>>({ title: '', description: '', city: '', guestCount: '', eventDate: '', customerId: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async () => {
    setStatus('loading');
    try {
      await eventApi.create({ ...form, guestCount: parseInt(form.guestCount) });
      setStatus('success');
      setTimeout(() => navigate('/events'), 1800);
    } catch { setStatus('error'); }
  };

  return (
    <div className="page-shell" style={{ maxWidth: '800px' }}>
      <Link to="/events" style={{ color: 'var(--gray)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '2rem' }}>← Back to events</Link>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <div className="eyebrow">New Event</div>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, marginBottom: '0.5rem' }}>Plan your <span className="gradient-text">event</span></h1>
        <p style={{ color: 'var(--gray)', marginBottom: '2.5rem' }}>Fill in the details and start discovering vendors that fit your needs.</p>

        <div className="create-form">
          {fields.map(f => (
            <div key={f.key} className="cf-group" style={{ gridColumn: `span ${f.span}` }}>
              <label className="cf-label">{f.label}</label>
              <input
                className="cf-input"
                type={f.type || 'text'}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {status === 'error' && <p style={{ color: '#dc2626', marginTop: '1rem', textAlign: 'center' }}>Failed to create event. Please check all fields.</p>}
        {status === 'success' && <p style={{ color: '#16a34a', marginTop: '1rem', textAlign: 'center' }}>🎉 Event created! Redirecting...</p>}

        <motion.button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderRadius: '14px', marginTop: '1.5rem', fontSize: '1rem', opacity: status === 'loading' ? 0.7 : 1 }}
          onClick={submit} disabled={status === 'loading'}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
        >
          {status === 'loading' ? 'Creating your event...' : 'Create Event & Browse Vendors →'}
        </motion.button>
      </motion.div>

      <style>{`
        .create-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .cf-group { display: flex; flex-direction: column; gap: 0.45rem; }
        .cf-label { font-size: 0.76rem; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: 0.07em; font-family: 'Inter', sans-serif; }
        .cf-input { background: white; border: 1.5px solid var(--gray-light); border-radius: 12px; padding: 0.85rem 1rem; color: var(--ink); font-size: 0.95rem; outline: none; transition: all 0.2s; font-family: 'Inter', sans-serif; }
        .cf-input:focus { border-color: var(--violet); box-shadow: 0 0 0 3px var(--violet-pale); }
        .cf-input::placeholder { color: var(--gray); }
      `}</style>
    </div>
  );
}
