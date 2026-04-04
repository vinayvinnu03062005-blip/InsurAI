/* ─────────────────────────────────────────────────────────
   BuyPolicy.jsx — Purchase a policy
   ───────────────────────────────────────────────────────── */

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, User, Users, Info, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';

export default function BuyPolicy() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { allPolicies, userPolicies, purchasePolicy } = useAppContext();
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const policy = allPolicies?.find(p => p.id === parseInt(id));
    const isOwned = userPolicies?.some(p => p.id === parseInt(id));

    const [form, setForm] = useState({
        name: '', age: '', contact: '',
        nomineeName: '', nomineeRelation: ''
    });

    useEffect(() => {
        if (!policy) { navigate('/policies'); return; }
        const timer = setInterval(() => {
            setProgress(prev => prev < 98 ? prev + (Math.random() * 5) : 100);
        }, 500);
        return () => clearInterval(timer);
    }, [policy, navigate]);

    const handlePurchase = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            purchasePolicy(id, { name: form.name, age: form.age, contact: form.contact }, { name: form.nomineeName, relation: form.nomineeRelation });
            setLoading(false);
            navigate('/dashboard');
        }, 2000);
    };

    if (!policy) return null;

    return (
        <PageTransition>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1.5rem 6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>

                {/* Left: Policy Details */}
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--insurai-accent)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                            <span style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.4em', color: 'var(--insurai-accent)', textTransform: 'uppercase' }}>Insurance Enrollment</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 950, letterSpacing: '-0.04em' }}>
                            Secure <span style={{ color: 'var(--insurai-accent)' }}>Purchase.</span>
                        </h1>
                    </motion.div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', opacity: 0.06 }}>
                            <Cpu size={120} style={{ color: 'var(--insurai-accent)' }} />
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)', color: 'var(--insurai-accent)' }}>
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.15em', color: '#475569', textTransform: 'uppercase' }}>Selected Plan</p>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 950 }}>{policy.name}</h2>
                                </div>
                            </div>

                            {/* Progress */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Validation Progress</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--insurai-accent)' }}>{Math.round(progress)}% Complete</span>
                                </div>
                                <div style={{ height: 8, background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        style={{ height: '100%', background: 'linear-gradient(to right, var(--insurai-accent), #6366f1)', boxShadow: '0 0 20px var(--insurai-accent-glow)' }}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <p style={{ fontSize: '0.6rem', fontWeight: 950, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Premium Offset</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 950 }}>{policy.premium}</p>
                                </div>
                                <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <p style={{ fontSize: '0.6rem', fontWeight: 950, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Max Coverage</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--insurai-accent)' }}>{policy.claimAmount || '₹2M'}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', borderRadius: '14px', background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.08)' }}>
                                <Info size={16} style={{ color: 'var(--insurai-accent)', marginTop: 2, flexShrink: 0 }} />
                                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>Your data is protected with enterprise-grade encryption for maximum <span style={{ color: '#f1f5f9', fontWeight: 700 }}>Security.</span></p>
                            </div>
                        </div>
                    </div>

                    {isOwned && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <ShieldAlert style={{ color: '#f87171' }} />
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f87171' }}>NOTICE: You already have this active policy.</p>
                        </motion.div>
                    )}
                </div>

                {/* Right: Purchase Form */}
                <div>
                    <form onSubmit={handlePurchase} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '2.5rem' }}>

                        {/* Holder Section */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <User size={18} style={{ color: 'var(--insurai-accent)' }} />
                                <h3 style={{ fontWeight: 950, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Policyholder Details</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div className="input-group">
                                    <label>Legal Full Name</label>
                                    <input className="input-field" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Alex Rivera" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label>Age</label>
                                        <input className="input-field" type="number" required value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="28" />
                                    </div>
                                    <div className="input-group">
                                        <label>Contact</label>
                                        <input className="input-field" type="tel" required value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} placeholder="+91 XXXXX XXXXX" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nominee Section */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Users size={18} style={{ color: 'var(--insurai-accent)' }} />
                                <h3 style={{ fontWeight: 950, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Nominee Information</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div className="input-group">
                                    <label>Nominee Name</label>
                                    <input className="input-field" required value={form.nomineeName} onChange={e => setForm({...form, nomineeName: e.target.value})} placeholder="Full Name" />
                                </div>
                                <div className="input-group">
                                    <label>Relationship</label>
                                    <input className="input-field" required value={form.nomineeRelation} onChange={e => setForm({...form, nomineeRelation: e.target.value})} placeholder="e.g. Spouse, Child" />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isOwned || loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', opacity: isOwned ? 0.3 : 1 }}
                        >
                            {loading ? 'PROCESSING...' : 'COMPLETE PURCHASE'}
                            {!loading && <Zap size={18} />}
                        </motion.button>
                    </form>
                </div>
            </div>
        </PageTransition>
    );
}
