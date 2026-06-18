import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const vendorTypes = [
  { icon: '📸', label: 'Photographers', count: '120+' },
  { icon: '🍽️', label: 'Caterers', count: '85+' },
  { icon: '🌸', label: 'Decorators', count: '96+' },
  { icon: '🎵', label: 'DJs & Bands', count: '74+' },
  { icon: '🏛️', label: 'Venues', count: '60+' },
  { icon: '🎂', label: 'Bakers', count: '48+' },
];

const steps = [
  { num: '01', icon: '✨', title: 'Create your event', desc: 'Tell us what you\'re planning — wedding, corporate event, birthday, or anything in between. Set your date, guest count, and city.' },
  { num: '02', icon: '🔍', title: 'Browse & compare vendors', desc: 'Explore hundreds of verified vendors filtered by category, city, price, and availability. View portfolios and compare options side by side.' },
  { num: '03', icon: '📩', title: 'Send booking requests', desc: 'Send inquiries directly to vendors through the platform. No more juggling emails or calls — everything is in one place.' },
  { num: '04', icon: '🎉', title: 'Track & manage everything', desc: 'Monitor all your bookings, get real-time notifications, and manage your full event from a single dashboard.' },
];

const testimonials = [
  { name: 'Priya S.', event: 'Wedding · 200 guests', quote: 'Found our photographer, caterer, and decorator all in one afternoon. Saved us weeks of back-and-forth.' },
  { name: 'Marcus T.', event: 'Corporate Event · 500 guests', quote: 'The booking management made coordinating 8 different vendors feel effortless.' },
  { name: 'Aisha R.', event: 'Birthday Party · 80 guests', quote: 'The AI recommendations were spot-on for our budget. Couldn\'t have done it without EventConnect.' },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="hero">
        <div className="hero-bg-orb orb1" />
        <div className="hero-bg-orb orb2" />
        <motion.div className="hero-content" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            The All-in-One Event Planning Platform
          </motion.div>
          <motion.h1 className="hero-h1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            Plan Your Event.<br /><span className="gradient-text">Find Every Vendor.</span><br />All in One Place.
          </motion.h1>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            Stop juggling spreadsheets and endless emails. EventConnect brings photographers, caterers, decorators, venues, and more together — so you can plan your perfect event without the chaos.
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <Link to="/events/create" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Start Planning Free →
            </Link>
            <Link to="/vendors" className="btn-outline" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Browse Vendors
            </Link>
          </motion.div>
          <motion.div className="hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <span>✓ Free to join</span>
            <span>✓ 500+ verified vendors</span>
            <span>✓ Real-time notifications</span>
          </motion.div>
        </motion.div>

        {/* Floating vendor type cards */}
        <motion.div
          className="hero-cards"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {vendorTypes.map((v, i) => (
            <motion.div
              key={v.label}
              className="hero-vendor-chip"
              animate={{ y: [0, i % 2 === 0 ? -8 : -12, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(109,40,217,0.2)' }}
            >
              <span className="chip-icon">{v.icon}</span>
              <div>
                <div className="chip-label">{v.label}</div>
                <div className="chip-count">{v.count} vendors</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        {[
          { num: '2,400+', label: 'Events Planned' },
          { num: '500+', label: 'Verified Vendors' },
          { num: '50+', label: 'Cities Covered' },
          { num: '98%', label: 'Customer Satisfaction' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-section">
        <div className="section-inner">
          <motion.div className="section-head" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="eyebrow">How it works</div>
            <h2>From idea to <span className="gradient-text">perfect event</span><br />in four steps</h2>
            <p className="section-sub">Everything you need to plan, book, and manage your event — without leaving the platform.</p>
          </motion.div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="step-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
              >
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VENDOR CATEGORIES */}
      <section className="section categories-section">
        <div className="section-inner">
          <motion.div className="section-head" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="eyebrow">Vendor marketplace</div>
            <h2>Every vendor you need,<br /><span className="gradient-text">all in one place</span></h2>
          </motion.div>
          <div className="cat-grid">
            {vendorTypes.map((v, i) => (
              <motion.div
                key={v.label}
                className="cat-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(109,40,217,0.12)' }}
              >
                <Link to={`/vendors?category=${v.label.toUpperCase().replace(/ & BANDS|S$/g,'').replace(' ','_')}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                  <div className="cat-icon">{v.icon}</div>
                  <div className="cat-label">{v.label}</div>
                  <div className="cat-count">{v.count}</div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/vendors" className="btn-primary">Explore All Vendors →</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="section-inner">
          <motion.div className="section-head" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="eyebrow">Real stories</div>
            <h2>Loved by event planners<br /><span className="gradient-text">everywhere</span></h2>
          </motion.div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name[0]}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-event">{t.event}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section cta-section">
        <div className="section-inner">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="cta-orb" />
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Get started today</div>
            <h2>Your perfect event<br />starts <span className="gradient-text">right here</span></h2>
            <p>Join thousands of customers and vendors on EventConnect. Create your first event in minutes — completely free.</p>
            <div className="cta-btns">
              <Link to="/events/create" className="btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>Create Your Event →</Link>
              <Link to="/vendors" className="btn-outline" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>Browse Vendors</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        /* HERO */
        .hero {
          min-height: 100vh; display: flex; align-items: center;
          justify-content: space-between; padding: 8rem 5rem 4rem;
          max-width: 1280px; margin: 0 auto; gap: 4rem; position: relative; overflow: hidden;
        }
        .hero-bg-orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: -1; }
        .orb1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(109,40,217,0.07), transparent 70%); top: -200px; left: -200px; }
        .orb2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(159,103,255,0.05), transparent 70%); bottom: 0; right: 0; }
        .hero-content { flex: 1; max-width: 580px; }
        .hero-h1 { font-size: clamp(2.8rem, 5vw, 4.2rem); font-weight: 900; line-height: 1.08; margin-bottom: 1.5rem; letter-spacing: -0.02em; color: var(--ink); }
        .hero-sub { color: var(--gray); font-size: 1.1rem; line-height: 1.75; margin-bottom: 2.5rem; }
        .hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .hero-trust { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .hero-trust span { color: var(--gray); font-size: 0.85rem; font-weight: 500; }
        .hero-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; flex-shrink: 0; }
        .hero-vendor-chip {
          background: white; border: 1px solid var(--border-soft);
          border-radius: 16px; padding: 1rem 1.25rem;
          display: flex; align-items: center; gap: 0.875rem;
          box-shadow: var(--shadow); cursor: default;
          transition: all 0.3s;
        }
        .chip-icon { font-size: 1.75rem; }
        .chip-label { font-weight: 600; font-size: 0.875rem; color: var(--ink); }
        .chip-count { color: var(--gray); font-size: 0.75rem; }

        /* STATS */
        .stats-bar {
          display: grid; grid-template-columns: repeat(4, 1fr);
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .stat-item { padding: 2.5rem; text-align: center; border-right: 1px solid var(--border); }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; color: var(--violet); }
        .stat-label { color: var(--gray); font-size: 0.85rem; margin-top: 0.25rem; }

        /* SECTIONS */
        .section { padding: 6rem 0; }
        .section-inner { max-width: 1280px; margin: 0 auto; padding: 0 5rem; }
        .section-head { text-align: center; margin-bottom: 4rem; }
        .section-head h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; margin-bottom: 1rem; }
        .section-sub { color: var(--gray); font-size: 1.05rem; max-width: 560px; margin: 0 auto; line-height: 1.7; }

        /* HOW IT WORKS */
        .how-section { background: var(--bg-soft); }
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .step-card {
          background: white; border: 1px solid var(--border-soft);
          border-radius: 20px; padding: 2rem;
          box-shadow: var(--shadow); transition: all 0.3s;
        }
        .step-num { font-size: 0.7rem; font-weight: 800; color: var(--violet); letter-spacing: 0.1em; margin-bottom: 1rem; font-family: 'Inter', sans-serif; }
        .step-icon { font-size: 2rem; margin-bottom: 0.75rem; }
        .step-card h3 { font-size: 1.05rem; margin-bottom: 0.75rem; color: var(--ink); }
        .step-card p { color: var(--gray); font-size: 0.875rem; line-height: 1.65; }

        /* CATEGORIES */
        .cat-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; }
        .cat-card {
          background: white; border: 1px solid var(--border-soft);
          border-radius: 18px; padding: 1.75rem 1rem;
          text-align: center; box-shadow: var(--shadow);
          transition: all 0.3s; cursor: pointer;
        }
        .cat-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .cat-label { font-weight: 600; font-size: 0.85rem; color: var(--ink); }
        .cat-count { color: var(--violet); font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; }

        /* TESTIMONIALS */
        .testimonials-section { background: var(--bg-soft); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .testimonial-card {
          background: white; border: 1px solid var(--border-soft);
          border-radius: 20px; padding: 2rem;
          box-shadow: var(--shadow);
        }
        .testimonial-stars { color: #f59e0b; margin-bottom: 1rem; letter-spacing: 2px; }
        .testimonial-quote { color: var(--ink-soft); font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem; font-style: italic; }
        .testimonial-author { display: flex; align-items: center; gap: 0.75rem; }
        .author-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, var(--violet), var(--violet-light));
          color: white; display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1rem; flex-shrink: 0;
        }
        .author-name { font-weight: 600; font-size: 0.9rem; color: var(--ink); }
        .author-event { color: var(--gray); font-size: 0.78rem; }

        /* CTA */
        .cta-section { padding-bottom: 6rem; }
        .cta-card {
          background: linear-gradient(135deg, #faf8ff, var(--violet-pale));
          border: 1px solid var(--border);
          border-radius: 28px; padding: 5rem;
          text-align: center; position: relative; overflow: hidden;
        }
        .cta-orb {
          position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(109,40,217,0.08), transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cta-card h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; margin-bottom: 1rem; position: relative; }
        .cta-card p { color: var(--gray); max-width: 480px; margin: 0 auto 2.5rem; line-height: 1.7; position: relative; }
        .cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; }
      `}</style>
    </div>
  );
}
