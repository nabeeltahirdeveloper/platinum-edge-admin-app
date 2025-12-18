import Layout from "./Layout.jsx";

import KYCVerification from "./KYCVerification";

import Profile from "./Profile";

import FlashCard from "./FlashCard";

import FlashPay from "./FlashPay";

import FlashAccount from "./FlashAccount";

import FlashExchange from "./FlashExchange";

import Login from "./Login";

import AdminPanel from "./AdminPanel";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

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
                
                    <Route path="/" element={<AdminPanel />} />
                
                
                <Route path="/AdminPanel" element={<AdminPanel />} />
                
                <Route path="/KYCVerification" element={<KYCVerification />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/FlashCard" element={<FlashCard />} />
                
                <Route path="/FlashPay" element={<FlashPay />} />
                
                <Route path="/FlashAccount" element={<FlashAccount />} />
                
                <Route path="/FlashExchange" element={<FlashExchange />} />
                
                <Route path="/Login" element={<Login />} />
                
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