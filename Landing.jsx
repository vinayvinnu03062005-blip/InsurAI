/* ─────────────────────────────────────────────────────────
   Landing.jsx — Public landing page
   ───────────────────────────────────────────────────────── */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Shield, Brain, Zap, Lock, ArrowRight, ChevronRight, Activity, Globe, Cpu, Eye } from 'lucide-react';

/* ── Animated Counter ──────────────────────────────────── */
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = Date.now();
                    const tick = () => {
                        const elapsed = Date.now() - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(ease * target));
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Stagger Helpers ───────────────────────────────────── */
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
};
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

/* ── Data ──────────────────────────────────────────────── */
const MODULES = [
    { icon: Brain,    title: 'AI Risk Engine',       desc: 'Proprietary risk scoring algorithms evaluating coverage needs based on real-time user profiles.', color: '#8b5cf6' },
    { icon: Shield,   title: 'Unified Portfolio',    desc: 'Manage Health, Motor, Home, and Life policies through a single, secure digital interface.',       color: '#0ea5e9' },
    { icon: Activity, title: 'Smart Claims',         desc: 'Simplified claims filing process with automated verification and transparent status tracking.',    color: '#10b981' },
    { icon: Lock,     title: 'Data Privacy',         desc: 'End-to-end encryption ensuring your personal and financial information remains confidential.',    color: '#f59e0b' },
];

const FEATURES = [
    { icon: Zap,    title: 'Digital Issuance',    desc: 'Instant policy generation upon successful premium payment' },
    { icon: Globe,  title: 'Diverse Coverage',    desc: 'Tailored plans for Health, Auto, Life, and Business' },
    { icon: Cpu,    title: 'AI Insights',         desc: 'Personalized recommendations to optimize your coverage' },
    { icon: Eye,    title: 'Live Monitoring',     desc: 'Track claim progress and policy renewals in real-time' },
];

const STATS_DATA = [
    { label: 'Coverage Types', key: 'policiesCount', suffix: '' },
    { label: 'Risk Accuracy',  value: 94,            suffix: '%' },
    { label: 'Uptime',         value: 99.9,          suffix: '%' },
];

/* ── Component ─────────────────────────────────────────── */

export default function Landing() {
    const navigate = useNavigate();
    const { allPolicies } = useAppContext();

    const stats = STATS_DATA.map(s => {
        if (s.key === 'policiesCount') return { ...s, value: allPolicies.length };
        return s;
    });

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>

            {/* ── HERO ──────────────────────────────────── */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', position: 'relative' }}>
                <div style={{ maxWidth: '1200px', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14,165,233,0.08)', padding: '0.5rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(14,165,233,0.15)', marginBottom: '2rem' }}
                    >
                        <Shield size={14} style={{ color: '#0ea5e9' }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.2em', color: '#0ea5e9' }}>AI-POWERED INSURANCE</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 950, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}
                    >
                        Insurance,{' '}
                        <span className="text-gradient">Reimagined</span>
                        <br />
                        with Intelligence.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem', fontWeight: 400, lineHeight: 1.7 }}
                    >
                        Experience next-generation insurance powered by artificial intelligence.
                        Smarter policies, faster claims, real-time risk analysis.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <motion.button
                            onClick={() => navigate('/login')}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                            style={{ padding: '1.1rem 3rem' }}
                        >
                            GET STARTED <ArrowRight size={18} />
                        </motion.button>

                        <motion.button
                            onClick={() => navigate('/admin-login')}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '1.1rem 2.5rem',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '100px',
                                color: '#94a3b8',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                letterSpacing: '0.15em',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                fontFamily: 'var(--font-main)',
                            }}
                        >
                            ADMIN PORTAL <ChevronRight size={16} />
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ── STATS BAR ─────────────────────────────── */}
            <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-0.03em', color: '#f1f5f9' }}>
                                <AnimatedCounter target={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── MODULES SHOWCASE ──────────────────────── */}
            <section style={{ padding: '8rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', marginBottom: '4rem' }}>
                        <div>
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 950, letterSpacing: '0.4em', color: 'var(--insurai-accent)', textTransform: 'uppercase' }}>Insurance Solutions</span>
                                <div style={{ width: 40, height: 1, background: 'rgba(14,165,233,0.3)' }} />
                            </motion.div>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                                Protection for <br /><span className="text-gradient">Every Need.</span>
                            </h2>
                        </div>
                    </div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}
                    >
                        {MODULES.map((m) => (
                            <motion.div
                                key={m.title}
                                variants={fadeUp}
                                whileHover={{ y: -8, borderColor: `${m.color}33` }}
                                style={{
                                    background: 'rgba(255,255,255,0.01)',
                                    border: '1px solid rgba(255,255,255,0.03)',
                                    borderRadius: '28px',
                                    padding: '2.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                }}
                            >
                                <div style={{
                                    width: 52, height: 52, borderRadius: '16px',
                                    background: `${m.color}12`,
                                    border: `1px solid ${m.color}25`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.5rem', color: m.color
                                }}>
                                    <m.icon size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{m.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{m.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── FEATURES GRID ─────────────────────────── */}
            <section style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                    >
                        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 950, letterSpacing: '-0.03em' }}>
                            Why <span className="text-gradient">InsurAI?</span>
                        </h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                                    padding: '2rem',
                                    background: 'rgba(255,255,255,0.01)',
                                    border: '1px solid rgba(255,255,255,0.03)',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s',
                                }}
                            >
                                <div style={{ color: '#0ea5e9', marginTop: '0.2rem' }}><f.icon size={22} /></div>
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '0.4rem', fontSize: '1rem' }}>{f.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────── */}
            <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ maxWidth: '700px', margin: '0 auto' }}
                >
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
                        Ready to <span className="text-gradient">Get Started?</span>
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                        Join thousands of users already enjoying smarter insurance.
                    </p>
                    <motion.button
                        onClick={() => navigate('/login')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        style={{ padding: '1.2rem 3.5rem', fontSize: '0.85rem' }}
                    >
                        START NOW <ArrowRight size={20} />
                    </motion.button>
                </motion.div>
            </section>

            {/* ── FOOTER ────────────────────────────────── */}
            <footer style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Shield size={16} style={{ color: '#0ea5e9' }} />
                    <span style={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.06em' }}>INSURAI</span>
                </div>
                <p style={{ color: '#334155', fontSize: '0.75rem' }}>© {new Date().getFullYear()} InsurAI. All rights reserved.</p>
            </footer>
        </div>
    );
}
