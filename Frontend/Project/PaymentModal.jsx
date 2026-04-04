import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CreditCard, X, CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, onSuccess, amount }) {
    const [status, setStatus] = useState('idle'); // idle, processing, success
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('processing');

        // Simulate payment processing delay
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onSuccess();
            }, 1500); // Wait a bit to show success animation before closing
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 100
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass card"
                        style={{ width: '100%', maxWidth: '450px', position: 'relative', padding: '2rem' }}
                    >
                        {status === 'idle' && (
                            <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        )}

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <CreditCard size={48} className="text-gradient mx-auto mb-2" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Checkout</h2>
                            <p className="text-muted">Total Amount: <span style={{ color: 'var(--accent-1)', fontWeight: 'bold' }}>₹{amount}</span></p>
                        </div>

                        {status === 'idle' ? (
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Cardholder Name</label>
                                    <input type="text" className="input-field" placeholder="John Doe" required value={cardData.name} onChange={e => setCardData({ ...cardData, name: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Card Number</label>
                                    <input type="text" className="input-field" placeholder="0000 0000 0000 0000" maxLength="19" required value={cardData.number} onChange={e => setCardData({ ...cardData, number: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group mb-0">
                                        <label>Expiry Date</label>
                                        <input type="text" className="input-field" placeholder="MM/YY" maxLength="5" required value={cardData.expiry} onChange={e => setCardData({ ...cardData, expiry: e.target.value })} />
                                    </div>
                                    <div className="input-group mb-0">
                                        <label>CVV</label>
                                        <input type="password" className="input-field" placeholder="123" maxLength="4" required value={cardData.cvv} onChange={e => setCardData({ ...cardData, cvv: e.target.value })} />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '0.75rem' }}>
                                    Pay ₹{amount}
                                </button>
                            </form>
                        ) : status === 'processing' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <Loader2 size={48} color="var(--accent-1)" />
                                </motion.div>
                                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Processing Payment...</p>
                                <p className="text-muted text-sm">Please do not close this window</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}
                            >
                                <CheckCircle size={64} style={{ color: '#10b981', marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>Payment Successful!</h3>
                                <p className="text-muted text-center mt-2">Your policy payment was successful.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
