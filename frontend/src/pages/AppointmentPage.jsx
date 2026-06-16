import { useEffect, useState } from 'react';
import { appointmentsApi, servicesApi } from '../api/services';
import { IconCalendar, IconClock, IconAlertCircle, IconCheckCircle, IconPhone } from '../components/Icons';

const ALL_SLOTS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'];
const LABELS    = {
  '08:00':'8:00 AM','09:00':'9:00 AM','10:00':'10:00 AM','11:00':'11:00 AM',
  '13:00':'1:00 PM','14:00':'2:00 PM','15:00':'3:00 PM','16:00':'4:00 PM',
};

function todayIso() { return new Date().toISOString().split('T')[0]; }

export default function AppointmentPage() {
  const [services,      setServices]     = useState([]);
  const [serviceType,   setServiceType]  = useState('');
  const [date,          setDate]         = useState(todayIso());
  const [selectedTime,  setSelectedTime] = useState('');
  const [bookedTimes,   setBooked]       = useState([]);
  const [reason,        setReason]       = useState('');
  const [loadingSlots,  setLoadingSlots] = useState(false);
  const [error,         setError]        = useState(null);
  const [success,       setSuccess]      = useState(null);
  const [submitting,    setSub]          = useState(false);

  useEffect(() => {
    servicesApi.list().then(setServices).catch(() => {});
  }, []);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setSelectedTime('');
    appointmentsApi.availability(date)
      .then(d => setBooked(d.bookedTimes || []))
      .catch(() => setBooked([]))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!serviceType || !date || !selectedTime) {
      setError('Please select a service, date and time.');
      return;
    }
    setSub(true);
    try {
      await appointmentsApi.book({ serviceType, appointmentDate: date, appointmentTime: `${selectedTime}:00`, reason });
      setSuccess('Appointment booked! Check your dashboard for details.');
      setSelectedTime('');
      setReason('');
      const d = await appointmentsApi.availability(date);
      setBooked(d.bookedTimes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSub(false);
    }
  };

  const isBooked = slot => bookedTimes.some(t => t.startsWith(slot));

  return (
    <div style={{ minHeight: 'calc(100vh - var(--navbar-h))', background: 'var(--gray-50)' }}>
      {/* Page hero */}
      <section style={{ background: 'var(--vut-navy)', padding: 'var(--s12) 0' }}>
        <div className="container">
          <span className="section-eyebrow" style={{ color: 'var(--vut-gold)' }}>Clinic Booking</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Book an Appointment
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-base)' }}>
            Choose your service, pick a date and select an available time slot.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--s8)', alignItems: 'start' }}>

            {/* Main booking form */}
            <div className="card">
              <h2 className="heading-2" style={{ marginBottom: 'var(--s6)' }}>Schedule Your Visit</h2>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--s5)' }}>
                  <IconAlertCircle size={16} /> {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" style={{ marginBottom: 'var(--s5)' }}>
                  <IconCheckCircle size={16} /> {success}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s6)' }}>
                {/* Service */}
                <div className="form-group">
                  <label className="form-label" htmlFor="service">Select Service</label>
                  <select
                    id="service"
                    className="form-select"
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value)}
                    required
                  >
                    <option value="" disabled>Choose a service…</option>
                    {services.map(s => (
                      <option key={s.code} value={s.code}>{s.displayName}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="appt-date">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <IconCalendar size={14} /> Preferred Date
                    </div>
                  </label>
                  <input
                    id="appt-date"
                    type="date"
                    className="form-input"
                    value={date}
                    min={todayIso()}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Time slots */}
                <div className="form-group">
                  <label className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <IconClock size={14} /> Available Times
                    </div>
                  </label>
                  {loadingSlots ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-400)', fontSize: 'var(--text-sm)', padding: 'var(--s3) 0' }}>
                      <span className="spinner" style={{ width: 16, height: 16 }} />
                      Checking availability…
                    </div>
                  ) : (
                    <div className="time-slot-grid">
                      {ALL_SLOTS.map(slot => {
                        const taken    = isBooked(slot);
                        const selected = selectedTime === slot;
                        return (
                          <div
                            key={slot}
                            className={`time-slot${selected ? ' selected' : ''}${taken ? ' disabled' : ''}`}
                            onClick={() => !taken && setSelectedTime(slot)}
                            role="button"
                            tabIndex={taken ? -1 : 0}
                            aria-pressed={selected}
                            aria-disabled={taken}
                            onKeyDown={e => e.key === 'Enter' && !taken && setSelectedTime(slot)}
                          >
                            {LABELS[slot]}
                            {taken && <div style={{ fontSize: 10, marginTop: 2, opacity: 0.6 }}>Booked</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reason">
                    Reason for Visit <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    id="reason"
                    className="form-textarea"
                    placeholder="Briefly describe your concern so the clinic can prepare…"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full"
                  disabled={submitting || !serviceType || !selectedTime}
                >
                  {submitting
                    ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Booking…</>
                    : <><IconCalendar size={18} /> Confirm Booking</>
                  }
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
              {/* Info card */}
              <div className="card" style={{ borderLeft: '4px solid var(--vut-navy)' }}>
                <h4 className="heading-3" style={{ marginBottom: 'var(--s4)' }}>Before you come</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                  {[
                    'Book at least 24 hours in advance',
                    'Arrive 10 minutes early',
                    'Bring student/staff ID & medical aid card',
                    'Cancel at least 6 hours before to avoid fees',
                  ].map(tip => (
                    <li key={tip} style={{ display: 'flex', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                      <IconCheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Urgent card */}
              <div className="card" style={{ background: 'var(--error-bg)', border: '1px solid #fca5a5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--s3)' }}>
                  <IconPhone size={18} style={{ color: 'var(--error)' }} />
                  <h4 style={{ color: 'var(--error)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>Urgent Care</h4>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: '#7f1d1d', marginBottom: 'var(--s3)' }}>
                  For urgent needs during clinic hours:
                </p>
                <div style={{ fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--error)' }}>(016) 950-9000</div>
                <div style={{ height: 1, background: '#fca5a5', margin: 'var(--s3) 0' }} />
                <p style={{ fontSize: 'var(--text-xs)', color: '#7f1d1d', marginBottom: 4 }}>After hours emergency:</p>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--error)' }}>(016) 950-9595</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
