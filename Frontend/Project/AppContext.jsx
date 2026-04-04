/* ─────────────────────────────────────────────────────────
   AppContext.jsx — Global application state
   ───────────────────────────────────────────────────────── */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchState, apiBuyPolicy, apiRenewPolicy, apiAnalyzeRisk } from '../services/api';

const AppContext = createContext(null);

/* ── Mock / Fallback Data ─────────────────────────────── */

export function AppProvider({ children }) {
    const { user } = useAuth();

    const [allPolicies,   setAllPolicies]   = useState([
        { id: 1, name: "Comprehensive Health Shield", premium: "₹1,200/mo", type: "Health", risk: "Low", claimAmount: "₹5,00,000", description: "Full medical coverage including hospitalization, daycare procedures, and annual checkups." },
        { id: 2, name: "Elite Motor Protection", premium: "₹850/mo", type: "Auto", risk: "Medium", claimAmount: "₹2,50,000", description: "All-round protection for your vehicle against accidents, theft, and third-party liabilities." },
        { id: 3, name: "Secure Home & Contents", premium: "₹2,100/mo", type: "Home", risk: "Low", claimAmount: "₹15,00,000", description: "Protect your home structure and valuable contents against fire, theft, and natural disasters." },
        { id: 4, name: "Prime Term Life", premium: "₹450/mo", type: "Life", risk: "Low", claimAmount: "₹50,00,000", description: "Pure life cover at affordable rates to ensure your family's financial security." },
        { id: 5, name: "Enterprise Business Cover", premium: "₹4,500/mo", type: "Business", risk: "High", claimAmount: "₹25,00,000", description: "Tailored insurance for small to medium enterprises covering assets and legal liability." },
        { id: 6, name: "Global Travel Guard", premium: "₹499/trip", type: "Travel", risk: "Medium", claimAmount: "₹7,50,000", description: "Emergency medical and trip cancellation cover for your international travels." }
    ]);
    const [userPolicies,  setUserPolicies]  = useState([]);
    const [activities,    setActivities]    = useState([]);
    const [riskScore,     setRiskScore]     = useState(72);
    const [claims,        setClaims]        = useState([]);
    const [allCustomers,  setAllCustomers]  = useState([
        { id: 101, name: "Aarav Sharma", email: "aarav.sharma@example.com", status: "Active", policies: 2 },
        { id: 102, name: "Priya Patel", email: "priya.patel@webmail.in", status: "Active", policies: 1 },
        { id: 103, name: "Vikram Singh", email: "v.singh@outlook.com", status: "Inactive", policies: 0 },
        { id: 104, name: "Ananya Iyer", email: "ananya.iyer@gmail.com", status: "Active", policies: 3 }
    ]);

    /* ── Fetch state from backend on login ────────────── */

    const loadState = useCallback(async () => {
        if (!user?.email) return;
        try {
            const data = await fetchState(user.email);
            if (data.allPolicies)  setAllPolicies(data.allPolicies);
            if (data.userPolicies) setUserPolicies(data.userPolicies);
            if (data.activities)   setActivities(data.activities);
            if (data.riskScore)    setRiskScore(data.riskScore);
        } catch {
            // Fallback to mock data (already set)
            console.log('Backend unavailable — using local data.');
        }
    }, [user?.email]);

    useEffect(() => {
        loadState();
    }, [loadState]);

    /* ── Policy Actions ───────────────────────────────── */

    const purchasePolicy = async (policyId, userDetails, nomineeDetails) => {
        try {
            const data = await apiBuyPolicy(user.email, policyId, userDetails, nomineeDetails);
            if (data.policy) {
                setUserPolicies(prev => [...prev, data.policy]);
                setActivities(prev => [{ id: Date.now(), text: `Purchased: ${data.policy.name}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toLocaleDateString() }, ...prev]);
            }
        } catch {
            // Offline fallback
            const policy = allPolicies.find(p => p.id === parseInt(policyId));
            if (policy) {
                setUserPolicies(prev => [...prev, { ...policy, purchasedAt: new Date().toISOString(), userDetails, nomineeDetails }]);
                setActivities(prev => [{ id: Date.now(), text: `Purchased: ${policy.name}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toLocaleDateString() }, ...prev]);
            }
        }
    };

    const renewPolicy = async (policyId) => {
        try {
            const data = await apiRenewPolicy(user.email, policyId);
            if (data.policy) {
                setUserPolicies(prev => prev.map(p => p.id === parseInt(policyId) ? { ...p, renewedAt: new Date().toISOString() } : p));
                setActivities(prev => [{ id: Date.now(), text: `Renewed: ${data.policy.name}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toLocaleDateString() }, ...prev]);
            }
        } catch {
            setUserPolicies(prev => prev.map(p => p.id === parseInt(policyId) ? { ...p, renewedAt: new Date().toISOString() } : p));
        }
    };

    const analyzeRisk = async () => {
        try {
            const data = await apiAnalyzeRisk(user.email);
            if (data.riskScore) setRiskScore(data.riskScore);
            return data;
        } catch {
            const score = Math.floor(Math.random() * 30) + 65;
            setRiskScore(score);
            return { riskScore: score };
        }
    };

    const fileClaim = (claimData) => {
        const newClaim = {
            id: `CLM-${Date.now().toString().slice(-8)}`,
            status: 'Processing',
            ...claimData,
            date: new Date().toISOString().slice(0, 10),
        };
        setClaims(prev => [newClaim, ...prev]);
        setActivities(prev => [{
            id: Date.now(),
            text: `Claim Filed: ${claimData.policyName}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString()
        }, ...prev]);
    };

    /* ── Admin Actions ────────────────────────────────── */

    const deletePolicy = (id) => {
        setAllPolicies(prev => prev.filter(p => p.id !== id));
    };

    const addPolicy = (policy) => {
        const newId = allPolicies.length ? Math.max(...allPolicies.map(p => p.id)) + 1 : 1;
        setAllPolicies(prev => [...prev, { id: newId, ...policy }]);
    };

    const deleteCustomer = (id) => {
        setAllCustomers(prev => prev.filter(c => c.id !== id));
    };

    const addCustomer = (customer) => {
        const newId = allCustomers.length ? Math.max(...allCustomers.map(c => c.id)) + 1 : 1;
        setAllCustomers(prev => [...prev, { id: newId, ...customer, status: 'Active', policies: 0 }]);
    };

    /* ── Context Value ────────────────────────────────── */

    const value = {
        allPolicies, userPolicies, activities, riskScore, claims,
        allCustomers,
        purchasePolicy, renewPolicy, analyzeRisk, fileClaim,
        deletePolicy, addPolicy, deleteCustomer, addCustomer,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
}