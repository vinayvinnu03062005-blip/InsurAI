/* ─────────────────────────────────────────────────────────
   Support.jsx — AI chatbot support
   ───────────────────────────────────────────────────────── */

import { useState, useRef, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

export default function Support() {
    const { user } = useAuth();
    const { userPolicies } = useAppContext();
    const [messages, setMessages] = useState([
        { id: 1, text: `Hi ${user?.name || 'there'}! 👋 I'm InsurAI Assistant. I can help with policy information, claims, renewals, and more. How can I help you today?`, sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMsg = { id: Date.now(), text: inputValue, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            let response = "I'd be happy to help! Could you tell me more? I can assist with policies, claims, renewals, or account settings.";
            const lower = newMsg.text.toLowerCase();

            if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
                response = `Hello ${user?.name || 'there'}! What can I help you with? Ask about policies, claims, or your account.`;
            } else if (lower.includes('policy') || lower.includes('coverage') || lower.includes('plan')) {
                response = userPolicies.length > 0
                    ? `You have ${userPolicies.length} active ${userPolicies.length === 1 ? 'policy' : 'policies'}:\n\n${userPolicies.map(p => `• ${p.name} (${p.type})`).join('\n')}\n\nWould you like details about any of them?`
                    : "You don't have any active policies yet. Would you like to explore our protection plans? We provide Comprehensive Health, Elite Motor, Home, and Term Life coverage.";
            } else if (lower.includes('claim')) {
                response = "To file a claim, please visit the Claims page from the main menu. Select your policy, describe the incident, and specify the claim amount. I can guide you through the process if you need help!";
            } else if (lower.includes('renew')) {
                response = "Renewing your policy is simple. Go to the Policies section and look for plans eligible for renewal. You might also be eligible for a No-Claim Bonus!";
            } else if (lower.includes('help') || lower.includes('support') || lower.includes('what can you do')) {
                response = "I am trained to assist with:\n\n• 📋 Policy details & personalized advice\n• 📝 Guidance on filing claims\n• 🔄 Policy renewal support\n• 👤 Managing your account & profile settings\n• 💡 General insurance queries\n\nHow can I help you today?";
            } else if (lower.includes('price') || lower.includes('cost') || lower.includes('premium')) {
                response = "Our plans are extremely competitive, starting from as low as ₹450/month for Life Cover. You can view specific premiums for all plans in our insurance catalog.";
            } else if (lower.includes('thank')) {
                response = "You're welcome! 😊 Don't hesitate to reach out anytime. I'm here 24/7!";
            } else if (lower.includes('bye') || lower.includes('goodbye')) {
                response = `Goodbye ${user?.name || ''}! Have a great day. Come back anytime! 👋`;
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <PageTransition>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

                {/* Header */}
                <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.4em', color: '#60a5fa', textTransform: 'uppercase' }}>AI Assistant</span>
                            <div style={{ width: 40, height: 1, background: 'rgba(59,130,246,0.3)' }} />
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, letterSpacing: '-0.04em' }}>
                            Support <span className="text-gradient">Center.</span>
                        </motion.h1>
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(59,130,246,0.04)', padding: '0.6rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(59,130,246,0.08)' }}>
                        <motion.div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em' }}>Online</span>
                    </motion.div>
                </header>

                {/* Chat Console */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ maxWidth: 900, margin: '0 auto', height: '60vh', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', overflow: 'hidden' }}>
                    {/* Messages */}
                    <div style={{ flexGrow: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <AnimatePresence>
                            {messages.map(msg => (
                                <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{ maxWidth: '70%', display: 'flex', gap: '0.75rem', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            background: msg.sender === 'user' ? '#fff' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                            color: msg.sender === 'user' ? '#000' : '#fff',
                                        }}>
                                            {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                        </div>
                                        <div style={{
                                            borderRadius: '16px', padding: '1rem 1.25rem', fontSize: '0.85rem', lineHeight: 1.6,
                                            background: msg.sender === 'user' ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.04)',
                                            border: `1px solid ${msg.sender === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.08)'}`,
                                            color: msg.sender === 'user' ? '#f1f5f9' : '#cbd5e1',
                                            fontWeight: 500,
                                        }}>
                                            <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                                            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', marginTop: '0.5rem', letterSpacing: '0.1em' }}>{msg.time}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isTyping && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Sparkles size={16} /></div>
                                <div style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)', padding: '0.75rem 1rem', borderRadius: '16px', display: 'flex', gap: '0.3rem' }}>
                                    {[0, 0.15, 0.3].map((delay, i) => (
                                        <motion.span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#60a5fa' }} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay }} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '100px', padding: '0.25rem 0.25rem 0.25rem 1.25rem', alignItems: 'center' }}>
                            <input
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                style={{ flexGrow: 1, background: 'transparent', border: 'none', color: '#f1f5f9', fontSize: '0.85rem', fontWeight: 500, outline: 'none', fontFamily: 'var(--font-main)' }}
                            />
                            <motion.button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    width: 40, height: 40, borderRadius: '50%', background: '#fff', color: '#000',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: 'none', cursor: 'pointer', flexShrink: 0,
                                    opacity: !inputValue.trim() || isTyping ? 0.2 : 1,
                                    transition: 'all 0.3s',
                                }}
                            >
                                <Send size={16} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
