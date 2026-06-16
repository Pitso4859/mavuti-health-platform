import { Link } from 'react-router-dom';
import {
  IconStethoscope, IconHeartPulse, IconFlask, IconBrain,
  IconSyringe, IconPill, IconPhone, IconClock,
  IconCalendar, IconChevronRight, IconShield, IconUsers,
  IconCheckCircle, VUTLogo,
} from '../components/Icons';

const SERVICES_PREVIEW = [
  { icon: IconStethoscope, title: 'General Consultation', desc: 'Comprehensive assessments and treatment of common illnesses.' },
  { icon: IconHeartPulse,  title: 'Health Screening',     desc: 'Blood pressure, cholesterol, glucose, BMI and vision checks.' },
  { icon: IconBrain,       title: 'Mental Health',        desc: 'Confidential counselling for stress, anxiety and depression.' },
  { icon: IconFlask,       title: 'Lab Tests',            desc: 'On-site STI, pregnancy and allergy diagnostic testing.' },
  { icon: IconSyringe,     title: 'Immunization',         desc: 'Flu vaccines, HIV testing and ARV initiation services.' },
  { icon: IconPill,        title: 'Pharmacy',             desc: 'Dispensing prescribed medication for students and staff.' },
];

const HOURS = [
  { day: 'Monday',    time: '08:00 – 17:00' },
  { day: 'Tuesday',   time: '08:00 – 17:00' },
  { day: 'Wednesday', time: '08:00 – 17:00' },
  { day: 'Thursday',  time: '08:00 – 17:00' },
  { day: 'Friday',    time: '08:00 – 16:00' },
  { day: 'Saturday',  time: '09:00 – 12:00' },
  { day: 'Sunday',    time: 'Closed' },
];

const TRUST_POINTS = [
  'Confidential health records',
  'Qualified medical staff',
  'Free for registered VUT students',
  'Covered by most medical aids',
];

/* ── VUT Campus image card — real photo from vut.ac.za ── */
function CampusImageCard() {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
      background: '#001f62',
      aspectRatio: '4/3',
      maxWidth: 540,
      width: '100%',
    }}>
      {/* Real VUT campus photo */}
      <img
        src="https://www.vut.ac.za/wp-content/uploads/2023/08/VUT-Campus.jpg"
        alt="Vaal University of Technology campus"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        onError={(e) => {
          // Fallback to another real VUT image if first fails
          e.target.onerror = null;
          e.target.src = 'https://www.vut.ac.za/wp-content/uploads/2022/09/VUT-Main-Campus-1.jpg';
        }}
      />

      {/* Dark overlay for contrast */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,20,80,0.15) 0%, rgba(0,20,80,0.55) 100%)',
      }} />

      {/* Bottom bar — Clinic name badge */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '16px 20px',
        background: 'rgba(0,20,80,0.7)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 36, height: 36,
          background: '#FFD100',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconShield size={18} style={{ color: '#0033a0' }} />
        </div>
        <div>
          <div style={{ color: '#FFD100', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
            Mavuti Health Clinic
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            Vaal University of Technology
          </div>
        </div>

        {/* Live badge */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(22,163,74,0.25)',
          border: '1px solid rgba(22,163,74,0.5)',
          borderRadius: 20,
          padding: '4px 10px',
        }}>
          <span style={{
            width: 7, height: 7,
            background: '#4ade80',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 600 }}>Open now</span>
        </div>
      </div>

      {/* Top-left VUT logo badge */}
      <div style={{
        position: 'absolute',
        top: 14, left: 14,
        background: 'rgba(0,31,98,0.75)',
        backdropFilter: 'blur(8px)',
        borderRadius: 10,
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        border: '1px solid rgba(255,209,0,0.3)',
      }}>
        <VUTLogo size={22} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 11, letterSpacing: '0.04em' }}>
          VUT
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long' });

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-layout">

            {/* Left — text content */}
            <div className="hero-content animate-fade-up">
              <span className="hero-eyebrow">
                <IconShield size={12} />
                Vaal University of Technology · Est. 1966
              </span>

              <h1 className="hero-title">
                Your health,<br />
                our <span className="gold">priority</span>.
              </h1>

              <p className="hero-desc">
                The Mavuti Health Clinic provides comprehensive medical services
                to over 50,000 VUT students and staff — from consultations
                to mental health support, all in one place.
              </p>

              <div className="hero-actions">
                <Link to="/appointment" className="btn btn-gold btn-lg">
                  <IconCalendar size={18} />
                  Book Appointment
                </Link>
                <Link to="/services" className="btn btn-outline-white btn-lg">
                  View All Services
                  <IconChevronRight size={18} />
                </Link>
              </div>

              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">50K+</div>
                  <div className="hero-stat-label">Community served</div>
                </div>
                <div>
                  <div className="hero-stat-value">6</div>
                  <div className="hero-stat-label">Specialist services</div>
                </div>
                <div>
                  <div className="hero-stat-value">60</div>
                  <div className="hero-stat-label">Years of VUT excellence</div>
                </div>
              </div>
            </div>

            {/* Right — real VUT campus image */}
            <div className="hero-image-wrap">
              <CampusImageCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────── */}
      <div style={{ background: 'var(--vut-gold)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--s8)', flexWrap: 'wrap' }}>
          {TRUST_POINTS.map(p => (
            <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--vut-navy-dark)' }}>
              <IconCheckCircle size={16} />
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ── Services Preview ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 'var(--s12)', maxWidth: 560 }}>
            <span className="section-eyebrow">What we offer</span>
            <h2 className="section-title">Medical Services</h2>
            <p className="section-lead">
              Six specialised service areas designed around the unique health
              needs of the VUT campus community.
            </p>
          </div>

          <div className="grid grid-3">
            {SERVICES_PREVIEW.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                <div className="service-icon-wrap">
                  <Icon size={28} style={{ color: 'var(--vut-navy)' }} />
                </div>
                <h3 className="heading-3">{title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)', lineHeight: 1.6, flex: 1 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--s10)' }}>
            <Link to="/services" className="btn btn-primary btn-lg">
              Explore All Services
              <IconChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About VUT strip ───────────────────────────────────── */}
      <section style={{
        background: '#f8f9fc',
        padding: 'var(--s16) 0',
        borderTop: '1px solid var(--gray-200)',
        borderBottom: '1px solid var(--gray-200)',
      }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 'var(--s10)', alignItems: 'center', flexWrap: 'wrap' }}>

            {/* VUT logo + text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s5)', flex: '0 0 auto' }}>
              <VUTLogo size={64} />
              <div>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--vut-navy)', lineHeight: 1.2 }}>
                  Vaal University
                </p>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--vut-navy)', lineHeight: 1.2 }}>
                  of Technology
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', marginTop: 3, fontStyle: 'italic' }}>
                  Inspiring thought. Shaping talent.™
                </p>
              </div>
            </div>

            <div style={{ width: 1, height: 64, background: 'var(--gray-200)', flexShrink: 0 }} className="divider-v" />

            {/* About blurb */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', lineHeight: 1.7 }}>
                VUT has been shaping minds and communities since 1966. The Mavuti Health Clinic
                serves as the university's dedicated healthcare facility — providing high-quality,
                accessible medical services to over 50,000 registered students and staff on campus.
                <a
                  href="https://www.vut.ac.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--vut-navy)', fontWeight: 600, marginLeft: 6 }}
                >
                  Visit vut.ac.za →
                </a>
              </p>
            </div>

            {/* Anniversary badge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 90, height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0033a0, #001f62)',
              border: '3px solid #FFD100',
              flexShrink: 0,
              boxShadow: '0 4px 20px rgba(0,51,160,0.25)',
            }}>
              <span style={{ color: '#FFD100', fontSize: 26, fontWeight: 800, lineHeight: 1 }}>60</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                YEARS
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8 }}>1966–2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hours + Emergency ─────────────────────────────────── */}
      <section className="section section--navy">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--s12)' }}>
            <span className="section-eyebrow" style={{ color: 'var(--vut-gold)' }}>When we're open</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>Clinic Hours</h2>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--s8)' }}>
            {/* Hours card */}
            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-lg)', padding: 'var(--s8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s6)' }}>
                <IconClock size={22} style={{ color: 'var(--vut-gold)' }} />
                <h3 style={{ color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Regular Hours</h3>
              </div>
              {HOURS.map(({ day, time }) => (
                <div key={day} className={`hours-row ${day === today ? 'today' : ''}`}>
                  <span className="day">{day}</span>
                  <span className="time" style={{ color: time === 'Closed' ? 'rgba(255,255,255,0.35)' : 'var(--white)' }}>
                    {time}
                  </span>
                </div>
              ))}
            </div>

            {/* Emergency card */}
            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-lg)', padding: 'var(--s8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s6)' }}>
                <IconPhone size={22} style={{ color: 'var(--vut-gold)' }} />
                <h3 style={{ color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Emergency Contact</h3>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--text-sm)', marginBottom: 'var(--s5)' }}>
                For after-hours emergencies, call our 24/7 emergency line immediately.
              </p>

              <div className="emergency-number">(016) 950-9111</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-xs)', marginTop: 'var(--s2)', marginBottom: 'var(--s6)' }}>24/7 Clinic Emergency</p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 'var(--s5)' }}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--text-sm)', marginBottom: 'var(--s3)' }}>Life-threatening emergency:</p>
                <div style={{ display: 'flex', gap: 'var(--s4)', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>112</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'var(--text-xs)' }}>National Emergency</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: 'var(--text-base)' }}>(016) 931-5000</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'var(--text-xs)' }}>Vanderbijlpark Medi-Clinic</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--s6)', paddingTop: 'var(--s5)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-xs)' }}>Mental health support:</p>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginTop: 4 }}>0800 567 567</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-xs)' }}>SA Depression & Anxiety Helpline (free)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--vut-navy-light)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <span className="section-eyebrow">Ready to get started?</span>
          <h2 className="section-title" style={{ color: 'var(--vut-navy)' }}>
            Take care of your health today
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-lg)', marginBottom: 'var(--s8)' }}>
            Book an appointment in minutes. Free for all registered VUT students.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--s4)', flexWrap: 'wrap' }}>
            <Link to="/appointment" className="btn btn-primary btn-lg">
              <IconCalendar size={18} /> Book Now
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              <IconUsers size={18} /> Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
