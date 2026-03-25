/* ─────────────────────────────────────────────────────────
   Policies.jsx — Policy catalog
   ───────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';
import { Shield, Heart, Car, Home, Briefcase, Plane, Gem, Search, Filter, ArrowRight } from 'lucide-react';

const TYPE_ICONS = {
    Health:   Heart,
    Auto:     Car,
    Home:     Home,
    Life:     Shield,
    Business: Briefcase,
    Travel:   Plane,
};

const TYPES = ['All', 'Health', 'Auto', 'Home', 'Life', 'Travel', 'Business'];

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
};
const fadeItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Policies() {
    const navigate = useNavigate();
    const { allPolicies, userPolicies } = useAppContext();
    const [search, setSearch]           = useState('');
    const [filterType, setFilterType]   = useState('All');

    const filtered = allPolicies.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchType   = filterType === 'All' || p.type === filterType;
        return matchSearch && matchType;
    });

    return (
        <PageTransition>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

                {/* Header */}
                <header style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}
                    >
                        <span style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.4em', color: '#0ea5e9', textTransform: 'uppercase' }}>Policy Catalog</span>
                        <div style={{ width: 40, height: 1, background: 'rgba(14,165,233,0.3)' }} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em' }}
                    >
                        Browse <span className="text-gradient">Policies.</span>
                    </motion.h1>
                </header>

                {/* Search + Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center' }}
                >
                    <div style={{
                        position: 'relative', flex: '1 1 300px',
                    }}>
                        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                        <input
                            placeholder="Search policies..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field"
                            style={{ paddingLeft: '2.75rem', borderRadius: '100px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {TYPES.map(t => (
                            <button
                                key={t}
                                onClick={() => setFilterType(t)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '100px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    border: '1px solid',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-main)',
                                    transition: 'all 0.3s',
                                    background: filterType === t ? '#fff' : 'transparent',
                                    color: filterType === t ? '#000' : '#64748b',
                                    borderColor: filterType === t ? '#fff' : 'rgba(255,255,255,0.05)',
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Policy Grid */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}
                >
                    {filtered.map(policy => {
                        const Icon = TYPE_ICONS[policy.type] || Gem;
                        const isOwned = userPolicies.some(p => p.id === policy.id);

                        return (
                            <motion.div
                                key={policy.id}
                                variants={fadeItem}
                                whileHover={{ y: -6, borderColor: 'rgba(14,165,233,0.2)' }}
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '24px',
                                    padding: '2rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onClick={() => navigate(`/buy-policy/${policy.id}`)}
                            >
                                {/* Owned badge */}
                                {isOwned && (
                                    <div style={{
                                        position: 'absolute', top: '1rem', right: '1rem',
                                        fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.1em',
                                        color: '#10b981', background: 'rgba(16,185,129,0.1)',
                                        padding: '0.3rem 0.7rem', borderRadius: '100px',
                                        border: '1px solid rgba(16,185,129,0.2)',
                                    }}>
                                        OWNED
                                    </div>
                                )}

                                <div style={{
                                    width: 48, height: 48, borderRadius: '16px',
                                    background: 'rgba(14,165,233,0.08)',
                                    border: '1px solid rgba(14,165,233,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.25rem', color: '#0ea5e9',
                                }}>
                                    <Icon size={22} />
                                </div>

                                <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{policy.name}</h3>
                                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>{policy.description}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                            {policy.type} · {policy.risk} Risk
                                        </div>
                                        <div style={{ fontWeight: 950, fontSize: '1.1rem', color: '#0ea5e9' }}>{policy.premium}</div>
                                    </div>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.03)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#475569',
                                    }}>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '5rem 0' }}
                    >
                        <Filter size={42} style={{ color: '#1e293b', marginBottom: '1rem' }} />
                        <p style={{ color: '#64748b', fontWeight: 700, fontSize: '1.1rem' }}>No policies match your search</p>
                        <p style={{ color: '#475569', fontSize: '0.85rem' }}>Try adjusting your filters</p>
                    </motion.div>
                )}
            </div>
        </PageTransition>
    );
}
