import React, { useState } from 'react';
import { ShieldAlert, FileText, AlertTriangle, CheckCircle, Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const Forensic: React.FC = () => {
    const [customText, setCustomText] = useState('');
    const [scanResult, setScanResult] = useState<any>(null);
    const [scanning, setScanning] = useState(false);

    const scans = [
        { id: 1, ticker: 'AAPL', doc: '10-K', status: 'Clean', risk: 'Low', time: '2 mins ago' },
        { id: 2, ticker: 'TSLA', doc: '10-Q', status: 'Flagged', risk: 'Medium', time: '15 mins ago', note: 'Unusual R&D capitalization' },
        { id: 3, ticker: 'NVDA', doc: '8-K', status: 'Clean', risk: 'Low', time: '1 hour ago' },
        { id: 4, ticker: 'ENRON', doc: 'HISTORICAL', status: 'CRITICAL', risk: 'High', time: 'Archive', note: 'Off-balance sheet entities detected' },
    ];

    const handleScan = async () => {
        if (!customText) return;
        setScanning(true);
        try {
            const response = await axios.post('http://localhost:8000/api/forensic/scan', { text: customText });
            setScanResult(response.data);
        } catch (error) {
            console.error("Scan failed", error);
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="h-screen bg-background text-foreground p-6 flex flex-col overflow-hidden">
            <header className="mb-8 flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-red-500 flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8" />
                        FORENSIC <span className="text-white">ACCOUNTANT</span>
                    </h1>
                    <p className="text-xs text-gray-500 tracking-widest mt-1">FRAUD DETECTION & RISK ANALYSIS ENGINE</p>
                </div>
                <div className="flex gap-4 text-xs font-mono">
                    <div className="bg-red-900/20 border border-red-900/50 px-4 py-2 rounded text-red-400">
                        ACTIVE SCANS: <span className="text-white font-bold">12</span>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded text-gray-400">
                        DOCUMENTS PROCESSED: <span className="text-white font-bold">14,203</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Left Panel: Scan Queue */}
                <div className="col-span-4 bg-card border border-gray-800 rounded-xl p-0 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                        <h2 className="font-semibold text-gray-300 flex items-center gap-2">
                            <FileText size={16} /> Recent Filings
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {scans.map((scan) => (
                            <div key={scan.id} className="p-3 rounded-lg bg-gray-900/30 border border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{scan.ticker}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{scan.doc}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{scan.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className={`text-xs flex items-center gap-1 ${scan.status === 'Clean' ? 'text-green-500' :
                                        scan.status === 'CRITICAL' ? 'text-red-500 font-bold' : 'text-yellow-500'
                                        }`}>
                                        {scan.status === 'Clean' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                        {scan.status}
                                    </div>
                                    <div className={`text-xs px-2 py-0.5 rounded-full ${scan.risk === 'Low' ? 'bg-green-900/20 text-green-400' :
                                        scan.risk === 'High' ? 'bg-red-900/20 text-red-400' : 'bg-yellow-900/20 text-yellow-400'
                                        }`}>
                                        {scan.risk} Risk
                                    </div>
                                </div>
                                {scan.note && (
                                    <div className="mt-2 text-xs text-gray-400 bg-black/20 p-2 rounded border border-gray-800/50">
                                        "{scan.note}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Analysis View */}
                <div className="col-span-8 bg-card border border-gray-800 rounded-xl p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none" />

                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Search size={20} /> Live Document Scan
                    </h3>

                    <div className="flex-1 flex flex-col gap-4">
                        <textarea
                            className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono"
                            placeholder="Paste 10-K excerpt or news text here to scan for forensic red flags..."
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                        />

                        <div className="flex justify-end">
                            <button
                                onClick={handleScan}
                                disabled={scanning || !customText}
                                className="bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                            >
                                {scanning ? <Loader2 className="animate-spin" size={18} /> : <ShieldAlert size={18} />}
                                {scanning ? 'ANALYZING...' : 'RUN FORENSIC SCAN'}
                            </button>
                        </div>
                    </div>

                    {/* Result Area */}
                    {scanResult && (
                        <div className="mt-6 border-t border-gray-800 pt-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="grid grid-cols-3 gap-8">
                                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                    <div className="text-3xl font-bold text-white mb-1">{scanResult.risk_score}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Risk Score</div>
                                </div>
                                <div className="col-span-2 p-4 bg-gray-900/50 rounded-lg border border-gray-800 flex items-center">
                                    <div>
                                        <div className="text-sm font-bold text-gray-300 mb-1">Analysis Result</div>
                                        <p className="text-sm text-gray-400">
                                            {scanResult.risk_score > 50
                                                ? "CRITICAL WARNING: High probability of accounting irregularities or distress signals detected."
                                                : "Scan complete. No major forensic red flags detected in the provided text."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forensic;
