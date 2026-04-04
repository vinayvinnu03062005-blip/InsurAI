/* ─────────────────────────────────────────────────────────
   Login.jsx — User authentication (Login / Register)
   ───────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [isLogin, setIsLogin]   = useState(true);
    const [name, setName]         = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd]   = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        await new Promise(r => setTimeout(r, 800));

        if (!email || !password || (!isLogin && !name)) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        // Simple demo auth
        const userData = {
            name: isLogin ? email.split('@')[0] : name,
            email,
            avatarText: (isLogin ? email.charAt(0) : name.charAt(0)).toUpperCase(),
            role: 'user',
        };

        login(userData);
        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--primary-bg)', padding: '2rem 1.5rem',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '400px' }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
                        <Shield size={22} style={{ color: '#0ea5e9' }} />
                        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#f1f5f9', letterSpacing: '0.06em' }}>INSURAI</span>
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        {isLogin ? 'Sign in to manage your policies' : 'Start your insurance journey today'}
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '20px',
                    padding: '2rem',
                }}>
                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'rgba(239,68,68,0.08)',
                                    border: '1px solid rgba(239,68,68,0.2)',
                                    borderRadius: '10px', padding: '0.75rem 1rem',
                                    marginBottom: '1.25rem',
                                    color: '#f87171', fontSize: '0.82rem'
                                }}
                            >
                                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit}>
                        {/* Name (Register only) */}
                        <AnimatePresence>
                            {!isLogin && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="input-group"
                                >
                                    <label>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                        <input
                                            className="input-field"
                                            style={{ paddingLeft: '2.4rem' }}
                                            placeholder="Your full name"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div className="input-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    type="email"
                                    className="input-field"
                                    style={{ paddingLeft: '2.4rem' }}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group" style={{ marginBottom: '1.75rem' }}>
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    className="input-field"
                                    style={{ paddingLeft: '2.4rem', paddingRight: '2.6rem' }}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(p => !p)}
                                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0 }}
                                >
                                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%', padding: '0.9rem',
                                background: loading ? 'rgba(14,165,233,0.4)' : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                color: '#fff', border: 'none', borderRadius: '12px',
                                fontWeight: 800, fontSize: '0.85rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontFamily: 'var(--font-main)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                transition: 'all 0.3s',
                            }}
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && <ArrowRight size={16} />}
                        </motion.button>
                    </form>

                    {/* Toggle */}
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#475569', fontSize: '0.85rem' }}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: '0.85rem' }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
