/* ─────────────────────────────────────────────────────────
   Claims.jsx — Claims management
   ───────────────────────────────────────────────────────── */

import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, PlusCircle, CheckCircle, X, IndianRupee, ShieldCheck, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

const CLAIM_STATUSES = {
    Approved:   { color: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)', label: 'SETTLED' },
    Processing: { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', label: 'PROCESSING' },
    Submitted:  { color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', label: 'SUBMITTED' },
    Rejected:   { color: '#f87171', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.15)',  label: 'DECLINED' },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};
const fadeItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Claims() {
    const { userPolicies, claims, fileClaim } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({ policyId: '', type: '', desc: '', amount: '', date: new Date().toISOString().slice(0, 10) });

    const handleSubmit = (e) => {
        e.preventDefault();
        const policy = userPolicies.find(p => String(p.id) === form.policyId);
        if (!policy) return;

        fileClaim({
            policyName: policy.name,
            type: form.type,
            amount: parseFloat(form.amount) || 0,
            desc: form.desc,
        });

        setSubmitted(true);
        setTimeout(() => { 
            setShowModal(false); 
            setSubmitted(false); 
            setForm({ policyId: '', type: '', desc: '', amount: '', date: new Date().toISOString().slice(0, 10) }); 
        }, 2000);
    };

    const approvedTotal = claims.filter(c => c.status === 'Approved').reduce((s, c) => s + c.amount, 0);
    const stats = [
        { label: 'Total Filed', value: claims.length, icon: FileText, color: '#60a5fa' },
        { label: 'Processing', value: claims.filter(c => c.status === 'Processing').length, icon: Activity, color: '#fbbf24' },
        { label: 'Settled', value: approvedTotal > 0 ? `₹${(approvedTotal / 1000).toFixed(1)}k` : '₹0', icon: IndianRupee, color: '#34d399' },
        { label: 'Status', value: claims.length > 0 ? 'Active' : 'Ready', icon: ShieldCheck, color: '#34d399' },
    ];

    return (
        <PageTransition>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

                {/* Header */}
                <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.4em', color: '#34d399', textTransform: 'uppercase' }}>Claims Center</span>
                            <div style={{ width: 40, height: 1, background: 'rgba(16,185,129,0.3)' }} />
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em' }}>
                            Claims <span className="text-gradient">Service.</span>
                        </motion.h1>
                    </div>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        FILE NEW CLAIM <PlusCircle size={18} />
                    </motion.button>
                </header>

                {/* Stats */}
                <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                    {stats.map(s => (
                        <motion.div key={s.label} variants={fadeItem} whileHover={{ y: -4 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '24px', transition: 'all 0.3s' }}>
                            <div style={{ color: s.color, marginBottom: '0.75rem' }}><s.icon size={20} /></div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 950, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{s.label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 950 }}>{s.value}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Claims List + Sidebar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {/* Claims List */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', padding: '2rem' }}>
                        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Claims History</h3>
                        {claims.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                                    <FileText size={48} style={{ color: '#1e293b', margin: '0 auto 1rem' }} />
                                </motion.div>
                                <p style={{ color: '#64748b', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>No claims filed yet</p>
                                <p style={{ color: '#475569', fontSize: '0.82rem' }}>Click "File New Claim" to get started</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {claims.map((claim, i) => {
                                    const s = CLAIM_STATUSES[claim.status] || CLAIM_STATUSES.Processing;
                                    return (
                                        <motion.div
                                            key={claim.id}
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem 1.25rem', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', transition: 'all 0.3s' }}
                                        >
                                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#475569', fontFamily: 'var(--font-mono)', minWidth: 80 }}>{claim.id}</div>
                                            <div style={{ flex: 1, minWidth: 150 }}>
                                                <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{claim.policyName}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{claim.type} · {claim.date}</div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                                <span style={{ fontSize: '0.6rem', fontWeight: 950, color: s.color, letterSpacing: '0.1em', padding: '0.2rem 0.6rem', borderRadius: '100px', background: s.bg, border: `1px solid ${s.border}` }}>{s.label}</span>
                                                <div style={{ fontWeight: 950, fontSize: '1.1rem' }}>₹{claim.amount.toLocaleString()}</div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Eligible Policies Sidebar */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.08)', borderRadius: '28px', padding: '2rem' }}>
                        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Your Policies</h3>
                        {userPolicies.length === 0 ? (
                            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No active policies. Buy a policy first to file claims.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {userPolicies.map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                                        onClick={() => { setShowModal(true); setForm(f => ({ ...f, policyId: String(p.id) })); }}
                                        whileHover={{ x: 4 }}
                                        style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.3s' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>{p.name}</span>
                                            <PlusCircle size={14} style={{ color: '#34d399', opacity: 0.5 }} />
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, marginTop: '0.25rem' }}>{p.type} · {p.premium}</div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* File Claim Modal */}
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

                                {submitted ? (
                                    <motion.div style={{ textAlign: 'center', padding: '3rem 0' }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: 'spring', stiffness: 200 }}>
                                            <CheckCircle size={56} style={{ color: '#34d399', margin: '0 auto 1.5rem' }} />
                                        </motion.div>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '0.75rem' }}>Claim Filed!</h2>
                                        <p style={{ color: '#64748b', fontSize: '1rem' }}>Your claim has been submitted and is being processed.</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '-0.03em', marginBottom: '2rem' }}>File a <span className="text-gradient">Claim.</span></h2>
                                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div className="input-group">
                                                <label>Select Policy</label>
                                                <select className="input-field" value={form.policyId} onChange={e => setForm({ ...form, policyId: e.target.value })} required style={{ appearance: 'none' }}>
                                                    <option value="" style={{ background: '#0a0d14' }}>— Select a policy —</option>
                                                    {userPolicies.map(p => <option key={p.id} value={String(p.id)} style={{ background: '#0a0d14' }}>{p.name}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="input-group">
                                                    <label>Incident Type</label>
                                                    <input className="input-field" placeholder="e.g. Accident, Theft" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required />
                                                </div>
                                                <div className="input-group">
                                                    <label>Claim Amount (₹)</label>
                                                    <input className="input-field" type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <label>Description</label>
                                                <textarea className="input-field" rows={4} placeholder="Describe the incident..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} required style={{ resize: 'none' }} />
                                            </div>
                                            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                                                SUBMIT CLAIM
                                            </motion.button>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}
