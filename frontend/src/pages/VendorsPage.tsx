import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { vendorApi } from '../api/client';
import VendorCard from '../components/VendorCard';

const CATEGORIES = ['ALL', 'CATERING', 'PHOTOGRAPHY', 'DECOR', 'MUSIC', 'OTHER'];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [city, setCity] = useState('');

  useEffect(() => {
    setLoading(true);
    vendorApi.getAll(category !== 'ALL' ? { category } : {})
      .then(r => setVendors(r.data))
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = city ? vendors.filter(v => v.city.toLowerCase().includes(city.toLowerCase())) : vendors;

  return (
    <div className="page-shell">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <div className="eyebrow">Vendor Marketplace</div>
        <h1 className="page-h1">Find the right vendor<br /><span className="gradient-text">for your event</span></h1>
        <p className="page-sub">Browse photographers, caterers, decorators, venues, DJs, and more — all verified and ready to book.</p>
      </motion.div>

      <motion.div className="filters-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="cat-tabs">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`cat-tab ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
              {cat === 'ALL' ? 'All Vendors' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <input className="city-search" placeholder="🔍 Filter by city..." value={city} onChange={e => setCity(e.target.value)} />
      </motion.div>

      {loading ? (
        <div className="vendor-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '20px' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No vendors found</h3>
          <p>Try a different category or city</p>
        </div>
      ) : (
        <div className="vendor-grid">
          {filtered.map((v, i) => <VendorCard key={v.id} vendor={v} index={i} />)}
        </div>
      )}

      <style>{`
        .page-h1 { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; line-height: 1.1; margin-bottom: 0.75rem; }
        .page-sub { color: var(--gray); font-size: 1.05rem; margin-bottom: 2.5rem; max-width: 600px; line-height: 1.7; }
        .filters-bar { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
        .cat-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .cat-tab {
          background: white; border: 1.5px solid var(--gray-light);
          color: var(--gray); padding: 0.5rem 1.25rem; border-radius: 50px;
          font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .cat-tab:hover { border-color: var(--violet); color: var(--violet); }
        .cat-tab.active { background: var(--violet); border-color: var(--violet); color: white; }
        .city-search {
          background: white; border: 1.5px solid var(--gray-light);
          color: var(--ink); padding: 0.5rem 1.25rem; border-radius: 50px;
          font-size: 0.875rem; outline: none; min-width: 200px; transition: all 0.2s;
        }
        .city-search:focus { border-color: var(--violet); box-shadow: 0 0 0 3px var(--violet-pale); }
        .city-search::placeholder { color: var(--gray); }
        .vendor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .skeleton { background: var(--surface); animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .empty { text-align: center; padding: 5rem; color: var(--gray); }
        .empty h3 { font-size: 1.4rem; color: var(--ink); margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
