import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { bookingApi } from '../api/client';

export default function BookingModal({ vendor, isOpen, onClose }: { vendor: any; isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ eventId: '', customerId: '', totalAmount: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    setStatus('loading');
    try {
      await bookingApi.create({ eventId: form.eventId, vendorId: vendor.id, customerId: form.customerId, totalAmount: parseFloat(form.totalAmount) });
      setStatus('success');
      setTimeout(() => { setStatus('idle'); onClose(); }, 2500);
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="modal-box" initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }} transition={{ type: 'spring', damping: 28 }}>
            <button className="modal-x" onClick={onClose}>✕</button>
            {status === 'success' ? (
              <motion.div className="modal-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <h3>Booking Requested!</h3>
                <p>You'll receive a notification once the vendor confirms. Check your notifications tab for updates.</p>
              </motion.div>
            ) : (
              <>
                <div className="modal-head">
                  <div className="modal-head-icon">📅</div>
                  <h3>Request a Booking</h3>
                  <p>{vendor?.businessName} · {vendor?.city} · ${vendor?.pricePerHour}/hr</p>
                </div>
                <div className="modal-fields">
                  {[
                    { key: 'eventId', label: 'Event ID', placeholder: 'Your event UUID' },
                    { key: 'customerId', label: 'Your Customer ID', placeholder: 'Your user UUID' },
                    { key: 'totalAmount', label: 'Budget / Total Amount ($)', placeholder: '500', type: 'number' },
                  ].map(f => (
                    <div key={f.key} className="mfield">
                      <label>{f.label}</label>
                      <input type={f.type || 'text'} placeholder={f.placeholder}
                        value={(form as any)[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      />
                    </div>
                  ))}
                  {status === 'error' && <p style={{ color: '#dc2626', fontSize: '0.85rem', textAlign: 'center' }}>Something went wrong. Check your IDs and try again.</p>}
                  <motion.button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', borderRadius: '12px', opacity: status === 'loading' ? 0.7 : 1 }}
                    onClick={handleSubmit} disabled={status === 'loading'}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    {status === 'loading' ? 'Sending request...' : 'Send Booking Request →'}
                  </motion.button>
                </div>
              </>
            )}
            <style>{`
              .modal-bg { position: fixed; inset: 0; background: rgba(15,10,30,0.5); backdrop-filter: blur(6px); z-index: 200; }
              .modal-box { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 201; width: 90%; max-width: 460px; background: white; border-radius: 24px; padding: 2.5rem; box-shadow: 0 24px 80px rgba(0,0,0,0.16); }
              .modal-x { position: absolute; top: 1.25rem; right: 1.25rem; background: var(--surface); border: none; color: var(--gray); width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 0.8rem; transition: all 0.2s; }
              .modal-x:hover { background: var(--gray-light); }
              .modal-head { text-align: center; margin-bottom: 2rem; }
              .modal-head-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
              .modal-head h3 { font-size: 1.4rem; margin-bottom: 0.3rem; color: var(--ink); }
              .modal-head p { color: var(--gray); font-size: 0.875rem; }
              .modal-fields { display: flex; flex-direction: column; gap: 1rem; }
              .mfield { display: flex; flex-direction: column; gap: 0.4rem; }
              .mfield label { font-size: 0.76rem; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Inter', sans-serif; }
              .mfield input { background: var(--surface); border: 1.5px solid var(--gray-light); border-radius: 10px; padding: 0.8rem 1rem; color: var(--ink); font-size: 0.95rem; outline: none; transition: all 0.2s; }
              .mfield input:focus { border-color: var(--violet); box-shadow: 0 0 0 3px var(--violet-pale); }
              .mfield input::placeholder { color: var(--gray); }
              .modal-success { text-align: center; padding: 1.5rem 0; }
              .modal-success h3 { font-size: 1.5rem; margin-bottom: 0.75rem; color: var(--ink); }
              .modal-success p { color: var(--gray); line-height: 1.6; font-size: 0.9rem; }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
