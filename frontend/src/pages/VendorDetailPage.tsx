import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { vendorApi } from '../api/client';
import BookingModal from '../components/BookingModal';

const categoryIcons: Record<string, string> = { CATERING: '🍽️', PHOTOGRAPHY: '📸', DECOR: '🌸', MUSIC: '🎵', OTHER: '✨' };

export default function VendorDetailPage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { if (id) vendorApi.getById(id).then(r => setVendor(r.data)); }, [id]);
  if (!vendor) return <div style={{ padding: '10rem', textAlign: 'center', color: 'var(--gray)' }}>Loading...</div>;

  return (
    <div className="page-shell">
      <Link to="/vendors" style={{ color: 'var(--gray)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '2rem' }}>
        ← Back to vendors
      </Link>
      <div className="detail-layout">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="detail-hero-img">
            <span style={{ fontSize: '5rem' }}>{categoryIcons[vendor.category] || '✨'}</span>
          </div>
          <div className="detail-info-card">
            <div className="info-row"><span>Category</span><span>{vendor.category}</span></div>
            <div className="info-row"><span>Location</span><span>📍 {vendor.city}</span></div>
            <div className="info-row"><span>Status</span>
              <span style={{ color: vendor.available ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                {vendor.available ? '● Available' : '● Booked'}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="eyebrow">{vendor.category}</div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, marginBottom: '1rem' }}>{vendor.businessName}</h1>
          <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1rem' }}>{vendor.description}</p>

          <div className="price-display">
            <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Starting from</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', fontWeight: 900, color: 'var(--violet)' }}>
              ${vendor.pricePerHour}<span style={{ fontSize: '1rem', color: 'var(--gray)' }}>/hr</span>
            </div>
          </div>

          <motion.button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', padding: '1rem', borderRadius: '14px', marginTop: '1.5rem', opacity: vendor.available ? 1 : 0.5 }}
            onClick={() => vendor.available && setModalOpen(true)}
            whileHover={vendor.available ? { scale: 1.02 } : {}}
            whileTap={vendor.available ? { scale: 0.98 } : {}}
          >
            {vendor.available ? '📅 Request Booking' : 'Currently Unavailable'}
          </motion.button>
        </motion.div>
      </div>

      <BookingModal vendor={vendor} isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <style>{`
        .detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .detail-hero-img {
          border-radius: 20px; aspect-ratio: 4/3;
          background: linear-gradient(135deg, var(--violet-pale), #e0d9ff);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
        }
        .detail-info-card { background: var(--surface); border-radius: 14px; overflow: hidden; }
        .info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.85rem 1.25rem; border-bottom: 1px solid var(--border-soft);
          font-size: 0.875rem;
        }
        .info-row:last-child { border-bottom: none; }
        .info-row span:first-child { color: var(--gray); }
        .info-row span:last-child { font-weight: 600; color: var(--ink); }
        .price-display {
          background: var(--surface); border-radius: 16px;
          padding: 1.5rem; border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}
