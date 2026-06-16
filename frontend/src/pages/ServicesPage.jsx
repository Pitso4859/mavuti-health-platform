import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesApi } from '../api/services';
import {
  IconStethoscope, IconHeartPulse, IconFlask, IconBrain,
  IconSyringe, IconPill, IconCalendar, IconChevronRight,
} from '../components/Icons';

// Map backend service codes to icons
const ICON_MAP = {
  GENERAL_CONSULTATION:   IconStethoscope,
  HEALTH_SCREENING:       IconHeartPulse,
  MENTAL_HEALTH_COUNSELING: IconBrain,
  LAB_TEST:               IconFlask,
  IMMUNIZATION:           IconSyringe,
  PHARMACY:               IconPill,
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    servicesApi.list()
      .then(setServices)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Page hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--vut-navy) 0%, var(--vut-navy-dark) 100%)',
        color: 'var(--white)', padding: 'var(--s16) 0', textAlign: 'center',
      }}>
        <div className="container">
          <span className="section-eyebrow" style={{ color: 'var(--vut-gold)' }}>What we offer</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'white', marginBottom: 'var(--s4)' }}>
            Our Medical Services
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', opacity: 0.75, maxWidth: 560, margin: '0 auto var(--s8)' }}>
            Comprehensive healthcare tailored to the VUT community's needs,
            from primary care to specialist mental health support.
          </p>
          <Link to="/appointment" className="btn btn-gold btn-lg">
            <IconCalendar size={18} /> Book Appointment
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && (
            <div className="loading-state">
              <div className="spinner spinner-lg" />
              <span>Loading services…</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ maxWidth: 500, margin: '0 auto' }}>
              Failed to load services: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-3">
              {services.map(svc => {
                const Icon = ICON_MAP[svc.code] || IconStethoscope;
                return (
                  <div key={svc.code} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
                    <div className="service-icon-wrap">
                      <Icon size={30} style={{ color: 'var(--vut-navy)' }} />
                    </div>
                    <h3 className="heading-3" style={{ color: 'var(--gray-800)' }}>{svc.displayName}</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)', lineHeight: 1.7, flex: 1 }}>
                      {svc.description}
                    </p>
                    <Link
                      to="/appointment"
                      className="btn btn-outline btn-sm"
                      style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
                    >
                      Book this service <IconChevronRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{
            marginTop: 'var(--s16)', background: 'var(--vut-navy-light)',
            borderRadius: 'var(--radius-xl)', padding: 'var(--s10)',
            textAlign: 'center',
          }}>
            <h3 className="heading-2" style={{ color: 'var(--vut-navy)', marginBottom: 'var(--s3)' }}>
              Not sure which service you need?
            </h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--s6)' }}>
              Book a General Consultation — our doctors will assess and direct you to the right specialist care.
            </p>
            <Link to="/appointment" className="btn btn-primary btn-lg">
              <IconCalendar size={18} /> Book General Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
