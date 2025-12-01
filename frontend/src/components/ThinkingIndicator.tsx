import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ShieldCheck, Globe } from 'lucide-react';

interface ThinkingIndicatorProps {
    isThinking: boolean;
    step: string; // "Macro", "Forensic", "Trading"
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ isThinking, step }) => {
    return (
        <AnimatePresence>
            {isThinking && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed bottom-4 right-4 bg-gray-900 border border-blue-500/50 rounded-lg p-3 shadow-2xl z-50 flex items-center gap-3"
                >
                    <div className="relative">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute top-0 left-0"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10"></div>
                    </div>

                    <div className="text-xs font-mono">
                        <AnimatePresence mode='wait'>
                            {step === 'Macro' && (
                                <motion.div
                                    key="macro"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center gap-2 text-yellow-400"
                                >
                                    <Globe className="w-3 h-3" />
                                    <span>Scanning Global Macro Regime...</span>
                                </motion.div>
                            )}
                            {step === 'Forensic' && (
                                <motion.div
                                    key="forensic"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center gap-2 text-red-400"
                                >
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Running Forensic Accounting Scan...</span>
                                </motion.div>
                            )}
                            {step === 'Trading' && (
                                <motion.div
                                    key="trading"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center gap-2 text-purple-400"
                                >
                                    <Brain className="w-3 h-3" />
                                    <span>Ghost Trader Executing Strategy...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ThinkingIndicator;
