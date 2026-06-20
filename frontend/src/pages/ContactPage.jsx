import { useState } from 'react';
import { contactApi } from '../api/services';
import { IconPhone, IconMail, IconMapPin, IconClock, IconCheckCircle, IconAlertCircle, IconSend } from '../components/Icons';

const INITIAL = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm]       = useState(INITIAL);
  const [status, setStatus]   = useState(null);  // 'success' | 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await contactApi.submit(form);
      setStatus('success');
      setMessage("Message sent! We'll respond within 1\u20132 business days.");
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Failed to send. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        {/* Hero */}
        <section style={{ background: 'var(--vut-navy)', padding: 'var(--s16) 0', textAlign: 'center' }}>
          <div className="container">
            <span className="section-eyebrow" style={{ color: 'var(--vut-gold)' }}>Get in touch</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'white', marginBottom: 'var(--s4)' }}>
              Contact the Clinic
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', maxWidth: 520, margin: '0 auto' }}>
              Have a question, concern or feedback? Our team is here to help.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="layout-2col layout-2col--side-wide">

              {/* Contact info sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
                <h2 className="heading-2" style={{ marginBottom: 'var(--s2)' }}>Clinic Details</h2>
                <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--s4)' }}>
                  Visit us on campus or reach out through any of the channels below.
                </p>

                {[
                  {
                    icon: IconPhone,
                    label: 'Phone',
                    lines: ['(016) 950-9000 — Reception', '(016) 950-9111 — Emergency (24/7)'],
                  },
                  {
                    icon: IconMail,
                    label: 'Email',
                    lines: ['clinic@vut.ac.za', 'Response within 1–2 business days'],
                  },
                  {
                    icon: IconMapPin,
                    label: 'Location',
                    lines: ['Health Clinic Building', 'Andries Potgieter Blvd, Vanderbijlpark', '1911, South Africa'],
                  },
                  {
                    icon: IconClock,
                    label: 'Hours',
                    lines: ['Mon – Thu: 08:00 – 17:00', 'Fri: 08:00 – 16:00', 'Sat: 09:00 – 12:00', 'Sun: Closed'],
                  },
                ].map(({ icon: Icon, label, lines }) => (
                    <div key={label} style={{ display: 'flex', gap: 'var(--s4)', padding: 'var(--s5)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--vut-navy-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} style={{ color: 'var(--vut-navy)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--gray-700)', marginBottom: 4 }}>{label}</div>
                        {lines.map((line, i) => (
                            <div key={i} style={{ fontSize: 'var(--text-sm)', color: i === 0 ? 'var(--gray-700)' : 'var(--gray-400)' }}>{line}</div>
                        ))}
                      </div>
                    </div>
                ))}

                {/* Emergency box */}
                <div style={{ background: 'var(--error-bg)', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', padding: 'var(--s5)', marginTop: 'var(--s2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <IconPhone size={16} style={{ color: 'var(--error)' }} />
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--error)' }}>Medical Emergency?</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--error)', fontFamily: 'var(--font-display)' }}>(016) 950-9111</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: '#7f1d1d', marginTop: 4 }}>Or call national emergency: 112</div>
                </div>
              </div>

              {/* Contact form */}
              <div className="card">
                <h2 className="heading-2" style={{ marginBottom: 'var(--s6)' }}>Send a Message</h2>

                {status === 'success' && (
                    <div className="alert alert-success" style={{ marginBottom: 'var(--s5)' }}>
                      <IconCheckCircle size={16} /> {message}
                    </div>
                )}
                {status === 'error' && (
                    <div className="alert alert-error" style={{ marginBottom: 'var(--s5)' }}>
                      <IconAlertCircle size={16} /> {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>
                  <div className="layout-2col layout-2col--even" style={{ gap: 'var(--s5)' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <input id="name" type="text" className="form-input"
                             placeholder="Thabo Dlamini" value={form.name}
                             onChange={set('name')} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email</label>
                      <input id="email" type="email" className="form-input"
                             placeholder="thabo@vut.ac.za" value={form.email}
                             onChange={set('email')} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject</label>
                    <select id="subject" className="form-select" value={form.subject}
                            onChange={set('subject')} required>
                      <option value="" disabled>Select a subject…</option>
                      <option value="Appointment Query">Appointment Query</option>
                      <option value="Medical Record Request">Medical Record Request</option>
                      <option value="Billing / Medical Aid">Billing / Medical Aid</option>
                      <option value="Feedback">Feedback / Compliment</option>
                      <option value="Complaint">Complaint</option>
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea id="message" className="form-textarea" rows={5}
                              placeholder="Describe your query or concern in detail…"
                              value={form.message} onChange={set('message')} required />
                  </div>

                  <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-full"
                      disabled={loading}
                  >
                    {loading
                        ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Sending…</>
                        : <><IconSend size={16} /> Send Message</>
                    }
                  </button>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', textAlign: 'center' }}>
                    For urgent medical concerns, please call us directly — don't use this form.
                  </p>
                </form>
              </div>

            </div>
          </div>
        </section>
      </div>
  );
}