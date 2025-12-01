import React, { useState } from 'react';
import { analyzeAudio } from '../lib/api';
import { Mic, Upload } from 'lucide-react';

const FedWhisperer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const data = await analyzeAudio(file);
            setResult(data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full bg-gray-900 rounded-lg border border-gray-800 p-6 overflow-y-auto custom-scrollbar">
            <h3 className="text-pink-400 font-bold flex items-center gap-2 text-xl mb-4">
                <Mic className="w-6 h-6" /> THE FED WHISPERER
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Upload audio of Fed speeches (e.g., Powell, Yellen) to decode hidden sentiment through prosodic analysis.
            </p>

            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center mb-6 hover:border-pink-500 transition-colors">
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="audio-upload"
                />
                <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-300 font-bold">{file ? file.name : "Click to Upload Audio (MP3/WAV)"}</span>
                </label>
            </div>

            <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded font-bold disabled:opacity-50 mb-6"
            >
                {loading ? "DECODING TONE PATTERNS..." : "ANALYZE SPEECH"}
            </button>

            {result && (
                <div className="bg-gray-800 rounded p-4 border border-gray-700 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                        <span className="text-gray-400 font-mono text-sm">CONFIDENCE SCORE</span>
                        <span className={`text-2xl font-bold ${result.confidence_score > 0.7 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {(result.confidence_score * 100).toFixed(1)}%
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-900 p-2 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">PITCH VARIABILITY</div>
                            <div className="font-mono text-pink-400">{result.features.pitch_variability.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-900 p-2 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">PAUSE RATIO</div>
                            <div className="font-mono text-blue-400">{result.features.pause_ratio.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-900 p-2 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">DURATION</div>
                            <div className="font-mono text-gray-300">{result.features.duration.toFixed(0)}s</div>
                        </div>
                    </div>

                    <div className="bg-black/50 p-3 rounded text-sm text-gray-300 font-mono max-h-32 overflow-y-auto custom-scrollbar">
                        "{result.transcript}"
                    </div>
                </div>
            )}
        </div>
    );
};

export default FedWhisperer;
