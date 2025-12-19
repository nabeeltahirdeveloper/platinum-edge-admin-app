import Layout from "./Layout.jsx";

import KYCVerification from "./KYCVerification";

import Profile from "./Profile";

import FlashCard from "./FlashCard";

import FlashPay from "./FlashPay";

import FlashAccount from "./FlashAccount";

import FlashExchange from "./FlashExchange";

import Login from "./Login";

import AdminPanel from "./AdminPanel";

import ProtectedRoute from "@/components/ProtectedRoute";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

const PAGES = {
    
    KYCVerification: KYCVerification,
    
    Profile: Profile,
    
    FlashCard: FlashCard,
    
    FlashPay: FlashPay,
    
    FlashAccount: FlashAccount,
    
    FlashExchange: FlashExchange,
    
    Login: Login,
    
    AdminPanel: AdminPanel,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || 'AdminPanel';
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                {/* Public Route */}
                <Route path="/Login" element={<Login />} />
                
                {/* Protected Admin Routes */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/AdminPanel" 
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/KYCVerification" 
                    element={
                        <ProtectedRoute>
                            <KYCVerification />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/Profile" 
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/FlashCard" 
                    element={
                        <ProtectedRoute>
                            <FlashCard />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/FlashPay" 
                    element={
                        <ProtectedRoute>
                            <FlashPay />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/FlashAccount" 
                    element={
                        <ProtectedRoute>
                            <FlashAccount />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/FlashExchange" 
                    element={
                        <ProtectedRoute>
                            <FlashExchange />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Catch all - redirect to login */}
                <Route path="*" element={<Navigate to="/Login" replace />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}