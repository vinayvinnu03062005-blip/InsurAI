/* ─────────────────────────────────────────────────────────
   RenewPolicy.jsx — Renew an owned policy
   ───────────────────────────────────────────────────────── */

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Zap, ArrowRight, ShieldCheck, Clock, Info, Bell } from 'lucide-react';
import { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';

export default function RenewPolicy() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userPolicies, renewPolicy } = useAppContext();
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const policy = userPolicies.find(p => p.id === parseInt(id));

    const handleRenew = async () => {
        setLoading(true);
        setTimeout(async () => {
            await renewPolicy(id);
            setLoading(false);
            navigate('/dashboard');
        }, 2000);
    };

    if (!policy) {
        return (
            <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
                <AlertCircle style={{ color: '#1e293b', width: 64, height: 64, marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: '0.5rem' }}>Policy Not Found</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: 400 }}>We couldn't locate this policy in your active inventory.</p>
                <button onClick={() => navigate('/policies')} className="btn-primary">RETURN TO CATALOG</button>
            </div>
        );
    }

    return (
        <PageTransition>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <RefreshCw size={16} style={{ color: '#f59e0b' }} />
                        <span style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.4em', color: '#f59e0b', textTransform: 'uppercase' }}>Policy Management</span>
                    </motion.div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
                        <div>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em' }}>
                                Policy <span style={{ color: '#f59e0b' }}>Renewal.</span>
                            </motion.h1>
                            <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '1rem', maxWidth: 500 }}>Renew your coverage before the expiration date to ensure continuous protection without any gaps.</p>
                        </div>
                        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', padding: '1rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Clock style={{ color: '#ef4444' }} size={22} />
                            <div>
                                <p style={{ fontSize: '0.6rem', fontWeight: 950, color: '#ef4444', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Expiry Countdown</p>
                                <p style={{ fontWeight: 950, fontSize: '1.1rem' }}>5 DAYS REMAINING</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Main Card */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '2.5rem', opacity: 0.04 }}><Zap size={140} style={{ color: '#f59e0b' }} /></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h3 style={{ fontSize: '0.7rem', fontWeight: 950, color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2rem' }}>Plan Summary</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: 52, height: 52, borderRadius: '16px', background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.15)' }}>
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 950, fontSize: '1.25rem' }}>{policy.name}</h4>
                                    <p style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Policy ID: {id}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <p style={{ fontSize: '0.6rem', fontWeight: 950, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Original Premium</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 950, color: '#94a3b8' }}>{policy.premium}</p>
                                </div>
                                <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.03)', color: '#10b981' }}>
                                    <p style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Renewal Offer</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 950 }}>₹1,400<span style={{ fontSize: '0.6rem', marginLeft: 4 }}>/MO</span></p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.08)', marginBottom: '2rem' }}>
                                <Zap size={14} style={{ color: '#10b981' }} />
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>10% No-Claim Bonus Applied</p>
                            </div>

                            <motion.button
                                onClick={handleRenew}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {loading ? 'SYNCHRONIZING...' : 'CONFIRM RENEWAL'}
                                {!loading && <ArrowRight size={18} />}
                            </motion.button>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '28px', padding: '2rem' }}>
                            <h3 style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Bell size={18} style={{ color: 'var(--insurai-accent)' }} /> Node Alerts
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Network Reminders</p>
                                    <p style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Push notifications</p>
                                </div>
                                <button
                                    onClick={() => setAlertsEnabled(!alertsEnabled)}
                                    style={{
                                        width: 44, height: 24, borderRadius: '100px', border: 'none', cursor: 'pointer', position: 'relative',
                                        background: alertsEnabled ? 'var(--insurai-accent)' : 'rgba(255,255,255,0.08)',
                                        transition: 'all 0.3s',
                                        boxShadow: alertsEnabled ? '0 0 15px var(--insurai-accent-glow)' : 'none',
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', top: 4, width: 16, height: 16, borderRadius: '50%', background: '#fff',
                                        left: alertsEnabled ? 24 : 4, transition: 'all 0.3s',
                                    }} />
                                </button>
                            </div>
                            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.03)', color: '#64748b' }}>
                                    <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                                    <p style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>Renewal will extend your coverage for another <span style={{ color: '#f1f5f9' }}>full year</span> with zero disruption in protection.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), transparent)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '28px', padding: '2rem', textAlign: 'center' }}>
                            <ShieldCheck style={{ color: 'var(--insurai-accent)', margin: '0 auto 1rem' }} size={28} />
                            <h4 style={{ fontWeight: 950, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Immutable Trust</h4>
                            <p style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.6 }}>Your data remains encrypted during the renewal handshake protocol.</p>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
