import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconMenu, IconX, IconUser, IconLogOut,
  IconLayoutDashboard, IconCalendar, IconShield,
} from './Icons';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false); };
  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">

        {/* Brand — real VUT logo PNG */}
        <Link to={isAdmin ? '/admin' : '/'} className="navbar-brand" onClick={close}>
          <img
            src="/images/vut_logo.png"
            alt="VUT"
            style={{
              height: 42,
              width: 'auto',
              filter: 'invert(1) brightness(0) saturate(100%) invert(14%) sepia(80%) saturate(2000%) hue-rotate(210deg)',
            }}
          />
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">Mavuti Health</span>
            <span className="navbar-brand-sub">VUT Clinic Platform</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        {!isAdmin && (
          <ul className="navbar-nav" role="list">
            <li><NavLink to="/"         className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink></li>
            <li><NavLink to="/services" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Services</NavLink></li>
            <li><NavLink to="/contact"  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Contact</NavLink></li>
          </ul>
        )}

        {isAdmin && (
          <ul className="navbar-nav" role="list">
            <li><NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <IconShield size={14} /> Admin Portal
            </NavLink></li>
          </ul>
        )}

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <NavLink to="/appointment" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}>
                    <IconCalendar size={14} /> Book
                  </NavLink>
                  <NavLink to="/dashboard" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
                    <IconLayoutDashboard size={14} /> Dashboard
                  </NavLink>
                </>
              )}
              <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>
                {user?.firstName}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Sign out">
                <IconLogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <IconUser size={14} /> Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <ul className="navbar-nav open" role="list">
            {isAdmin ? (
              <li><NavLink to="/admin" onClick={close} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><IconShield size={14} /> Admin Portal</NavLink></li>
            ) : (
              <>
                <li><NavLink to="/"         onClick={close} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink></li>
                <li><NavLink to="/services" onClick={close} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Services</NavLink></li>
                <li><NavLink to="/contact"  onClick={close} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Contact</NavLink></li>
                {isAuthenticated && (
                  <>
                    <li><NavLink to="/appointment" onClick={close} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><IconCalendar size={14} /> Book Appointment</NavLink></li>
                    <li><NavLink to="/dashboard"   onClick={close} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><IconLayoutDashboard size={14} /> Dashboard</NavLink></li>
                  </>
                )}
              </>
            )}
          </ul>
          <div className="navbar-actions open">
            {isAuthenticated
              ? <button className="btn btn-outline btn-full" onClick={handleLogout}><IconLogOut size={15} /> Sign out</button>
              : <>
                  <Link to="/login"    className="btn btn-outline btn-full" onClick={close}>Sign in</Link>
                  <Link to="/register" className="btn btn-primary btn-full" onClick={close}>Register</Link>
                </>
            }
          </div>
        </>
      )}
    </nav>
  );
}
