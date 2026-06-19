import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    IconAlertCircle,
    IconGraduationCap,
    IconBriefcase,
    IconShield,
    IconChevronDown,
    IconChevronUp,
    IconCheck,
    IconUser,
} from '../components/Icons';

/* ─── Role definitions ────────────────────────────────────── */
const LOGIN_OPTIONS = [
    {
        id: 'STUDENT',
        Icon: IconGraduationCap,
        label: 'VUT – Student Login',
        subtitle: 'Login with your student number & password',
        placeholder: 'Student number e.g. 221386653',
        fieldLabel: 'Student Number',
        color: '#0033a0',
        bg:    '#0033a0',
    },
    {
        id: 'EMPLOYEE',
        Icon: IconBriefcase,
        label: 'VUT – Instructor / Staff Login',
        subtitle: 'Login with your employee number & password',
        placeholder: 'Employee number e.g. 4557545664',
        fieldLabel: 'Employee Number',
        color: '#1a6b3c',
        bg:    '#1a6b3c',
    },
    {
        id: 'ADMIN',
        Icon: IconShield,
        label: 'System Administrator',
        subtitle: 'System Administrator',
        placeholder: 'Admin number',
        fieldLabel: 'Admin Number',
        color: '#b45309',
        bg:    '#b45309',
    },
];

/* ─── Dropdown ────────────────────────────────────────────── */
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
              Account type
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
                    {LOGIN_OPTIONS.map((opt) => {
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
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                <span style={{
                    width: 38, height: 38,
                    borderRadius: '50%',
                    background: opt.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                  <opt.Icon size={18} style={{ color: '#fff' }} />
                </span>
                                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1a2338', lineHeight: 1.3 }}>
                    {opt.label}
                  </span>
                  <span style={{ display: 'block', fontSize: 12, color: '#9baac4', marginTop: 1 }}>
                    {opt.subtitle}
                  </span>
                </span>
                                {active && (
                                    <IconCheck size={17} style={{ color: '#0033a0', flexShrink: 0 }} />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

/* ─── LoginPage ───────────────────────────────────────────── */
export default function LoginPage() {
    const [selected, setSelected] = useState(null);
    const [form, setForm]         = useState({ institutionNumber: '', password: '' });
    const [error, setError]       = useState(null);
    const [submitting, setSub]    = useState(false);
    const [showForm, setShowForm] = useState(false);

    const { login } = useAuth();
    const navigate  = useNavigate();
    const location  = useLocation();
    const from      = location.state?.from?.pathname || '/dashboard';

    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleRoleChange = (opt) => {
        setSelected(opt);
        setForm({ institutionNumber: '', password: '' });
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
        if (!selected) { setError('Please select your account type first.'); return; }
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
        /* ── Full-screen background ── */
        <div style={{
            minHeight: '100vh',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#001f62',
        }}>

            {/* ── VUT building fills the ENTIRE screen ── */}
            <img
                src="/images/vut-building-exterior.svg"
                alt="Vaal University of Technology campus"
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                }}
            />

            {/* ── Dark overlay over the whole screen ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(0,20,80,0.78) 0%, rgba(0,10,40,0.65) 60%, rgba(0,31,98,0.80) 100%)',
            }} />

            {/* ── VUT name bottom-left watermark ── */}
            <div style={{
                position: 'absolute',
                bottom: 40,
                left: 48,
                zIndex: 1,
                textAlign: 'left',
            }}>
                <p style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.3,
                    margin: 0,
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}>
                    Vaal University<br />of Technology
                </p>
                {/* Gold underline accent */}
                <div style={{ width: 48, height: 3, background: '#FFD100', marginTop: 8, borderRadius: 2 }} />
            </div>

            {/* ── Centred login card ── */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: 460,
                margin: '0 auto',
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
                padding: '44px 40px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                maxHeight: '92vh',
                overflowY: 'auto',
            }}>

                {/* VUT logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                    <img
                        src="/images/vut-logo-gold-blue.svg"
                        alt="VUT logo"
                        style={{ width: 64, height: 64, objectFit: 'contain' }}
                    />
                </div>

                {/* Brand heading */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: '#0a0a0a',
                        lineHeight: 1.2,
                        marginBottom: 4,
                    }}>
                        Mavuti Health Clinic
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#0033a0',
                        marginBottom: 4,
                    }}>
                        Vaal University of Technology
                    </p>
                    <p style={{ fontSize: 13, color: '#9baac4', fontStyle: 'italic' }}>
                        Inspiring thought. Shaping talent.
                    </p>
                </div>

                {/* ── Main content ── */}
                {!showForm ? (
                    /* Step 1 — role selector */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                        <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 500, color: '#4a5878', marginBottom: 16 }}>
                            Sign in with your VUT account
                        </p>

                        <RoleDropdown selected={selected} onChange={handleRoleChange} />

                        {error && (
                            <div className="alert alert-error" style={{ marginTop: 14 }}>
                                <IconAlertCircle size={16} />{error}
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: 28 }}>
                            <p style={{ textAlign: 'center', fontSize: 13, color: '#9baac4', marginBottom: 14 }}>
                                -- New to the platform? --
                            </p>
                            <Link
                                to="/register"
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
                                Create an account
                            </Link>
                        </div>
                    </div>

                ) : (
                    /* Step 2 — login form */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
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

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '12px 16px',
                            background: '#f0f4ff',
                            borderRadius: 10,
                            borderLeft: '3px solid #0033a0',
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
                                    {selected.label}
                                </p>
                                <p style={{ fontSize: 12, color: '#9baac4', marginTop: 2 }}>
                                    {selected.subtitle}
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <IconAlertCircle size={16} />{error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="instNum">{selected.fieldLabel}</label>
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
                                    : 'Sign in'
                                }
                            </button>
                        </form>

                        {import.meta.env.DEV && (
                            <div style={{
                                marginTop: 8, padding: '10px 14px',
                                background: 'rgba(0,51,160,0.05)',
                                border: '1px dashed #d1d9ec',
                                borderRadius: 8, fontSize: 11,
                                color: '#6b7d9e', lineHeight: 1.7,
                            }}>
                                <strong>Dev —</strong> Student: <code>221386653</code> / <code>Student@123</code><br />
                                Employee: <code>4557545664</code> / <code>Employee@123</code>
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 16 }}>
                            <span style={{ fontSize: 13, color: '#9baac4' }}>New here? </span>
                            <Link to="/register" style={{ fontSize: 13, color: '#0033a0', fontWeight: 600 }}>
                                Create an account
                            </Link>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: '#c8cfe0' }}>
                    © {new Date().getFullYear()} Vaal University of Technology · Health Clinic Platform
                </div>
            </div>
        </div>
    );
}