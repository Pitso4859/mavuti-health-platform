import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconAlertCircle,
  IconGraduationCap,
  IconBriefcase,
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconUser,
  VUTLogo,
} from '../components/Icons';

/* ─── Role definitions (mirrors LoginPage) ───────────────── */
const REGISTER_OPTIONS = [
  {
    id: 'STUDENT',
    Icon: IconGraduationCap,
    label: 'Student',
    subtitle: 'Register with your student number',
    placeholder: 'e.g. 221386653',
    fieldLabel: 'Student Number',
    color: '#0033a0',
    bg: '#0033a0',
  },
  {
    id: 'EMPLOYEE',
    Icon: IconBriefcase,
    label: 'Employee / Instructor',
    subtitle: 'Register with your employee number',
    placeholder: 'e.g. 4557545664',
    fieldLabel: 'Employee Number',
    color: '#1a6b3c',
    bg: '#1a6b3c',
  },
];

const INITIAL = {
  firstName: '', lastName: '', email: '', phone: '',
  institutionNumber: '', password: '', confirmPassword: '',
};

/* ─── Shared dropdown (same component as LoginPage) ─────── */
function RoleDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const pick = (opt) => { onChange(opt); setOpen(false); };

  return (
      <div ref={wrapRef} style={{ position: 'relative' }}>

        {/* ── Trigger ── */}
        <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '0 16px',
              height: 52,
              background: '#fff',
              border: `1.5px solid ${open ? '#0033a0' : '#d1d9ec'}`,
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: open ? '0 0 0 3px rgba(0,51,160,0.13)' : 'none',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
        >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <IconUser size={16} style={{ color: '#9baac4', flexShrink: 0 }} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: 10, color: '#9baac4', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              I am a…
            </span>
            <span style={{ fontSize: 14, color: selected ? '#1a2338' : '#9baac4', fontWeight: selected ? 500 : 400 }}>
              {selected ? selected.label : 'Select your account type…'}
            </span>
          </span>
        </span>
          {open
              ? <IconChevronUp  size={18} style={{ color: '#9baac4', flexShrink: 0 }} />
              : <IconChevronDown size={18} style={{ color: '#9baac4', flexShrink: 0 }} />
          }
        </button>

        {/* ── List ── */}
        {open && (
            <ul
                role="listbox"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0, right: 0,
                  background: '#fff',
                  border: '1.5px solid #0033a0',
                  borderRadius: 10,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                  zIndex: 700,
                  listStyle: 'none',
                  margin: 0,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
            >
              {REGISTER_OPTIONS.map((opt) => {
                const active = selected?.id === opt.id;
                return (
                    <li
                        key={opt.id}
                        role="option"
                        aria-selected={active}
                        tabIndex={0}
                        onClick={() => pick(opt)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(opt)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '10px 12px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: active ? '#f0f4ff' : 'transparent',
                          outline: 'none',
                          transition: 'background 120ms',
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f7f9ff'; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? '#f0f4ff' : 'transparent'; }}
                    >
                      {/* Coloured circle icon */}
                      <span style={{
                        width: 38, height: 38,
                        borderRadius: '50%',
                        background: opt.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                  <opt.Icon size={18} style={{ color: '#fff' }} />
                </span>

                      {/* Text */}
                      <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1a2338', lineHeight: 1.3 }}>
                    {opt.label}
                  </span>
                  <span style={{ display: 'block', fontSize: 12, color: '#9baac4', marginTop: 1 }}>
                    {opt.subtitle}
                  </span>
                </span>

                      {/* Checkmark */}
                      {active && <IconCheck size={17} style={{ color: '#0033a0', flexShrink: 0 }} />}
                    </li>
                );
              })}
            </ul>
        )}
      </div>
  );
}

/* ─── Shared input field ─────────────────────────────────── */
function Field({ id, label, type = 'text', placeholder, value, onChange, required, hint, autoComplete, inputMode }) {
  return (
      <div className="form-group">
        <label className="form-label" htmlFor={id}>
          {label}
          {hint && <span style={{ color: '#9baac4', fontWeight: 400, fontSize: 12, marginLeft: 4 }}>{hint}</span>}
        </label>
        <input
            id={id}
            type={type}
            className="form-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            autoComplete={autoComplete}
            inputMode={inputMode}
        />
      </div>
  );
}

/* ─── RegisterPage ───────────────────────────────────────── */
export default function RegisterPage() {
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(INITIAL);
  const [error, setError]       = useState(null);
  const [submitting, setSub]    = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleRoleChange = (opt) => {
    setSelected(opt);
    setForm({ ...INITIAL, institutionNumber: '' });
    setError(null);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelected(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selected) { setError('Please select your account type first.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setSub(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register({ ...payload, role: selected.id });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSub(false);
    }
  };

  return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        background: '#fff',
      }}>

        {/* ════ LEFT — campus panel (identical to LoginPage) ════ */}
        <div style={{
          flex: 1,
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0033a0 0%, #001f62 55%, #FFD100 140%)',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(255,209,0,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(0,20,80,0.5) 0%, transparent 60%)
          `,
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}>
            <img
                src="/images/vut_logo.png"
                alt=""
                aria-hidden="true"
                style={{
                  width: 160,
                  opacity: 0.92,
                  filter: 'brightness(0) invert(1)',
                  userSelect: 'none',
                }}
            />
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.45rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                lineHeight: 1.25,
              }}>
                Vaal University<br />of Technology
              </p>
            </div>

            {/* Extra info shown on the left panel for register page */}
            <div style={{
              marginTop: 24,
              padding: '20px 28px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.15)',
              maxWidth: 320,
              textAlign: 'center',
            }}>
              <p style={{ color: '#FFD100', fontWeight: 700, fontSize: 13, marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Create your account
              </p>
              {[
                'Book clinic appointments online',
                'Access your health records',
                'Chat with AI health assistant',
                'Receive appointment reminders',
              ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, textAlign: 'left' }}>
                <span style={{
                  width: 18, height: 18,
                  background: '#FFD100',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <IconCheck size={11} style={{ color: '#0033a0' }} />
                </span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{item}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════ RIGHT — register panel ════ */}
        <div style={{
          width: 480,
          minHeight: '100vh',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: '40px 44px 28px',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          overflowY: 'auto',
          flexShrink: 0,
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <img
                src="/images/vut_logo.png"
                alt="Vaal University of Technology"
                style={{
                  height: 64,
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) saturate(100%) invert(14%) sepia(80%) saturate(2000%) hue-rotate(210deg)',
                }}
            />
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#0a0a0a',
              lineHeight: 1.2,
              marginBottom: 4,
            }}>
              Mavuti Health Clinic
            </h1>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#0033a0',
              marginBottom: 4,
            }}>
              Vaal University of Technology
            </p>
            <p style={{ fontSize: 13, color: '#9baac4', fontStyle: 'italic' }}>
              Create your account to get started
            </p>
          </div>

          {/* ── Main content ── */}
          {!showForm ? (

              /* ════ Step 1: role selector ════ */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                <p style={{
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#4a5878',
                  marginBottom: 16,
                }}>
                  Who are you registering as?
                </p>

                <RoleDropdown selected={selected} onChange={handleRoleChange} />

                {error && (
                    <div className="alert alert-error" style={{ marginTop: 14 }}>
                      <IconAlertCircle size={16} />{error}
                    </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: 32 }}>
                  <p style={{
                    textAlign: 'center',
                    fontSize: 13,
                    color: '#9baac4',
                    marginBottom: 14,
                  }}>
                    -- Already have an account? --
                  </p>
                  <Link
                      to="/login"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '14px',
                        background: '#0033a0',
                        borderRadius: 10,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 15,
                        textDecoration: 'none',
                        transition: 'background 150ms',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#001f62'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0033a0'}
                  >
                    Sign in instead
                  </Link>
                </div>
              </div>

          ) : (

              /* ════ Step 2: registration form ════ */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

                {/* Back button */}
                <button
                    type="button"
                    onClick={handleBack}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: 'none',
                      color: '#0033a0',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: 4,
                    }}
                >
                  ‹ Back
                </button>

                {/* Selected role header — mirrors LoginPage */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  background: '#f0f4ff',
                  borderRadius: 10,
                  borderLeft: `3px solid ${selected.color}`,
                  marginBottom: 4,
                }}>
              <span style={{
                width: 38, height: 38,
                borderRadius: '50%',
                background: selected.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <selected.Icon size={18} style={{ color: '#fff' }} />
              </span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1a2338', lineHeight: 1.2 }}>
                      {selected.label} Registration
                    </p>
                    <p style={{ fontSize: 12, color: '#9baac4', marginTop: 2 }}>
                      {selected.subtitle}
                    </p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-error">
                      <IconAlertCircle size={16} />{error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }} noValidate>

                  {/* Name row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field
                        id="firstName" label="First Name"
                        placeholder="Thabo" value={form.firstName}
                        onChange={set('firstName')} required
                    />
                    <Field
                        id="lastName" label="Last Name"
                        placeholder="Dlamini" value={form.lastName}
                        onChange={set('lastName')} required
                    />
                  </div>

                  {/* Email */}
                  <Field
                      id="email" label="Email Address" type="email"
                      placeholder="thabo@vut.ac.za" value={form.email}
                      onChange={set('email')} required autoComplete="email"
                  />

                  {/* Phone */}
                  <Field
                      id="phone" label="Phone Number" type="tel"
                      hint="(optional)"
                      placeholder="+27 72 000 0000" value={form.phone}
                      onChange={set('phone')}
                  />

                  {/* Institution number */}
                  <Field
                      id="instNum"
                      label={selected.fieldLabel}
                      placeholder={selected.placeholder}
                      value={form.institutionNumber}
                      onChange={set('institutionNumber')}
                      required inputMode="numeric"
                  />

                  {/* Passwords row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field
                        id="pw" label="Password" type="password"
                        placeholder="Min. 8 characters" value={form.password}
                        onChange={set('password')} required autoComplete="new-password"
                    />
                    <Field
                        id="pw2" label="Confirm Password" type="password"
                        placeholder="Repeat password" value={form.confirmPassword}
                        onChange={set('confirmPassword')} required autoComplete="new-password"
                    />
                  </div>

                  <button
                      type="submit"
                      className="btn btn-primary btn-full"
                      style={{ padding: '14px', fontSize: '1rem', marginTop: 4 }}
                      disabled={submitting || !form.firstName || !form.institutionNumber || !form.password || !form.confirmPassword}
                  >
                    {submitting
                        ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account…</>
                        : 'Create account'
                    }
                  </button>
                </form>

                <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 12 }}>
                  <span style={{ fontSize: 13, color: '#9baac4' }}>Already have an account? </span>
                  <Link to="/login" style={{ fontSize: 13, color: '#0033a0', fontWeight: 600 }}>
                    Sign in
                  </Link>
                </div>
              </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 11,
            color: '#c8cfe0',
          }}>
            © {new Date().getFullYear()} Vaal University of Technology · Health Clinic Platform
          </div>
        </div>
      </div>
  );
}
