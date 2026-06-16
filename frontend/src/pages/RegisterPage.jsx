import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VUTLogo, IconAlertCircle, IconUser, IconUsers } from '../components/Icons';

const INITIAL = {
  firstName: '', lastName: '', email: '', phone: '',
  institutionNumber: '', password: '', confirmPassword: '', role: 'STUDENT',
};

export default function RegisterPage() {
  const [form, setForm]      = useState(INITIAL);
  const [error, setError]    = useState(null);
  const [submitting, setSub] = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
  const setRole = (role) => setForm(p => ({ ...p, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSub(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', padding: 'var(--s8) var(--s4)' }}>
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <VUTLogo size={52} />
          </div>
          <h2>Create your account</h2>
          <p>Join the VUT Health Clinic platform</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--s5)' }}>
            <IconAlertCircle size={16} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">I am a…</label>
            <div className="role-selector">
              <div
                className={`role-option ${form.role === 'STUDENT' ? 'selected' : ''}`}
                onClick={() => setRole('STUDENT')}
                role="radio"
                aria-checked={form.role === 'STUDENT'}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setRole('STUDENT')}
              >
                <IconUser size={24} style={{ margin: '0 auto', color: form.role === 'STUDENT' ? 'var(--vut-gold)' : 'var(--gray-400)' }} />
                <div className="role-label">Student</div>
                <div className="role-desc">Use your student number</div>
              </div>
              <div
                className={`role-option ${form.role === 'EMPLOYEE' ? 'selected' : ''}`}
                onClick={() => setRole('EMPLOYEE')}
                role="radio"
                aria-checked={form.role === 'EMPLOYEE'}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setRole('EMPLOYEE')}
              >
                <IconUsers size={24} style={{ margin: '0 auto', color: form.role === 'EMPLOYEE' ? 'var(--vut-gold)' : 'var(--gray-400)' }} />
                <div className="role-label">Employee</div>
                <div className="role-desc">Use your employee number</div>
              </div>
            </div>
          </div>

          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name</label>
              <input id="firstName" type="text" className="form-input"
                placeholder="Thabo" value={form.firstName} onChange={set('firstName')} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <input id="lastName" type="text" className="form-input"
                placeholder="Dlamini" value={form.lastName} onChange={set('lastName')} required />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input id="email" type="email" className="form-input"
              placeholder="thabo@vut.ac.za" value={form.email} onChange={set('email')}
              required autoComplete="email" />
          </div>

          {/* Phone (optional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input id="phone" type="tel" className="form-input"
              placeholder="+27 72 000 0000" value={form.phone} onChange={set('phone')} />
          </div>

          {/* Institution number */}
          <div className="form-group">
            <label className="form-label" htmlFor="instNum">
              {form.role === 'STUDENT' ? 'Student Number' : 'Employee Number'}
            </label>
            <input id="instNum" type="text" className="form-input"
              placeholder={form.role === 'STUDENT' ? 'e.g. 221386653' : 'e.g. 4557545664'}
              value={form.institutionNumber} onChange={set('institutionNumber')}
              required inputMode="numeric" />
          </div>

          {/* Passwords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="pw">Password</label>
              <input id="pw" type="password" className="form-input"
                placeholder="Min. 8 characters" value={form.password} onChange={set('password')}
                required autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pw2">Confirm Password</label>
              <input id="pw2" type="password" className="form-input"
                placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')}
                required autoComplete="new-password" />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={submitting}
          >
            {submitting
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account…</>
              : 'Create account'
            }
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
