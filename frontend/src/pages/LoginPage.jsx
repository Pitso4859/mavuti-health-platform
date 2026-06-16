import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconAlertCircle } from '../components/Icons';

// Login options matching the VUTela toggle (screenshot images)
const LOGIN_OPTIONS = [
  {
    id: 'STUDENT',
    icon: '🎓',
    label: 'VUT – Student Login',
    subtitle: 'Login with your student number & password',
    placeholder: 'Student number e.g. 221386653',
  },
  {
    id: 'EMPLOYEE',
    icon: '🏫',
    label: 'VUT – Instructor / Staff Login',
    subtitle: 'Login with your employee number & password',
    placeholder: 'Employee number e.g. 4557545664',
  },
  {
    id: 'ADMIN',
    icon: '🔐',
    label: 'Admin Login',
    subtitle: 'System administrator access',
    placeholder: 'Admin number',
  },
];

export default function LoginPage() {
  const [selected, setSelected] = useState(null); // which toggle was clicked
  const [form, setForm]         = useState({ institutionNumber: '', password: '' });
  const [error, setError]       = useState(null);
  const [submitting, setSub]    = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/dashboard';

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSelect = (opt) => {
    setSelected(opt);
    setForm({ institutionNumber: '', password: '' });
    setError(null);
  };

  const handleBack = () => {
    setSelected(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSub(true);
    try {
      await login(form.institutionNumber.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="vutela-page">
      {/* Left — campus photo background */}
      <div className="vutela-bg" />

      {/* Right — login panel */}
      <div className="vutela-panel">
        {/* VUT Logo (real PNG from screenshots) */}
        <div className="vutela-logo-wrap">
          <img
            src="/images/vut_logo.png"
            alt="Vaal University of Technology"
            className="vutela-logo-img"
          />
        </div>

        <div className="vutela-brand">
          <h1 className="vutela-title">Mavuti Health Clinic</h1>
          <p className="vutela-sub">Vaal University of Technology</p>
          <p className="vutela-tagline">Inspiring thought. Shaping talent.</p>
        </div>

        {!selected ? (
          /* ── Toggle selector — like VUTela dropdown ── */
          <div className="vutela-selector">
            <p className="vutela-selector-label">Sign in with your VUT account</p>

            {LOGIN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className="vutela-option-btn"
                onClick={() => handleSelect(opt)}
                type="button"
              >
                <span className="vutela-option-icon">{opt.icon}</span>
                <span className="vutela-option-text">
                  <span className="vutela-option-label">{opt.label}</span>
                  <span className="vutela-option-sub">{opt.subtitle}</span>
                </span>
                <span className="vutela-option-arrow">›</span>
              </button>
            ))}

            <div className="vutela-divider">
              <span>New to the platform?</span>
            </div>
            <Link to="/register" className="vutela-register-btn">
              Create an account
            </Link>
          </div>
        ) : (
          /* ── Login form for selected role ── */
          <div className="vutela-form-wrap">
            <button className="vutela-back-btn" onClick={handleBack} type="button">
              ‹ Back
            </button>

            <div className="vutela-form-header">
              <span style={{ fontSize: 32 }}>{selected.icon}</span>
              <div>
                <h2 className="vutela-form-title">{selected.label}</h2>
                <p className="vutela-form-sub">{selected.subtitle}</p>
              </div>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: 16 }}>
                <IconAlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="instNum">
                  {selected.id === 'STUDENT' ? 'Student Number' :
                   selected.id === 'EMPLOYEE' ? 'Employee Number' : 'Admin Number'}
                </label>
                <input
                  id="instNum"
                  type="text"
                  className="form-input"
                  placeholder={selected.placeholder}
                  value={form.institutionNumber}
                  onChange={set('institutionNumber')}
                  required
                  autoFocus
                  inputMode="numeric"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pw">Password</label>
                <input
                  id="pw"
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set('password')}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ padding: '14px', fontSize: '1rem', marginTop: 4 }}
                disabled={submitting || !form.institutionNumber || !form.password}
              >
                {submitting
                  ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in…</>
                  : `Sign in as ${selected.id === 'STUDENT' ? 'Student' : selected.id === 'EMPLOYEE' ? 'Staff' : 'Admin'}`
                }
              </button>
            </form>

            {import.meta.env.DEV && (
              <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,51,160,0.06)', borderRadius: 8, fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.7 }}>
                <strong>Dev:</strong> Student: <code>221386653</code> / <code>Student@123</code><br />
                Employee: <code>4557545664</code> / <code>Employee@123</code>
              </div>
            )}
          </div>
        )}

        <div className="vutela-footer">
          <p>© {new Date().getFullYear()} Vaal University of Technology · Health Clinic Platform</p>
        </div>
      </div>
    </div>
  );
}
