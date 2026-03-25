import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Components
import Layout from './components/Layout';

// Pages
import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import Policies       from './pages/Policies';
import BuyPolicy      from './pages/BuyPolicy';
import RenewPolicy    from './pages/RenewPolicy';
import Claims         from './pages/Claims';
import Support        from './pages/Support';
import Profile        from './pages/Profile';
import AdminLogin     from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPolicies  from './pages/AdminPolicies';
import AdminCustomers from './pages/AdminCustomers';

/* ── Protected Route Wrappers ──────────────────────────── */

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
    const { user } = useAuth();
    return user?.role === 'admin' ? children : <Navigate to="/admin-login" replace />;
}

/* ── Animated Routes ───────────────────────────────────── */

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public */}
                <Route path="/"            element={<Landing />} />
                <Route path="/login"       element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* Protected User Routes */}
                <Route path="/dashboard"       element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/policies"        element={<ProtectedRoute><Layout><Policies /></Layout></ProtectedRoute>} />
                <Route path="/buy-policy/:id"  element={<ProtectedRoute><Layout><BuyPolicy /></Layout></ProtectedRoute>} />
                <Route path="/renew-policy/:id" element={<ProtectedRoute><Layout><RenewPolicy /></Layout></ProtectedRoute>} />
                <Route path="/claims"          element={<ProtectedRoute><Layout><Claims /></Layout></ProtectedRoute>} />
                <Route path="/support"         element={<ProtectedRoute><Layout><Support /></Layout></ProtectedRoute>} />
                <Route path="/profile"         element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin"            element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/policies"   element={<AdminRoute><AdminPolicies /></AdminRoute>} />
                <Route path="/admin/customers"  element={<AdminRoute><AdminCustomers /></AdminRoute>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
}

/* ── App ───────────────────────────────────────────────── */

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppProvider>
                    <div className="animated-bg" />
                    <AnimatedRoutes />
                </AppProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
