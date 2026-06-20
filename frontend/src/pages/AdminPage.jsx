import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { adminApi } from '../api/services';
import {
  IconUsers, IconCalendar, IconCheckCircle, IconAlertCircle,
  IconTrash, IconUser, IconLayoutDashboard, IconX, IconRefreshCw,
  IconShield, IconPhone,
} from '../components/Icons';

// ── Tiny helpers ─────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtTime(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

const STATUS_BADGE = {
  PENDING:   { cls: 'badge-warning', label: 'Pending' },
  CONFIRMED: { cls: 'badge-success', label: 'Confirmed' },
  CANCELLED: { cls: 'badge-error',   label: 'Cancelled' },
  COMPLETED: { cls: 'badge-navy',    label: 'Completed' },
};
const ROLE_BADGE = {
  STUDENT:  { cls: 'badge-navy',    label: 'Student' },
  EMPLOYEE: { cls: 'badge-gold',    label: 'Staff' },
  ADMIN:    { cls: 'badge-success', label: 'Admin' },
};

// ── User form (add / edit) ────────────────────────────────────────────────
const EMPTY_USER = {
  firstName: '', lastName: '', email: '', phone: '',
  institutionNumber: '', password: '', role: 'STUDENT',
};

function UserModal({ user, onClose, onSave }) {
  const [form, setForm]   = useState(user ? { ...user, password: '' } : EMPTY_USER);
  const [saving, setSave] = useState(false);
  const [err, setErr]     = useState(null);
  const isEdit = !!user;

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    setErr(null);
    if (!form.firstName || !form.lastName || !form.email || !form.institutionNumber) {
      setErr('Please fill in all required fields.');
      return;
    }
    if (!isEdit && !form.password) { setErr('Password is required for new users.'); return; }
    setSave(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password; // don't overwrite pw on edit
      await onSave(payload);
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSave(false);
    }
  };

  return (
      <div className="admin-modal-overlay" onClick={onClose}>
        <div className="admin-modal" onClick={e => e.stopPropagation()}>
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">{isEdit ? 'Edit User' : 'Add New User'}</h3>
            <button className="btn btn-ghost btn-sm" onClick={onClose}><IconX size={16} /></button>
          </div>
          <div className="admin-modal-body">
            {err && <div className="alert alert-error"><IconAlertCircle size={14} />{err}</div>}

            <div className="layout-2col layout-2col--even" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input className="form-input" placeholder="Thabo" value={form.firstName} onChange={set('firstName')} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input className="form-input" placeholder="Dlamini" value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" placeholder="thabo@vut.ac.za" value={form.email} onChange={set('email')} />
            </div>

            <div className="layout-2col layout-2col--even" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Institution Number *</label>
                <input className="form-input" placeholder="221386653" value={form.institutionNumber} onChange={set('institutionNumber')} inputMode="numeric" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+27 72 000 0000" value={form.phone || ''} onChange={set('phone')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role *</label>
              <select className="form-select" value={form.role} onChange={set('role')}>
                <option value="STUDENT">Student</option>
                <option value="EMPLOYEE">Staff / Employee</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{isEdit ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
              <input className="form-input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} autoComplete="new-password" />
            </div>
          </div>
          <div className="admin-modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving…</> : (isEdit ? 'Save Changes' : 'Add User')}
            </button>
          </div>
        </div>
      </div>
  );
}

// ── Appointment detail modal ──────────────────────────────────────────────
function ApptModal({ appt, onClose, onStatusChange }) {
  const [status, setStatus]   = useState(appt.status);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState(null);

  const handleUpdate = async () => {
    setSaving(true);
    setErr(null);
    try {
      await onStatusChange(appt.id, status);
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
      <div className="admin-modal-overlay" onClick={onClose}>
        <div className="admin-modal" onClick={e => e.stopPropagation()}>
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Appointment Details</h3>
            <button className="btn btn-ghost btn-sm" onClick={onClose}><IconX size={16} /></button>
          </div>
          <div className="admin-modal-body">
            {err && <div className="alert alert-error"><IconAlertCircle size={14} />{err}</div>}

            <div className="layout-2col layout-2col--even" style={{ gap: 12 }}>
              {[
                ['Patient', `${appt.patientFirstName || ''} ${appt.patientLastName || ''}`.trim() || appt.patientInstitutionNumber || '—'],
                ['Institution No.', appt.patientInstitutionNumber || '—'],
                ['Service', (appt.serviceType || '').replace(/_/g, ' ')],
                ['Date', fmtDate(appt.appointmentDate)],
                ['Time', fmtTime(appt.appointmentTime)],
                ['Booked on', fmtDate(appt.createdAt)],
              ].map(([label, value]) => (
                  <div key={label} style={{ padding: 12, background: 'var(--gray-50)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-800)' }}>{value}</div>
                  </div>
              ))}
            </div>

            {appt.reason && (
                <div style={{ padding: 12, background: 'var(--vut-navy-light)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--vut-navy)', marginBottom: 4 }}>REASON</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-700)' }}>{appt.reason}</div>
                </div>
            )}

            <div className="form-group">
              <label className="form-label">Update Status</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed / Approved</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
              {saving ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving…</> : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
  );
}

// ── Stats overview tab ────────────────────────────────────────────────────
function StatsTab({ stats, loading }) {
  if (loading) return <div className="loading-state"><div className="spinner" />Loading stats…</div>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Users',        value: stats.totalUsers        ?? '—', sub: 'Registered accounts',       color: 'var(--vut-navy)' },
    { label: 'Students',           value: stats.totalStudents     ?? '—', sub: 'Student accounts',           color: 'var(--info)' },
    { label: 'Staff / Employees',  value: stats.totalEmployees    ?? '—', sub: 'Employee accounts',          color: 'var(--vut-gold-dark)' },
    { label: 'Total Appointments', value: stats.totalAppointments ?? '—', sub: 'All time',                  color: 'var(--success)' },
    { label: 'Pending',            value: stats.pendingAppointments   ?? '—', sub: 'Awaiting approval',     color: 'var(--warning)' },
    { label: 'Confirmed',          value: stats.confirmedAppointments ?? '—', sub: 'Approved & upcoming',   color: 'var(--success)' },
    { label: 'Completed',          value: stats.completedAppointments ?? '—', sub: 'Attended visits',       color: 'var(--vut-navy)' },
    { label: 'Cancelled',          value: stats.cancelledAppointments ?? '—', sub: 'Cancelled bookings',    color: 'var(--error)' },
  ];

  return (
      <div className="admin-stats-grid" style={{ gap: 'var(--s4)' }}>
        {cards.map(c => (
            <div key={c.label} className="admin-stat-card" style={{ borderTop: `4px solid ${c.color}` }}>
              <div className="admin-stat-label">{c.label}</div>
              <div className="admin-stat-value" style={{ color: c.color }}>{c.value}</div>
              <div className="admin-stat-sub">{c.sub}</div>
            </div>
        ))}
      </div>
  );
}

// ── Users tab ─────────────────────────────────────────────────────────────
function UsersTab({ users, loading, onRefresh }) {
  const [search, setSearch]   = useState('');
  const [roleFilter, setRole] = useState('ALL');
  const [modal, setModal]     = useState(null);  // null | 'add' | {user}
  const [deleting, setDel]    = useState(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.institutionNumber?.includes(q);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSave = async (payload) => {
    if (modal === 'add') {
      await adminApi.createUser(payload);
    } else {
      await adminApi.updateUser(modal.id, payload);
    }
    onRefresh();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDel(id);
    try {
      await adminApi.deleteUser(id);
      onRefresh();
    } catch (e) { alert(e.message); }
    finally { setDel(null); }
  };

  return (
      <div>
        <div className="admin-toolbar">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
            <input
                className="admin-search"
                placeholder="Search by name, email or number…"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {['ALL','STUDENT','EMPLOYEE','ADMIN'].map(r => (
                <button
                    key={r}
                    className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setRole(r)}
                    style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  {r === 'ALL' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('add')}>
            <IconUser size={14} /> Add User
          </button>
        </div>

        {loading
            ? <div className="loading-state"><div className="spinner" />Loading users…</div>
            : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                    <tr>
                      <th>Name</th>
                      <th>Institution No.</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No users found</td></tr>
                    )}
                    {filtered.map(u => {
                      const rb = ROLE_BADGE[u.role] || ROLE_BADGE.STUDENT;
                      return (
                          <tr key={u.id}>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                                {u.firstName} {u.lastName}
                              </div>
                            </td>
                            <td><code style={{ fontSize: 12, background: 'var(--gray-100)', padding: '2px 6px', borderRadius: 4 }}>{u.institutionNumber}</code></td>
                            <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{u.email}</td>
                            <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{u.phone || '—'}</td>
                            <td><span className={`badge ${rb.cls}`}>{rb.label}</span></td>
                            <td>
                              <div className="admin-actions">
                                <button className="admin-btn admin-btn-edit" onClick={() => setModal(u)}>Edit</button>
                                <button
                                    className="admin-btn admin-btn-delete"
                                    onClick={() => handleDelete(u.id, `${u.firstName} ${u.lastName}`)}
                                    disabled={deleting === u.id}
                                >
                                  {deleting === u.id ? <span className="spinner" style={{ width: 12, height: 12 }} /> : <IconTrash size={12} />}
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
            )
        }

        {modal && (
            <UserModal
                user={modal === 'add' ? null : modal}
                onClose={() => setModal(null)}
                onSave={handleSave}
            />
        )}
      </div>
  );
}

// ── Appointments tab ──────────────────────────────────────────────────────
function AppointmentsTab({ appointments, loading, onRefresh }) {
  const [search, setSearch]     = useState('');
  const [statusFilter, setSF]   = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [deleting, setDel]      = useState(null);

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
        a.patientFirstName?.toLowerCase().includes(q) ||
        a.patientLastName?.toLowerCase().includes(q) ||
        a.patientInstitutionNumber?.includes(q) ||
        a.serviceType?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id, status) => {
    await adminApi.updateApptStatus(id, status);
    onRefresh();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment permanently?')) return;
    setDel(id);
    try { await adminApi.deleteAppt(id); onRefresh(); }
    catch (e) { alert(e.message); }
    finally { setDel(null); }
  };

  const quickAction = async (id, action) => {
    try {
      if (action === 'approve') await adminApi.approveAppt(id);
      else await adminApi.rejectAppt(id);
      onRefresh();
    } catch (e) { alert(e.message); }
  };

  return (
      <div>
        <div className="admin-toolbar">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
            <input
                className="admin-search"
                placeholder="Search by patient name, number or service…"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {['ALL','PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(s => (
                <button
                    key={s}
                    className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setSF(s)}
                    style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                  {s === 'PENDING' && appointments.filter(a => a.status === 'PENDING').length > 0 && (
                      <span style={{ marginLeft: 4, background: 'var(--warning)', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                  {appointments.filter(a => a.status === 'PENDING').length}
                </span>
                  )}
                </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onRefresh}><IconRefreshCw size={14} /> Refresh</button>
        </div>

        {loading
            ? <div className="loading-state"><div className="spinner" />Loading appointments…</div>
            : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Institution No.</th>
                      <th>Service</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No appointments found</td></tr>
                    )}
                    {filtered.map(a => {
                      const sb = STATUS_BADGE[a.status] || STATUS_BADGE.PENDING;
                      return (
                          <tr key={a.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>
                                {a.patientFirstName ? `${a.patientFirstName} ${a.patientLastName}` : 'Unknown'}
                              </div>
                            </td>
                            <td><code style={{ fontSize: 12, background: 'var(--gray-100)', padding: '2px 6px', borderRadius: 4 }}>{a.patientInstitutionNumber || '—'}</code></td>
                            <td style={{ fontSize: 13 }}>{(a.serviceType || '').replace(/_/g, ' ')}</td>
                            <td style={{ fontSize: 13 }}>
                              <div>{fmtDate(a.appointmentDate)}</div>
                              <div style={{ color: 'var(--gray-400)', fontSize: 11 }}>{fmtTime(a.appointmentTime)}</div>
                            </td>
                            <td><span className={`badge ${sb.cls}`}>{sb.label}</span></td>
                            <td>
                              <div className="admin-actions">
                                <button className="admin-btn admin-btn-edit" onClick={() => setSelected(a)}>View</button>
                                {a.status === 'PENDING' && (
                                    <>
                                      <button className="admin-btn admin-btn-approve" onClick={() => quickAction(a.id, 'approve')}>
                                        <IconCheckCircle size={11} /> Approve
                                      </button>
                                      <button className="admin-btn admin-btn-reject" onClick={() => quickAction(a.id, 'reject')}>
                                        Reject
                                      </button>
                                    </>
                                )}
                                <button
                                    className="admin-btn admin-btn-delete"
                                    onClick={() => handleDelete(a.id)}
                                    disabled={deleting === a.id}
                                >
                                  {deleting === a.id ? <span className="spinner" style={{ width: 12, height: 12 }} /> : <IconTrash size={12} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
            )
        }

        {selected && (
            <ApptModal
                appt={selected}
                onClose={() => setSelected(null)}
                onStatusChange={handleStatusChange}
            />
        )}
      </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',      label: 'Overview',     icon: IconLayoutDashboard },
  { id: 'appointments',  label: 'Appointments', icon: IconCalendar },
  { id: 'users',         label: 'Users',        icon: IconUsers },
];

export default function AdminPage() {
  const { user } = useAuth();

  // Guard: only ADMIN role
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  const [activeTab, setTab]           = useState('overview');
  const [users, setUsers]             = useState([]);
  const [appointments, setAppts]      = useState([]);
  const [stats, setStats]             = useState(null);
  const [loadingUsers, setLU]         = useState(false);
  const [loadingAppts, setLA]         = useState(false);
  const [loadingStats, setLS]         = useState(false);

  const loadAll = useCallback(async () => {
    setLS(true);
    setLU(true);
    setLA(true);
    try {
      const [s, u, a] = await Promise.all([
        adminApi.stats().catch(() => null),
        adminApi.getAllUsers().catch(() => []),
        adminApi.getAllAppointments().catch(() => []),
      ]);
      setStats(s);
      setUsers(Array.isArray(u) ? u : []);
      setAppts(Array.isArray(a) ? a : []);
    } finally {
      setLS(false); setLU(false); setLA(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;

  return (
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <div className="admin-sidebar-title">Admin Portal</div>
            <div className="admin-sidebar-sub">Mavuti Health Clinic</div>
          </div>

          {TABS.map(({ id, label, icon: Icon }) => (
              <button
                  key={id}
                  className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
                  onClick={() => setTab(id)}
              >
                <Icon size={16} />
                {label}
                {id === 'appointments' && pendingCount > 0 && (
                    <span style={{ marginLeft: 'auto', background: 'var(--warning)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                {pendingCount}
              </span>
                )}
              </button>
          ))}

          {/* Emergency at bottom of sidebar */}
          <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
              <IconPhone size={11} /> Emergency
            </div>
            <div style={{ color: 'var(--vut-gold)', fontWeight: 700, fontSize: 14 }}>(016) 950-9111</div>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-content">
          <div className="admin-content-inner">

            {activeTab === 'overview' && (
                <>
                  <h1 className="admin-page-title">Overview</h1>
                  <p className="admin-page-sub">
                    Welcome back, {user.firstName}. Here's a summary of the clinic platform.
                  </p>

                  <StatsTab stats={stats} loading={loadingStats} />

                  {/* Quick action: pending appointments */}
                  {pendingCount > 0 && (
                      <div style={{ marginTop: 24, padding: 20, background: 'var(--warning-bg)', border: '1px solid #fde047', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--warning)', fontSize: 'var(--text-sm)' }}>
                            ⏳ {pendingCount} appointment{pendingCount > 1 ? 's' : ''} waiting for approval
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', marginTop: 4 }}>
                            Review and approve or reject pending bookings
                          </div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => setTab('appointments')}>
                          <IconCalendar size={14} /> Review Now
                        </button>
                      </div>
                  )}

                  {/* Recent appointments preview */}
                  <div style={{ marginTop: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700 }}>Recent Appointments</h2>
                      <button className="btn btn-ghost btn-sm" onClick={() => setTab('appointments')}>View all →</button>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                        <tr><th>Patient</th><th>Service</th><th>Date</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                        {appointments.slice(0, 8).map(a => {
                          const sb = STATUS_BADGE[a.status] || STATUS_BADGE.PENDING;
                          return (
                              <tr key={a.id}>
                                <td style={{ fontWeight: 600 }}>{a.patientFirstName ? `${a.patientFirstName} ${a.patientLastName}` : a.patientInstitutionNumber || '—'}</td>
                                <td style={{ fontSize: 13 }}>{(a.serviceType || '').replace(/_/g, ' ')}</td>
                                <td style={{ fontSize: 13 }}>{fmtDate(a.appointmentDate)}</td>
                                <td><span className={`badge ${sb.cls}`}>{sb.label}</span></td>
                              </tr>
                          );
                        })}
                        {appointments.length === 0 && !loadingAppts && (
                            <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>No appointments yet</td></tr>
                        )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
            )}

            {activeTab === 'appointments' && (
                <>
                  <h1 className="admin-page-title">Appointments</h1>
                  <p className="admin-page-sub">Approve, reject, update or remove clinic bookings.</p>
                  <AppointmentsTab appointments={appointments} loading={loadingAppts} onRefresh={loadAll} />
                </>
            )}

            {activeTab === 'users' && (
                <>
                  <h1 className="admin-page-title">Users</h1>
                  <p className="admin-page-sub">Add students or staff who haven't registered yet, edit profiles, or remove accounts.</p>
                  <UsersTab users={users} loading={loadingUsers} onRefresh={loadAll} />
                </>
            )}

          </div>
        </main>
      </div>
  );
}