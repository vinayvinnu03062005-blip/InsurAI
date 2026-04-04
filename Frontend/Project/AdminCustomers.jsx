/* ─────────────────────────────────────────────────────────
   AdminCustomers.jsx — Admin customer management
   ───────────────────────────────────────────────────────── */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, PlusCircle, Trash2, X, LogOut, ArrowLeft, CheckCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

export default function AdminCustomers() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { allCustomers, addCustomer, deleteCustomer } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', email: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        addCustomer(form);
        setShowModal(false);
        setForm({ name: '', email: '' });
    };

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
                        <Link to="/admin/customers" className="nav-link active">Customers</Link>
                        <button onClick={() => { logout(); navigate('/admin-login'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '0.5rem 1rem', cursor: 'pointer', color: '#f87171', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-main)' }}>
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>

                {/* Header */}
                <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                            <ArrowLeft size={14} /> Back to Dashboard
                        </motion.button>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em' }}>
                            Customer <span style={{ color: '#8b5cf6' }}>Database.</span>
                        </motion.h1>
                    </div>
                    <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="btn-primary">
                        ADD CUSTOMER <PlusCircle size={18} />
                    </motion.button>
                </header>

                {/* Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    {['ID', 'Name', 'Email', 'Status', 'Policies', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.15em', color: '#475569', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allCustomers.map((c, i) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'all 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#475569' }}>#{c.id}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{c.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#64748b' }}>{c.email}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '0.25rem 0.6rem', borderRadius: '100px',
                                                background: c.status === 'Active' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                                                border: `1px solid ${c.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                                                color: c.status === 'Active' ? '#34d399' : '#f87171',
                                            }}>{c.status}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 950, fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{c.policies}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <motion.button
                                                onClick={() => deleteCustomer(c.id)}
                                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f87171' }}
                                            >
                                                <Trash2 size={14} />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {allCustomers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <Users size={42} style={{ color: '#1e293b', marginBottom: '1rem' }} />
                            <p style={{ color: '#64748b', fontWeight: 700 }}>No customers in the registry</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Add Customer Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,4,8,0.95)', backdropFilter: 'blur(20px)', padding: '1rem' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', padding: '2.5rem', maxWidth: 450, width: '100%', position: 'relative' }}
                        >
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={22} /></button>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 950, letterSpacing: '-0.03em', marginBottom: '2rem' }}>Add <span style={{ color: '#8b5cf6' }}>Customer.</span></h2>
                            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="input-group"><label>Full Name</label><input className="input-field" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Aarav Sharma" /></div>
                                <div className="input-group"><label>Email Address</label><input type="email" className="input-field" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. aarav@example.com" /></div>
                                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                                    ADD TO REGISTRY <UserCheck size={16} />
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
