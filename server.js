/* ─────────────────────────────────────────────────────────
   backend/server.js
   InsurAI — Express API server (in-memory data stores)
   ───────────────────────────────────────────────────────── */

import express from 'express';
import cors    from 'cors';

const app  = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ─── In-Memory Data ──────────────────────────────────── */

// Initial Policies Data
let policies = [
    { id: 1, name: "SecureHealth Plus", premium: "₹1,500/mo", type: "Health", risk: "Low", claimAmount: "₹5,00,000", description: "Full medical coverage including hospitalization, daycare procedures, and annual checkups." },
    { id: 2, name: "AutoGuard 360", premium: "₹800/mo", type: "Auto", risk: "Medium", claimAmount: "₹2,50,000", description: "All-round protection for your vehicle against accidents, theft, and third-party liabilities." },
    { id: 3, name: "HomeFortress Shield", premium: "₹600/mo", type: "Home", risk: "Low", claimAmount: "₹15,00,000", description: "Protect your home structure and valuable contents against fire, theft, and natural disasters." },
    { id: 4, name: "LifeVault Premium", premium: "₹2000/mo", type: "Life", risk: "Low", claimAmount: "₹50,00,000", description: "Pure life cover at affordable rates to ensure your family's financial security." },
    { id: 5, name: "TravelSafe Global", premium: "₹499/mo", type: "Travel", risk: "High", claimAmount: "₹25,00,000", description: "Tailored insurance for small to medium enterprises covering assets and legal liability." },
    { id: 6, name: "BusinessEdge Pro", premium: "₹4,500/trip", type: "Business", risk: "Medium", claimAmount: "₹7,50,000", description: "Emergency medical and trip cancellation cover for your international travels." }
];

// Initial Customers Data
let customers = [
    { id: 101, name: "Aarav Sharma", email: "aarav.sharma@example.com", status: "Active", policies: 2 },
    { id: 102, name: "Priya Patel", email: "priya.patel@webmail.in", status: "Active", policies: 1 },
    { id: 103, name: "Vikram Singh", email: "v.singh@outlook.com", status: "Inactive", policies: 0 },
    { id: 104, name: "Ananya Iyer", email: "ananya.iyer@gmail.com", status: "Active", policies: 3 }
];

let userPolicies = {};   // email -> [policy objects]
let userActivities = {}; // email -> [activity entries]
let riskScores = {};     // email -> number

/* ─── Helpers ─────────────────────────────────────────── */

function ensureUser(email) {
    if (!userPolicies[email])   userPolicies[email]   = [];
    if (!userActivities[email]) userActivities[email] = [];
    if (!riskScores[email])     riskScores[email]     = Math.floor(Math.random() * 30) + 60;
}

function addActivity(email, text) {
    userActivities[email].unshift({
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
    });
    if (userActivities[email].length > 20) userActivities[email].pop();
}

/* ─── Routes ──────────────────────────────────────────── */

// Fetch full user state
app.get('/api/state', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    ensureUser(email);
    res.json({
        allPolicies:    policies,
        userPolicies:   userPolicies[email],
        activities:     userActivities[email],
        riskScore:      riskScores[email],
    });
});

// Purchase a policy
app.post('/api/purchase', (req, res) => {
    const { email, policyId, userDetails, nomineeDetails } = req.body;
    if (!email || !policyId) return res.status(400).json({ message: 'Email and policyId are required' });
    ensureUser(email);

    const policy = policies.find(p => p.id === parseInt(policyId));
    if (!policy) return res.status(404).json({ message: 'Policy not found' });

    const exists = userPolicies[email].some(p => p.id === policy.id);
    if (exists) return res.status(400).json({ message: 'Policy already purchased' });

    const purchased = {
        ...policy,
        purchasedAt: new Date().toISOString(),
        userDetails:    userDetails    || {},
        nomineeDetails: nomineeDetails || {},
    };
    userPolicies[email].push(purchased);
    addActivity(email, `Purchased policy: ${policy.name}`);

    res.json({ success: true, policy: purchased });
});

// Renew a policy
app.post('/api/renew', (req, res) => {
    const { email, policyId } = req.body;
    if (!email || !policyId) return res.status(400).json({ message: 'Email and policyId are required' });
    ensureUser(email);

    const idx = userPolicies[email].findIndex(p => p.id === parseInt(policyId));
    if (idx === -1) return res.status(404).json({ message: 'Policy not found in user inventory' });

    userPolicies[email][idx].renewedAt = new Date().toISOString();
    addActivity(email, `Renewed policy: ${userPolicies[email][idx].name}`);

    res.json({ success: true, policy: userPolicies[email][idx] });
});

// AI risk analysis
app.post('/api/analyze-risk', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    ensureUser(email);

    const newScore = Math.floor(Math.random() * 40) + 55;
    riskScores[email] = newScore;
    addActivity(email, `AI risk analysis completed — score: ${newScore}`);

    res.json({
        success: true,
        riskScore: newScore,
        analysis: {
            overallRisk: newScore > 80 ? 'Low' : newScore > 60 ? 'Medium' : 'High',
            factors: [
                { name: 'Coverage Diversity', score: Math.floor(Math.random() * 30) + 70 },
                { name: 'Claim History',      score: Math.floor(Math.random() * 20) + 75 },
                { name: 'Payment Regularity', score: Math.floor(Math.random() * 15) + 85 },
            ],
            recommendation: 'Consider adding life or travel coverage to improve your risk profile.'
        }
    });
});

// File a claim
app.post('/api/claim', (req, res) => {
    const { email, policyId, claimType, description, amount } = req.body;
    if (!email || !policyId) return res.status(400).json({ message: 'Email and policyId are required' });
    ensureUser(email);

    const policy = userPolicies[email]?.find(p => p.id === parseInt(policyId));
    if (!policy) return res.status(404).json({ message: 'Policy not found' });

    addActivity(email, `Filed claim on ${policy.name}: ₹${amount}`);

    res.json({
        success: true,
        claim: {
            id: `CLM-${Date.now().toString().slice(-8)}`,
            policyName: policy.name,
            type: claimType,
            amount: parseFloat(amount) || 0,
            status: 'Processing',
            date: new Date().toISOString().slice(0, 10),
        }
    });
});

/* ─── Admin Routes ────────────────────────────────────── */

app.get('/api/admin/customers', (_req, res) => {
    res.json(customers);
});

app.delete('/api/admin/customers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    customers = customers.filter(c => c.id !== id);
    res.json({ success: true });
});

app.post('/api/admin/customers', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' });
    const newCustomer = {
        id: customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1,
        name,
        email,
        status: 'Active',
        policies: 0,
    };
    customers.push(newCustomer);
    res.json(newCustomer);
});

app.get('/api/admin/policies', (_req, res) => {
    res.json(policies);
});

app.post('/api/admin/policies', (req, res) => {
    const { name, premium, type, risk, claimAmount, description } = req.body;
    if (!name || !premium) return res.status(400).json({ message: 'Name and premium required' });
    const newPolicy = {
        id: policies.length ? Math.max(...policies.map(p => p.id)) + 1 : 1,
        name,
        premium,
        type:        type        || 'Health',
        risk:        risk        || 'Low',
        claimAmount: claimAmount || 'TBD',
        description: description || 'Standard policy coverage.',
    };
    policies.push(newPolicy);
    res.json(newPolicy);
});

app.delete('/api/admin/policies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    policies = policies.filter(p => p.id !== id);
    res.json({ success: true });
});

/* ─── Start ───────────────────────────────────────────── */

app.listen(PORT, () => {
    console.log(`\n  🚀 InsurAI API server running on http://localhost:${PORT}\n`);
});
