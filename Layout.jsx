/* ─────────────────────────────────────────────────────────
   Layout.jsx — Main application layout with navigation
   ───────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Bell, User, ChevronDown, LogOut, Settings, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/policies',  label: 'Policies' },
    { path: '/claims',    label: 'Claims' },
    { path: '/support',   label: 'Support' },
];

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [scrolled, setScrolled]         = useState(false);
    const [mobileOpen, setMobileOpen]     = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen]       = useState(false);

    // Scroll listener
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setDropdownOpen(false);
        setNotifOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh' }}>

            {/* ── NAVBAR ─────────────────────────────── */}
            <nav
                className={`navbar ${scrolled ? 'scrolled' : ''}`}
                style={{ padding: '0 2rem' }}
            >
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '72px'
                }}>
                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
                    >
                        <Shield size={22} style={{ color: 'var(--insurai-accent)' }} />
                        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#f1f5f9', letterSpacing: '0.06em' }}>
                            INSURAI
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {NAV_ITEMS.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                        {/* Notification Bell */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    width: 40, height: 40,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#64748b',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Bell size={18} />
                            </button>
                            <AnimatePresence>
                                {notifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        style={{
                                            position: 'absolute', top: '52px', right: 0,
                                            width: 280, background: '#0a0d14',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
                                        }}
                                    >
                                        <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#475569', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>NOTIFICATIONS</p>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No new notifications</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Menu */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '14px',
                                    padding: '0.4rem 0.75rem 0.4rem 0.4rem',
                                    cursor: 'pointer', color: '#f1f5f9',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.8rem', fontWeight: 900, color: '#fff'
                                }}>
                                    {user?.avatarText || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="hide-mobile" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                                    {user?.name || 'User'}
                                </span>
                                <ChevronDown size={14} className="hide-mobile" style={{ color: '#475569' }} />
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        style={{
                                            position: 'absolute', top: '52px', right: 0,
                                            width: 220, background: '#0a0d14',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '16px',
                                            padding: '0.5rem',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
                                        }}
                                    >
                                        {[
                                            { icon: User,     label: 'Profile',     action: () => navigate('/profile') },
                                            { icon: FileText, label: 'My Policies', action: () => navigate('/profile', { state: { tab: 'policies' } }) },
                                            { icon: Settings, label: 'Settings',    action: () => navigate('/profile', { state: { tab: 'security' } }) },
                                        ].map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { item.action(); setDropdownOpen(false); }}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.7rem 0.9rem',
                                                    background: 'transparent', border: 'none', borderRadius: '10px',
                                                    cursor: 'pointer', color: '#94a3b8',
                                                    fontSize: '0.85rem', fontWeight: 600,
                                                    fontFamily: 'var(--font-main)',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#f1f5f9'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                                            >
                                                <item.icon size={16} /> {item.label}
                                            </button>
                                        ))}
                                        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0.3rem 0' }} />
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                padding: '0.7rem 0.9rem',
                                                background: 'transparent', border: 'none', borderRadius: '10px',
                                                cursor: 'pointer', color: '#ef4444',
                                                fontSize: '0.85rem', fontWeight: 600,
                                                fontFamily: 'var(--font-main)',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="show-mobile-only"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#f1f5f9', padding: '0.25rem'
                            }}
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{
                                overflow: 'hidden',
                                borderTop: '1px solid rgba(255,255,255,0.03)',
                                padding: '0.5rem 1rem 1rem',
                                background: 'rgba(2,4,8,0.98)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            {NAV_ITEMS.map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        display: 'block',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        color: location.pathname === item.path ? '#f1f5f9' : '#64748b',
                                        background: location.pathname === item.path ? 'rgba(255,255,255,0.05)' : 'transparent',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* ── MAIN CONTENT ──────────────────────────── */}
            <main style={{ paddingTop: '72px' }}>
                {children}
            </main>
        </div>
    );
}
