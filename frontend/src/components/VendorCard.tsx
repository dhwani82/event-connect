import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categoryIcons: Record<string, string> = {
  CATERING: '🍽️', PHOTOGRAPHY: '📸', DECOR: '🌸', MUSIC: '🎵', OTHER: '✨'
};
const categoryColors: Record<string, string> = {
  CATERING: '#d97706', PHOTOGRAPHY: '#7c3aed', DECOR: '#db2777', MUSIC: '#0891b2', OTHER: '#6b7280'
};

export default function VendorCard({ vendor, index }: { vendor: any; index: number }) {
  const color = categoryColors[vendor.category] || '#7c3aed';
  const bg = color + '12';

  return (
    <motion.div
      className="vcard"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(109,40,217,0.12)' }}
    >
      <div className="vcard-header" style={{ background: bg }}>
        <span className="vcard-icon">{categoryIcons[vendor.category] || '✨'}</span>
        <span className="vcard-avail" style={{ background: vendor.available ? '#dcfce7' : '#fee2e2', color: vendor.available ? '#16a34a' : '#dc2626' }}>
          {vendor.available ? '● Available' : '● Booked'}
        </span>
      </div>
      <div className="vcard-body">
        <div className="vcard-cat" style={{ color }}>{vendor.category}</div>
        <h3 className="vcard-name">{vendor.businessName}</h3>
        <p className="vcard-desc">{vendor.description?.slice(0, 90)}...</p>
        <div className="vcard-meta">
          <span>📍 {vendor.city}</span>
          <span style={{ color, fontWeight: 700 }}>${vendor.pricePerHour}/hr</span>
        </div>
        <Link to={`/vendors/${vendor.id}`} className="vcard-btn" style={{ borderColor: color + '40', color }}>
          View & Book <span>→</span>
        </Link>
      </div>
      <style>{`
        .vcard {
          background: white; border: 1px solid var(--border-soft);
          border-radius: 20px; overflow: hidden;
          box-shadow: var(--shadow); transition: all 0.3s;
        }
        .vcard-header { height: 110px; display: flex; align-items: center; justify-content: center; position: relative; }
        .vcard-icon { font-size: 3rem; }
        .vcard-avail {
          position: absolute; top: 0.75rem; right: 0.75rem;
          padding: 0.25rem 0.75rem; border-radius: 50px;
          font-size: 0.7rem; font-weight: 700;
        }
        .vcard-body { padding: 1.25rem 1.5rem 1.5rem; }
        .vcard-cat { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.35rem; font-family: 'Inter', sans-serif; }
        .vcard-name { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--ink); }
        .vcard-desc { color: var(--gray); font-size: 0.83rem; line-height: 1.55; margin-bottom: 1rem; }
        .vcard-meta { display: flex; justify-content: space-between; font-size: 0.83rem; color: var(--gray); margin-bottom: 1.1rem; }
        .vcard-btn {
          display: block; text-align: center; padding: 0.65rem;
          border: 1.5px solid; border-radius: 10px;
          font-weight: 600; font-size: 0.875rem; transition: all 0.2s;
          background: transparent;
        }
        .vcard-btn:hover { background: var(--violet-pale); }
      `}</style>
    </motion.div>
  );
}
