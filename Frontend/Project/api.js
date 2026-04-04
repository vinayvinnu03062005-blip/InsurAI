/* ─────────────────────────────────────────────────────────
   src/services/api.js
   Central API service — all backend calls go through here.
   Base URL: http://localhost:5000
───────────────────────────────────────────────────────── */

const BASE = 'http://localhost:5000';

async function request(method, path, body) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);

    const res  = await fetch(`${BASE}${path}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
}

// ── User / state ──────────────────────────────────────────
/** Fetches the full app state for a given user email. */
export const fetchState        = (email)         => request('GET', `/api/state?email=${encodeURIComponent(email)}`);

// ── Policy actions ───────────────────────────────────────
export const apiBuyPolicy      = (email, policyId, userDetails, nomineeDetails) =>
    request('POST', '/api/purchase', { email, policyId, userDetails, nomineeDetails });

export const apiRenewPolicy    = (email, policyId) =>
    request('POST', '/api/renew', { email, policyId });

export const apiAnalyzeRisk    = (email) =>
    request('POST', '/api/analyze-risk', { email });

export const apiFileClaim      = (email, policyId, claimType, description, amount) =>
    request('POST', '/api/claim', { email, policyId, claimType, description, amount });

// ── Admin ─────────────────────────────────────────────────
export const fetchAdminCustomers   = ()   => request('GET',    '/api/admin/customers');
export const deleteAdminCustomer   = (id) => request('DELETE', `/api/admin/customers/${id}`);
export const fetchAdminPolicies    = ()   => request('GET',    '/api/admin/policies');
export const addAdminPolicy        = (p)  => request('POST',   '/api/admin/policies', p);
export const deleteAdminPolicy     = (id) => request('DELETE', `/api/admin/policies/${id}`);
