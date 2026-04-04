/* ─────────────────────────────────────────────────────────
   AdminPolicies.jsx — Admin policy management
   ───────────────────────────────────────────────────────── */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, PlusCircle, Trash2, X, LogOut, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

export default function AdminPolicies() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { allPolicies, addPolicy, deletePolicy } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', premium: '', type: 'Health', risk: 'Low', claimAmount: '', description: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        addPolicy(form);
        setShowModal(false);
        setForm({ name: '', premium: '', type: 'Health', risk: 'Low', claimAmount: '', description: '' });
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
                        <Link to="/admin/policies" className="nav-link active">Policies</Link>
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
                <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                            <ArrowLeft size={14} /> Back to Dashboard
                        </motion.button>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em' }}>
                            Policy <span style={{ color: '#0ea5e9' }}>Management.</span>
                        </motion.h1>
                    </div>
                    <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="btn-primary">
                        ADD POLICY <PlusCircle size={18} />
                    </motion.button>
                </header>

                {/* Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    {['ID', 'Policy Name', 'Type', 'Premium', 'Risk', 'Coverage', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.15em', color: '#475569', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allPolicies.map((p, i) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'all 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#475569' }}>#{p.id}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 800, fontSize: '0.9rem' }}>{p.name}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '0.25rem 0.6rem', borderRadius: '100px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)', color: '#0ea5e9' }}>{p.type}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: '#94a3b8' }}>{p.premium}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '0.25rem 0.6rem', borderRadius: '100px',
                                                background: p.risk === 'Low' ? 'rgba(16,185,129,0.08)' : p.risk === 'Medium' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
                                                border: `1px solid ${p.risk === 'Low' ? 'rgba(16,185,129,0.15)' : p.risk === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'}`,
                                                color: p.risk === 'Low' ? '#34d399' : p.risk === 'Medium' ? '#fbbf24' : '#f87171',
                                            }}>{p.risk}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{p.claimAmount || '—'}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <motion.button
                                                onClick={(e) => { e.stopPropagation(); deletePolicy(p.id); }}
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
                    {allPolicies.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <FileText size={42} style={{ color: '#1e293b', marginBottom: '1rem' }} />
                            <p style={{ color: '#64748b', fontWeight: 700 }}>No policies in the registry</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Add Policy Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,4,8,0.95)', backdropFilter: 'blur(20px)', padding: '1rem' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', padding: '2.5rem', maxWidth: 500, width: '100%', position: 'relative' }}
                        >
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={22} /></button>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 950, letterSpacing: '-0.03em', marginBottom: '2rem' }}>Add <span className="text-gradient">Policy.</span></h2>
                            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="input-group"><label>Policy Name</label><input className="input-field" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. CyberShield Pro" /></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group"><label>Premium</label><input className="input-field" required value={form.premium} onChange={e => setForm({ ...form, premium: e.target.value })} placeholder="₹1,500/mo" /></div>
                                    <div className="input-group"><label>Coverage</label><input className="input-field" value={form.claimAmount} onChange={e => setForm({ ...form, claimAmount: e.target.value })} placeholder="₹10,00,000" /></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label>Type</label>
                                        <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ appearance: 'none' }}>
                                            {['Health', 'Auto', 'Home', 'Life', 'Travel', 'Business'].map(t => <option key={t} value={t} style={{ background: '#0a0d14' }}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Risk Level</label>
                                        <select className="input-field" value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value })} style={{ appearance: 'none' }}>
                                            {['Low', 'Medium', 'High'].map(r => <option key={r} value={r} style={{ background: '#0a0d14' }}>{r}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="input-group"><label>Description</label><textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief policy description..." style={{ resize: 'none' }} /></div>
                                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                                    ADD TO REGISTRY <CheckCircle size={16} />
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
