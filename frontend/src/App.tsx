import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './pages/Analytics';
import Sidebar from './components/Sidebar';

import Community from './pages/Community';
import Insights from './pages/Insights';

import Forensic from './pages/Forensic';
import Causal from './pages/Causal';
import Strategy from './pages/Strategy';
import Simulator from './pages/Simulator';

function App() {
    return (
        <Router>
            <div className="flex h-screen bg-background text-foreground overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-hidden relative">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/analytics" element={<AnalyticsDashboard />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/insights" element={<Insights />} />

                        {/* Moonshot Routes */}
                        <Route path="/forensic" element={<Forensic />} />
                        <Route path="/causal" element={<Causal />} />
                        <Route path="/strategy" element={<Strategy />} />
                        <Route path="/simulator" element={<Simulator />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
