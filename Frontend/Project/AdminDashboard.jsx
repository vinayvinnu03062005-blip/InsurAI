/* ─────────────────────────────────────────────────────────
   AdminDashboard.jsx — Admin command center
   ───────────────────────────────────────────────────────── */

import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, Users, Activity, LogOut, Database, Server, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } };
const fadeItem = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { allPolicies, allCustomers } = useAppContext();

    const modules = [
        { icon: FileText, title: 'Policy Management', desc: `${allPolicies.length} insurance products live`,       path: '/admin/policies',  color: '#0ea5e9' },
        { icon: Users,    title: 'Customer Database',  desc: `${allCustomers.length} registered customers`,       path: '/admin/customers', color: '#8b5cf6' },
        { icon: Activity, title: 'Server Health',      desc: 'Infrastructure fully operational',               path: null,               color: '#10b981' },
    ];

    const stats = [
        { label: 'Total Policies',  value: allPolicies.length,  icon: Database, color: '#0ea5e9' },
        { label: 'Active Users',    value: allCustomers.length, icon: Users,    color: '#8b5cf6' },
        { label: 'System Health',   value: '99.9%',             icon: Activity, color: '#10b981' },
        { label: 'Server Load',     value: 'Minimal',           icon: Server,   color: '#f59e0b' },
    ];

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Admin Navbar */}
            <nav className="navbar scrolled" style={{ padding: '0 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
                    <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                        <Shield size={22} style={{ color: '#ef4444' }} />
                        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#f1f5f9', letterSpacing: '0.06em' }}>INSURAI</span>
                        <span style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.2em', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.25rem 0.6rem', borderRadius: '100px', border: '1px solid rgba(239,68,68,0.2)' }}>ADMIN</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/admin/policies" className="nav-link">Policies</Link>
                        <Link to="/admin/customers" className="nav-link">Customers</Link>
                        <button onClick={() => { logout(); navigate('/admin-login'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '0.5rem 1rem', cursor: 'pointer', color: '#f87171', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-main)' }}>
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>

                {/* Header */}
                <header style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.4em', color: '#ef4444', textTransform: 'uppercase' }}>Admin Central Command</span>
                        <div style={{ width: 40, height: 1, background: 'rgba(239,68,68,0.3)' }} />
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em' }}>
                        Operation <span style={{ color: '#ef4444' }}>Monitor.</span>
                    </motion.h1>
                </header>

                {/* Stats */}
                <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                    {stats.map(s => (
                        <motion.div key={s.label} variants={fadeItem} whileHover={{ y: -4 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '24px', transition: 'all 0.3s' }}>
                            <div style={{ color: s.color, marginBottom: '0.75rem' }}><s.icon size={20} /></div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 950, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{s.label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 950 }}>{s.value}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Module Cards */}
                <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {modules.map(m => (
                        <motion.div
                            key={m.title}
                            variants={fadeItem}
                            whileHover={{ y: -6, borderColor: `${m.color}33` }}
                            onClick={() => m.path && navigate(m.path)}
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '24px',
                                padding: '2rem',
                                cursor: m.path ? 'pointer' : 'default',
                                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                            }}
                        >
                            <div style={{ width: 48, height: 48, borderRadius: '16px', background: `${m.color}12`, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: m.color }}>
                                <m.icon size={22} />
                            </div>
                            <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{m.title}</h3>
                            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>{m.desc}</p>
                            {m.path && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: m.color, fontSize: '0.75rem', fontWeight: 800 }}>
                                    Open Registry <ArrowRight size={14} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
