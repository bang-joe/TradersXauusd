
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Loader } from './components/Loader';
import { analyzeChart } from './services/geminiService';
import type { Analysis } from './types';

const App: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pairName, setPairName] = useState<string>('');
    const [timeframe, setTimeframe] = useState<string>('');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            
            // Create preview URL
            const readerPreview = new FileReader();
            readerPreview.onloadend = () => {
                setPreviewUrl(readerPreview.result as string);
            };
            readerPreview.readAsDataURL(file);

            // Create base64 string for API
            const readerBase64 = new FileReader();
            readerBase64.onloadend = () => {
                const base64String = (readerBase64.result as string).split(',')[1];
                setImageBase64(base64String);
            };
            readerBase64.readAsDataURL(file);

            setAnalysis(null);
            setError(null);
        }
    };

    const parseAnalysisText = (text: string): Analysis | null => {
        try {
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            const findValue = (key: string) => lines.find(l => l.includes(key))?.split(/:(.+)/)[1]?.trim() || 'N/A';

            const recommendationLines = lines.filter(l => l.trim().startsWith('-'));
            const findRecoValue = (key: string) => recommendationLines.find(l => l.includes(key))?.split(/:(.+)/)[1]?.trim() || 'N/A';
            
            return {
                trend: findValue('Trend Utama'),
                supportResistance: findValue('Support & Resistance'),
                candlestick: findValue('Pola Candlestick'),
                indicators: findValue('Indikator'),
                recommendation: {
                    entry: findRecoValue('Entry'),
                    stopLoss: findRecoValue('Stop Loss'),
                    takeProfit: findRecoValue('Take Profit'),
                }
            };
        } catch (e) {
            console.error("Failed to parse analysis:", e);
            setError("Could not parse the analysis from the AI. The response format might have been unexpected.");
            return null;
        }
    };


    const handleAnalyze = useCallback(async () => {
        if (!imageBase64 || !pairName || !timeframe || !imageFile) {
            setError('Please upload an image and fill in all fields.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const resultText = await analyzeChart(imageBase64, imageFile.type, pairName, timeframe);
            const parsedAnalysis = parseAnalysisText(resultText);
            setAnalysis(parsedAnalysis);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [imageBase64, pairName, timeframe, imageFile]);

    const isButtonDisabled = !imageFile || !pairName || !timeframe || isLoading;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-6">1. Upload & Configure</h2>
                        <div className="space-y-6">
                            <ImageUploader previewUrl={previewUrl} onChange={handleFileChange} />
                            <div>
                                <label htmlFor="pairName" className="block text-sm font-medium text-gray-400 mb-2">Pair Name</label>
                                <input
                                    type="text"
                                    id="pairName"
                                    value={pairName}
                                    onChange={(e) => setPairName(e.target.value)}
                                    placeholder="e.g., BTC/USD"
                                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-400 mb-2">Timeframe</label>
                                <input
                                    type="text"
                                    id="timeframe"
                                    value={timeframe}
                                    onChange={(e) => setTimeframe(e.target.value)}
                                    placeholder="e.g., H4, D1"
                                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={isButtonDisabled}
                                className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 text-white ${isButtonDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 transform hover:-translate-y-1 shadow-lg shadow-indigo-600/30'}`}
                            >
                                {isLoading ? 'Analyzing...' : 'Analyze Chart'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-6">2. AI Analysis</h2>
                        <div className="h-full min-h-[400px] flex flex-col justify-center items-center">
                            {isLoading && <Loader />}
                            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg text-center">{error}</div>}
                            {!isLoading && !error && analysis && <AnalysisResult analysis={analysis} />}
                            {!isLoading && !error && !analysis && (
                                <div className="text-center text-gray-500">
                                    <p>Your chart analysis will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
