/* ─────────────────────────────────────────────────────────
   Dashboard.jsx — Main user dashboard
   ───────────────────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { Shield, TrendingUp, Activity, FileText, Zap, Brain, ArrowRight, PlusCircle, RefreshCw, BarChart3, HelpCircle, Settings } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/* ── Animation helpers ─────────────────────────────────── */
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const fadeItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

/* ── Mock Chart Data ───────────────────────────────────── */
const CHART_DATA = [
    { month: 'Jan', coverage: 2400 },
    { month: 'Feb', coverage: 3100 },
    { month: 'Mar', coverage: 2800 },
    { month: 'Apr', coverage: 4200 },
    { month: 'May', coverage: 3800 },
    { month: 'Jun', coverage: 5100 },
    { month: 'Jul', coverage: 4600 },
    { month: 'Aug', coverage: 6200 },
];

/* ── Stat Card Component ───────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
    return (
        <motion.div
            variants={fadeItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '1.5rem',
                transition: 'all 0.3s',
            }}
        >
            <div style={{ color, marginBottom: '0.75rem' }}><Icon size={20} /></div>
            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 950, color: '#f1f5f9', letterSpacing: '-0.03em' }}>{value}</div>
        </motion.div>
    );
}

/* ── Dashboard Component ───────────────────────────────── */
export default function Dashboard() {
    const navigate = useNavigate();
    const { userPolicies, activities, riskScore, analyzeRisk, claims } = useAppContext();

    // Calculate dynamic stats
    const totalCoverage = userPolicies.reduce((sum, p) => {
        const val = parseInt(p.claimAmount?.replace(/[^0-9]/g, '') || '0');
        return sum + val;
    }, 0);

    const coverageDisplay = totalCoverage >= 100000
        ? `₹${(totalCoverage / 100000).toFixed(1)}L+`
        : `₹${(totalCoverage / 1000).toFixed(0)}K`;

    const quickActions = [
        { icon: PlusCircle, label: 'Buy Policy', action: () => navigate('/policies'), color: '#0ea5e9' },
        { icon: RefreshCw, label: 'Renew Policy', action: () => navigate('/policies'), color: '#f59e0b' },
        { icon: FileText, label: 'File Claim', action: () => navigate('/claims'), color: '#10b981' },
        { icon: Brain, label: 'AI Analysis', action: () => analyzeRisk(), color: '#8b5cf6' },
        { icon: HelpCircle, label: 'Get Support', action: () => navigate('/support'), color: '#6366f1' },
        { icon: Settings, label: 'Settings', action: () => navigate('/profile'), color: '#64748b' },
    ];

    return (
        <PageTransition>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

                {/* Header */}
                <header style={{ marginBottom: '4rem' }}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ width: 32, height: 1, background: 'var(--insurai-accent)' }} />
                        <span style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.4em', color: 'var(--insurai-accent)', textTransform: 'uppercase' }}>Protection Plans</span>
                    </motion.div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
                        <div>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                                Insurance <br /><span style={{ color: 'var(--insurai-accent)' }}>Solutions.</span>
                            </motion.h1>
                            <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '1.5rem', maxWidth: 500 }}>Select from our range of verified protection plans designed for your unique needs.</p>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}
                >
                    <StatCard icon={Shield} label="Active Policies" value={userPolicies.length} color="#0ea5e9" />
                    <StatCard icon={Activity} label="Risk Score" value={riskScore} color="#10b981" />
                    <StatCard icon={TrendingUp} label="Coverage Value" value={coverageDisplay} color="#8b5cf6" />
                    <StatCard icon={Zap} label="Claims Filed" value={claims.length} color="#f59e0b" />
                </motion.div>

                {/* Main Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>

                        {/* Coverage Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '28px',
                                padding: '2rem',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Coverage History</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#475569' }}>Monthly coverage value trends</p>
                                </div>
                                <BarChart3 size={18} style={{ color: '#475569' }} />
                            </div>
                            <div style={{ height: 200 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA}>
                                        <defs>
                                            <linearGradient id="coverageGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 11 }} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#0a0d14',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: '#f1f5f9',
                                                fontSize: '0.82rem',
                                            }}
                                        />
                                        <Area type="monotone" dataKey="coverage" stroke="#0ea5e9" strokeWidth={2} fill="url(#coverageGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '28px',
                                padding: '2rem',
                            }}
                        >
                            <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Recent Activity</h3>
                            {activities.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                    <Activity size={36} style={{ color: '#1e293b', marginBottom: '0.75rem' }} />
                                    <p style={{ color: '#475569', fontWeight: 600 }}>No recent activity</p>
                                    <p style={{ color: '#334155', fontSize: '0.82rem' }}>Your actions will appear here</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {activities.slice(0, 5).map((a, i) => (
                                        <div
                                            key={a.id || i}
                                            style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '0.75rem 1rem',
                                                background: 'rgba(255,255,255,0.01)',
                                                border: '1px solid rgba(255,255,255,0.03)',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>{a.text}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#334155', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>{a.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '28px',
                            padding: '2rem',
                        }}
                    >
                        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                            {quickActions.map((qa) => (
                                <motion.button
                                    key={qa.label}
                                    onClick={qa.action}
                                    whileHover={{ y: -4, borderColor: `${qa.color}40` }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                                        padding: '1.5rem 1rem',
                                        background: 'rgba(255,255,255,0.01)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '18px',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        fontFamily: 'var(--font-main)',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <qa.icon size={22} style={{ color: qa.color }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.03em' }}>{qa.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* AI Insights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(14,165,233,0.05), rgba(99,102,241,0.03))',
                            border: '1px solid rgba(14,165,233,0.1)',
                            borderRadius: '28px',
                            padding: '2rem',
                            display: 'flex', alignItems: 'center', gap: '1.5rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Brain size={24} style={{ color: '#0ea5e9' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <h4 style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '0.3rem' }}>AI Recommendation</h4>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                Based on your profile, consider adding travel or life insurance to improve your coverage diversity score.
                            </p>
                        </div>
                        <motion.button
                            onClick={() => navigate('/policies')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '0.7rem 1.5rem',
                                background: 'rgba(14,165,233,0.1)',
                                border: '1px solid rgba(14,165,233,0.2)',
                                borderRadius: '100px',
                                color: '#0ea5e9',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-main)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Explore <ArrowRight size={14} />
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}