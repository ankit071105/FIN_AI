import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, Activity, Users, Lightbulb } from 'lucide-react';

const Navbar: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 gap-4">
            <div className="text-blue-500 font-bold text-xl mb-4">F</div>

            <Link to="/" className={`p-3 rounded-lg transition-colors ${isActive('/') ? 'bg-blue-900/50 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
                <LayoutDashboard className="w-6 h-6" />
            </Link>

            <Link to="/analytics" className={`p-3 rounded-lg transition-colors ${isActive('/analytics') ? 'bg-blue-900/50 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
                <LineChart className="w-6 h-6" />
            </Link>

            <Link to="/community" className={`p-3 rounded-lg transition-colors ${isActive('/community') ? 'bg-blue-900/50 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
                <Users className="w-6 h-6" />
            </Link>

            <Link to="/insights" className={`p-3 rounded-lg transition-colors ${isActive('/insights') ? 'bg-blue-900/50 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
                <Lightbulb className="w-6 h-6" />
            </Link>

            <div className="mt-auto">
                <Activity className="w-6 h-6 text-green-500 animate-pulse" />
            </div>
        </div>
    );
};

export default Navbar;
