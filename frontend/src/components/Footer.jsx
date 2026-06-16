import { Link } from 'react-router-dom';
import { VUTLogo, IconPhone, IconMail, IconMapPin } from './Icons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <VUTLogo size={44} />
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                  Mavuti Health Clinic
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  Vaal University of Technology
                </div>
              </div>
            </div>
            <p>
              Comprehensive healthcare for 50,000+ VUT students and staff.
              Committed to your health, well-being, and academic success.
            </p>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', opacity: 0.75 }}>
                <IconPhone size={14} /> (016) 950-9000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', opacity: 0.75 }}>
                <IconMail size={14} /> clinic@vut.ac.za
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', opacity: 0.75 }}>
                <IconMapPin size={14} /> Andries Potgieter Blvd, Vanderbijlpark
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/appointment">Book Appointment</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-links">
              <li><Link to="/services">General Consultation</Link></li>
              <li><Link to="/services">Health Screening</Link></li>
              <li><Link to="/services">Mental Health</Link></li>
              <li><Link to="/services">Lab Tests</Link></li>
              <li><Link to="/services">Immunization</Link></li>
              <li><Link to="/services">Pharmacy</Link></li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="footer-heading">Emergency</h3>
            <ul className="footer-links">
              <li>
                <span style={{ color: 'var(--vut-gold)', fontWeight: 700, fontSize: '1.1rem' }}>
                  (016) 950-9111
                </span>
                <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: 2 }}>24/7 Clinic Emergency</div>
              </li>
              <li style={{ marginTop: 8 }}>
                <span style={{ color: 'white' }}>112</span>
                <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: 2 }}>National Emergency</div>
              </li>
              <li style={{ marginTop: 8 }}>
                <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                  0800 567 567
                </span>
                <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: 2 }}>SA Depression Helpline</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {year} Mavuti Health Platform · Vaal University of Technology</span>
          <span>Built with Spring Boot · React · Gemini AI</span>
        </div>
      </div>
    </footer>
  );
}
