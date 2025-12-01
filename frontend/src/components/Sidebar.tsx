import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShieldAlert,
    GitBranch,
    Dna,
    Globe,
    Lock,
    Award,
    Users,
    Lightbulb,
    LineChart,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    to: string;
    isActive: boolean;
    activeColor: string;
    isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive, activeColor, isCollapsed }) => {
    return (
        <Link to={to} className="w-full">
            <div className={`
                group relative flex items-center p-3 rounded-xl transition-all cursor-pointer
                ${isActive ? 'bg-gray-900 shadow-lg shadow-gray-900/50' : 'hover:bg-gray-900/50'}
                ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}
            `}>
                <div className={`
                    transition-colors duration-300
                    ${isActive ? activeColor : 'text-gray-500 group-hover:text-gray-300'}
                `}>
                    {icon}
                </div>

                {!isCollapsed && (
                    <span className={`
                        text-sm font-medium transition-colors duration-300
                        ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}
                    `}>
                        {label}
                    </span>
                )}

                {/* Active Indicator Line */}
                {isActive && (
                    <div className={`
                        absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full
                        ${activeColor.replace('text-', 'bg-')}
                    `} />
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded border border-gray-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {label}
                    </div>
                )}
            </div>
        </Link>
    );
};

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? '5rem' : '16rem' }}
            className="h-screen bg-gray-950 border-r border-gray-800 flex flex-col py-6 z-50 relative transition-all duration-300 ease-in-out"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 bg-gray-900 border border-gray-700 text-gray-400 p-1 rounded-full hover:text-white transition-colors z-50"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* 1. THE ORB (Home) */}
            <div className={`mb-8 px-4 flex ${isCollapsed ? 'justify-center' : 'items-center gap-3'}`}>
                <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gradient-to-b from-green-500 to-green-900 shadow-[0_0_15px_rgba(34,197,94,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
                {!isCollapsed && (
                    <div>
                        <h1 className="font-bold text-lg text-white tracking-tight">FinAI</h1>
                        <p className="text-xs text-green-500 font-mono">Moonshot v2.0</p>
                    </div>
                )}
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-hide">

                {/* Main Dashboard */}
                <div className="space-y-1">
                    {!isCollapsed && <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Command</h3>}
                    <NavItem
                        icon={<LayoutDashboard size={20} />}
                        label="The Orb"
                        to="/"
                        isActive={isActive('/')}
                        activeColor="text-green-400"
                        isCollapsed={isCollapsed}
                    />
                </div>

                {/* Operations (Moonshot Modules) */}
                <div className="space-y-1">
                    {!isCollapsed && <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Operations</h3>}

                    <NavItem
                        icon={<ShieldAlert size={20} />}
                        label="Forensic"
                        to="/forensic"
                        isActive={isActive('/forensic')}
                        activeColor="text-red-400"
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<GitBranch size={20} />}
                        label="Causal Graph"
                        to="/causal"
                        isActive={isActive('/causal')}
                        activeColor="text-blue-400"
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Dna size={20} />}
                        label="Breeder"
                        to="/strategy"
                        isActive={isActive('/strategy')}
                        activeColor="text-purple-400"
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Globe size={20} />}
                        label="Multiverse"
                        to="/simulator"
                        isActive={isActive('/simulator')}
                        activeColor="text-amber-400"
                        isCollapsed={isCollapsed}
                    />
                </div>

                {/* Analytics & Insights (Legacy/Extended) */}
                <div className="space-y-1">
                    {!isCollapsed && <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Intelligence</h3>}

                    <NavItem
                        icon={<LineChart size={20} />}
                        label="Analytics"
                        to="/analytics"
                        isActive={isActive('/analytics')}
                        activeColor="text-cyan-400"
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Lightbulb size={20} />}
                        label="Insights"
                        to="/insights"
                        isActive={isActive('/insights')}
                        activeColor="text-yellow-400"
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Users size={20} />}
                        label="Community"
                        to="/community"
                        isActive={isActive('/community')}
                        activeColor="text-pink-400"
                        isCollapsed={isCollapsed}
                    />
                </div>
            </div>

            {/* GAMIFICATION & STATUS */}
            <div className="mt-auto px-3 pt-4 border-t border-gray-900">
                <div className={`flex ${isCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between'}`}>
                    <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center text-yellow-500 cursor-help" title="Rank: Risk Guardian">
                        <Award size={20} />
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 px-3">
                            <div className="text-xs text-gray-400">Rank</div>
                            <div className="text-sm font-bold text-yellow-500">Risk Guardian</div>
                        </div>
                    )}

                    <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <Lock size={20} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
