import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsApi } from '../api/services';
import {
  IconCalendar, IconClock, IconCheckCircle, IconAlertCircle,
  IconTrash, IconRefreshCw, IconSparkles, IconUser, IconPhone, IconShield,
} from '../components/Icons';

const STATUS_BADGE = {
  PENDING:   { cls: 'badge-warning', label: 'Pending' },
  CONFIRMED: { cls: 'badge-success', label: 'Confirmed' },
  CANCELLED: { cls: 'badge-error',   label: 'Cancelled' },
  COMPLETED: { cls: 'badge-navy',    label: 'Completed' },
};

const STATUS_ORDER = ['CONFIRMED','PENDING','COMPLETED','CANCELLED'];

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-ZA', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtTime(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function DashboardPage() {
  const { user, isStaff } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [cancelling, setCancelling]     = useState(null);
  const [filter, setFilter]             = useState('ALL');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentsApi.mine();
      const sorted = [...data].sort((a, b) => {
        const ai = STATUS_ORDER.indexOf(a.status);
        const bi = STATUS_ORDER.indexOf(b.status);
        if (ai !== bi) return ai - bi;
        return new Date(b.appointmentDate) - new Date(a.appointmentDate);
      });
      setAppointments(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    setCancelling(id);
    try {
      await appointmentsApi.cancel(id);
      setAppointments(prev => prev.map(a =>
        a.id === id ? { ...a, status: 'CANCELLED' } : a
      ));
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'ALL'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const stats = {
    upcoming:  appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    total:     appointments.length,
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <div className="dashboard-greeting">
              <p className="sub">{greeting()},</p>
              <h1 className="name">{user?.firstName} {user?.lastName}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span className={`badge ${isStaff ? 'badge-gold' : 'badge-navy'}`}>
                  <IconUser size={11} />
                  {isStaff ? 'Staff / Employee' : 'Student'}
                </span>
                {user?.institutionNumber && (
                  <span className="badge badge-gray">#{user.institutionNumber}</span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading} aria-label="Refresh">
              <IconRefreshCw size={15} />
              Refresh
            </button>
            <Link to="/appointment" className="btn btn-primary btn-sm">
              <IconCalendar size={15} /> Book Appointment
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-3" style={{ marginBottom: 'var(--s8)' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--vut-navy)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Upcoming</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--vut-navy)' }}>{stats.upcoming}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', marginTop: 2 }}>Confirmed + pending</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Completed</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--success)' }}>{stats.completed}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', marginTop: 2 }}>Visit history</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--vut-gold-dark)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Total</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--vut-gold-dark)' }}>{stats.total}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', marginTop: 2 }}>All appointments</div>
          </div>
        </div>

        {/* Main panel */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding: 'var(--s5) var(--s6)', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s3)' }}>
            <h2 className="heading-3">My Appointments</h2>
            <div style={{ display: 'flex', gap: 'var(--s2)', flexWrap: 'wrap' }}>
              {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setFilter(f)}
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading && (
            <div className="loading-state"><div className="spinner" /> Loading appointments…</div>
          )}

          {error && (
            <div style={{ padding: 'var(--s6)' }}>
              <div className="alert alert-error"><IconAlertCircle size={16} /> {error}</div>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ padding: 'var(--s16)', textAlign: 'center' }}>
              <IconCalendar size={48} style={{ color: 'var(--gray-300)', margin: '0 auto var(--s4)' }} />
              <h3 className="heading-3" style={{ color: 'var(--gray-400)', marginBottom: 'var(--s3)' }}>No appointments found</h3>
              <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--s6)' }}>
                {filter === 'ALL' ? "You haven't booked any appointments yet." : `No ${filter.toLowerCase()} appointments.`}
              </p>
              <Link to="/appointment" className="btn btn-primary btn-sm">
                <IconCalendar size={15} /> Book Your First Appointment
              </Link>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="appt-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(appt => {
                    const badge   = STATUS_BADGE[appt.status] || STATUS_BADGE.PENDING;
                    const canCancel = appt.status === 'PENDING' || appt.status === 'CONFIRMED';
                    return (
                      <tr key={appt.id}>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                            {appt.serviceType?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <IconCalendar size={14} style={{ color: 'var(--gray-400)' }} />
                            {fmtDate(appt.appointmentDate)}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <IconClock size={14} style={{ color: 'var(--gray-400)' }} />
                            {fmtTime(appt.appointmentTime)}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${badge.cls}`}>
                            {appt.status === 'CONFIRMED' && <IconCheckCircle size={11} />}
                            {badge.label}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>
                            {appt.reason || '—'}
                          </span>
                        </td>
                        <td>
                          {canCancel && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleCancel(appt.id)}
                              disabled={cancelling === appt.id}
                              title="Cancel appointment"
                              style={{ color: 'var(--error)' }}
                            >
                              {cancelling === appt.id
                                ? <span className="spinner" style={{ width: 14, height: 14 }} />
                                : <IconTrash size={14} />
                              }
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Nudge card (for users who don't know about the AI) */}
        <div className="card" style={{ marginTop: 'var(--s6)', background: 'linear-gradient(135deg, var(--vut-navy) 0%, var(--vut-navy-dark) 100%)', border: 'none', color: 'var(--white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s5)', flexWrap: 'wrap' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,209,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconSparkles size={24} style={{ color: 'var(--vut-gold)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>
                AI Health Assistant Available
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', opacity: 0.75 }}>
                Have a health question? Our Gemini-powered assistant can provide general health guidance,
                explain clinic services, and help you decide if you need an appointment.
              </p>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', opacity: 0.6, flexShrink: 0 }}>
              Look for the <IconSparkles size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> button at the bottom-right
            </div>
          </div>
        </div>

        {isStaff && <ManageSlotsPanel />}

        {/* Emergency reminder */}
        <div style={{ marginTop: 'var(--s4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--gray-400)', fontSize: 'var(--text-xs)' }}>
          <IconPhone size={12} />
          Medical emergency? Call <strong style={{ color: 'var(--error)' }}>(016) 950-9111</strong> immediately · 24/7
        </div>

      </div>
    </div>
  );
}

const SLOT_TIMES = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'];

function fmtSlotLabel(t) {
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

/**
 * Staff/admin-only panel for blocking appointment slots ahead of time —
 * e.g. a 10:00-11:00 staff meeting makes the clinic unavailable for that
 * hour. Visible only when `isStaff` (EMPLOYEE/ADMIN role).
 */
function ManageSlotsPanel() {
  const [date, setDate]               = useState(tomorrowIso());
  const [startTime, setStartTime]     = useState('10:00');
  const [endTime, setEndTime]         = useState('11:00');
  const [reason, setReason]           = useState('Staff meeting');
  const [blocked, setBlocked]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState(null);
  const [notice, setNotice]           = useState(null);

  const load = (d) => {
    setLoading(true);
    appointmentsApi.listBlocked(d)
        .then(setBlocked)
        .catch(() => setBlocked([]))
        .finally(() => setLoading(false));
  };

  useEffect(() => { load(date); }, [date]);

  const handleBlock = async (e) => {
    e.preventDefault();
    setError(null); setNotice(null);
    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }
    setSaving(true);
    try {
      await appointmentsApi.blockSlotRange({
        blockedDate: date,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        reason,
      });
      setNotice(`Blocked ${fmtSlotLabel(startTime)}–${fmtSlotLabel(endTime)} on ${date}.`);
      load(date);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await appointmentsApi.unblockSlot(id);
      load(date);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card" style={{ marginTop: 'var(--s6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--s4)' }}>
        <IconShield size={18} style={{ color: 'var(--vut-navy)' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: 0 }}>Manage Slots</h3>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', marginBottom: 'var(--s5)' }}>
        Block a time range (e.g. for a staff meeting) so students and employees can't book it.
        Block slots at least a day ahead so patients aren't caught out by a last-minute change.
      </p>

      {error  && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}><IconAlertCircle size={16} /> {error}</div>}
      {notice && <div className="alert alert-success" style={{ marginBottom: 'var(--s4)' }}><IconCheckCircle size={16} /> {notice}</div>}

      <form onSubmit={handleBlock} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--s4)' }}>
        <div className="layout-2col layout-2col--even">
          <div className="form-group">
            <label className="form-label" htmlFor="block-date">Date</label>
            <input id="block-date" type="date" className="form-input" value={date}
                   min={tomorrowIso()} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="block-reason">Reason</label>
            <input id="block-reason" type="text" className="form-input" value={reason}
                   maxLength={200} onChange={e => setReason(e.target.value)} placeholder="e.g. Staff meeting" />
          </div>
        </div>
        <div className="layout-2col layout-2col--even">
          <div className="form-group">
            <label className="form-label" htmlFor="block-start">From</label>
            <select id="block-start" className="form-input" value={startTime} onChange={e => setStartTime(e.target.value)}>
              {SLOT_TIMES.map(t => <option key={t} value={t}>{fmtSlotLabel(t)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="block-end">Until</label>
            <select id="block-end" className="form-input" value={endTime} onChange={e => setEndTime(e.target.value)}>
              {[...SLOT_TIMES, '17:00'].map(t => <option key={t} value={t}>{fmtSlotLabel(t)}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ justifySelf: 'start' }}>
          {saving ? 'Blocking…' : 'Block this time range'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--s6)' }}>
        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--s3)' }}>
          Blocked slots — {date}
        </h4>
        {loading ? (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)' }}>Loading…</p>
        ) : blocked.length === 0 ? (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)' }}>No blocked slots for this date.</p>
        ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
              {blocked.map(b => (
                  <li key={b.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)',
                  }}>
                    <span style={{ fontSize: 'var(--text-sm)' }}>
                      <strong>{fmtSlotLabel(b.blockedTime.slice(0, 5))}</strong>
                      {b.reason ? ` — ${b.reason}` : ''}
                    </span>
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        title="Unblock this slot"
                        onClick={() => handleUnblock(b.id)}
                        style={{ color: 'var(--error)' }}
                    >
                      <IconTrash size={16} />
                    </button>
                  </li>
              ))}
            </ul>
        )}
      </div>
    </div>
  );
}
