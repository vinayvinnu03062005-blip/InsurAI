/* ─────────────────────────────────────────────────────────
   Profile.jsx — User profile & settings
   ───────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Settings, Key, LogOut, Bell, Monitor, Edit3, Save, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const fadeItem = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

export default function Profile() {
    const { user, logout, updateUser } = useAuth();
    const { userPolicies } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'account');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editEmail, setEditEmail] = useState(user?.email || '');

    useEffect(() => { setEditName(user?.name || ''); setEditEmail(user?.email || ''); }, [user]);

    const handleSaveProfile = () => {
        if (updateUser) updateUser({ name: editName, email: editEmail });
        setIsEditing(false);
    };

    const tabs = [
        { id: 'account',  label: 'Account',     icon: Settings },
        { id: 'policies', label: 'My Policies', icon: Shield },
        { id: 'security', label: 'Security',    icon: Key },
    ];

    return (
        <PageTransition>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

                {/* Header */}
                <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Your Profile</span>
                            <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.2)' }} />
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em' }}>
                            Account <span className="text-gradient">Settings.</span>
                        </motion.h1>
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.06)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <motion.div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#34d399' }}>Active Session</span>
                    </motion.div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>

                    {/* Sidebar */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 1.5rem' }}>
                            <motion.div style={{ position: 'absolute', inset: -10, border: '2px dashed rgba(255,255,255,0.06)', borderRadius: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
                            <motion.div whileHover={{ scale: 1.1 }} style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 950, color: '#fff', boxShadow: '0 10px 40px rgba(59,130,246,0.3)' }}>
                                {user?.avatarText || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </motion.div>
                        </div>
                        <h2 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user?.name || 'User'}</h2>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: '2rem' }}>{user?.email || 'No email set'}</p>

                        <motion.div variants={stagger} initial="hidden" animate="show" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {tabs.map(tab => (
                                <motion.button
                                    key={tab.id} variants={fadeItem}
                                    onClick={() => setActiveTab(tab.id)}
                                    whileHover={{ x: 4 }}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.75rem 1rem', borderRadius: '12px', border: 'none',
                                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                                        fontFamily: 'var(--font-main)', transition: 'all 0.3s',
                                        background: activeTab === tab.id ? '#fff' : 'transparent',
                                        color: activeTab === tab.id ? '#000' : '#64748b',
                                        boxShadow: activeTab === tab.id ? '0 10px 40px rgba(255,255,255,0.1)' : 'none',
                                    }}
                                >
                                    <tab.icon size={16} /> {tab.label}
                                </motion.button>
                            ))}
                            <div style={{ height: 1, background: 'rgba(255,255,255,0.03)', margin: '0.5rem 0' }} />
                            <motion.button
                                variants={fadeItem}
                                onClick={logout}
                                whileHover={{ x: 4 }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-main)', background: 'transparent', color: '#ef4444', transition: 'all 0.3s' }}
                            >
                                <LogOut size={16} /> Logout
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Tab Content */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'account' && (
                                <motion.div key="account" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', padding: '2.5rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                        <h3 style={{ fontWeight: 900, fontSize: '1.2rem' }}>Personal Information</h3>
                                        {!isEditing ? (
                                            <motion.button onClick={() => setIsEditing(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#f1f5f9', cursor: 'pointer', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                EDIT <Edit3 size={12} />
                                            </motion.button>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <motion.button onClick={handleSaveProfile} whileHover={{ scale: 1.05 }} style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '100px', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#34d399', cursor: 'pointer', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    SAVE <Save size={12} />
                                                </motion.button>
                                                <motion.button onClick={() => setIsEditing(false)} whileHover={{ scale: 1.05 }} style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '100px', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#f87171', cursor: 'pointer', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    CANCEL <X size={12} />
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                        <div className="input-group">
                                            <label>Full Name</label>
                                            {isEditing ? <input className="input-field" value={editName} onChange={e => setEditName(e.target.value)} /> : <div style={{ fontWeight: 700 }}>{user?.name || '—'}</div>}
                                        </div>
                                        <div className="input-group">
                                            <label>Email Address</label>
                                            {isEditing ? <input className="input-field" value={editEmail} onChange={e => setEditEmail(e.target.value)} /> : <div style={{ fontWeight: 700 }}>{user?.email || '—'}</div>}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', color: '#60a5fa' }}><Bell size={16} /></div>
                                            <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>Notifications</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Email notifications</span>
                                            <button onClick={() => setEmailNotifs(!emailNotifs)} style={{ width: 44, height: 24, borderRadius: '100px', border: 'none', cursor: 'pointer', position: 'relative', background: emailNotifs ? '#3b82f6' : 'rgba(255,255,255,0.08)', transition: 'all 0.3s', boxShadow: emailNotifs ? '0 0 15px rgba(59,130,246,0.3)' : 'none' }}>
                                                <motion.div style={{ position: 'absolute', top: 4, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} animate={{ left: emailNotifs ? 24 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'policies' && (
                                <motion.div key="policies" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', padding: '2.5rem' }}>
                                    <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '2rem' }}>My Policies</h3>
                                    {userPolicies.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                                                <Shield size={48} style={{ color: '#1e293b', margin: '0 auto 1rem' }} />
                                            </motion.div>
                                            <p style={{ color: '#64748b', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>No policies yet</p>
                                            <p style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Browse the catalog to find coverage that fits.</p>
                                            <motion.button onClick={() => navigate('/policies')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary">BROWSE POLICIES</motion.button>
                                        </div>
                                    ) : (
                                        <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {userPolicies.map(p => (
                                                <motion.div key={p.id} variants={fadeItem} whileHover={{ x: 4, borderColor: 'rgba(14,165,233,0.2)' }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 900, marginBottom: '0.25rem' }}>{p.name}</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{p.type} · {p.premium}</div>
                                                    </div>
                                                    <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#34d399', background: 'rgba(16,185,129,0.08)', padding: '0.25rem 0.6rem', borderRadius: '100px', border: '1px solid rgba(16,185,129,0.15)' }}>ACTIVE</span>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div key="security" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', padding: '2.5rem' }}>
                                    <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '2rem' }}>Security Settings</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {/* 2FA */}
                                        <div style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontWeight: 900, color: '#60a5fa', marginBottom: '0.25rem' }}>Two-Factor Authentication</div>
                                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Add an extra layer of security.</p>
                                            </div>
                                            <motion.button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{
                                                padding: '0.5rem 1.25rem', border: '1px solid', borderRadius: '100px', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'var(--font-main)', transition: 'all 0.3s',
                                                background: twoFactorEnabled ? 'rgba(16,185,129,0.08)' : 'transparent',
                                                borderColor: twoFactorEnabled ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.15)',
                                                color: twoFactorEnabled ? '#34d399' : '#f1f5f9',
                                            }}>
                                                {twoFactorEnabled ? '✓ ENABLED' : 'ENABLE'}
                                            </motion.button>
                                        </div>
                                        {/* Session */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                                            <Monitor size={18} style={{ color: '#60a5fa', flexShrink: 0 }} />
                                            <div style={{ flexGrow: 1 }}>
                                                <div style={{ fontWeight: 900, fontSize: '0.85rem' }}>Current Device</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>This browser · Active now</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <motion.div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                                                <span style={{ fontSize: '0.6rem', fontWeight: 950, color: '#34d399' }}>ACTIVE</span>
                                            </div>
                                        </div>
                                        {/* Password */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                                            <Key size={18} style={{ color: '#fbbf24', flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontWeight: 900, fontSize: '0.85rem' }}>Password</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Last changed: Not applicable (demo mode)</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
