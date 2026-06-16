import { Link } from 'react-router-dom';
import {
  IconStethoscope, IconHeartPulse, IconFlask, IconBrain,
  IconSyringe, IconPill, IconPhone, IconClock,
  IconCalendar, IconChevronRight, IconShield, IconUsers,
  IconCheckCircle,
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

export default function HomePage() {
  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long' });

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
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
                <div
                  key={day}
                  className={`hours-row ${day === today ? 'today' : ''}`}
                >
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
