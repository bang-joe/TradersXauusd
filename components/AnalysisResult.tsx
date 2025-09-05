
import React from 'react';
import type { Analysis } from '../types';
import { TrendIcon, SupportResistanceIcon, CandlestickIcon, IndicatorIcon, RecommendationIcon } from './icons';

interface AnalysisResultProps {
    analysis: Analysis;
}

const AnalysisItem: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
    <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg">
        <div className="flex-shrink-0 h-8 w-8 text-indigo-400">{icon}</div>
        <div>
            <h4 className="font-semibold text-lg text-white">{title}</h4>
            <p className="text-gray-300">{content}</p>
        </div>
    </div>
);

const RecommendationItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b border-gray-700 last:border-b-0">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono text-white bg-gray-700 px-2 py-1 rounded">{value}</span>
    </div>
);


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
    return (
        <div className="w-full space-y-4 animate-fade-in">
            <AnalysisItem icon={<TrendIcon />} title="Trend Utama" content={analysis.trend} />
            <AnalysisItem icon={<SupportResistanceIcon />} title="Support & Resistance" content={analysis.supportResistance} />
            <AnalysisItem icon={<CandlestickIcon />} title="Pola Candlestick" content={analysis.candlestick} />
            <AnalysisItem icon={<IndicatorIcon />} title="Indikator (MA, RSI, MACD)" content={analysis.indicators} />
            
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg">
                <div className="flex-shrink-0 h-8 w-8 text-green-400"><RecommendationIcon /></div>
                <div className="flex-grow">
                    <h4 className="font-semibold text-lg text-white">Rekomendasi Entry</h4>
                    <div className="mt-2 space-y-2">
                        <RecommendationItem label="Entry" value={analysis.recommendation.entry} />
                        <RecommendationItem label="Stop Loss" value={analysis.recommendation.stopLoss} />
                        <RecommendationItem label="Take Profit" value={analysis.recommendation.takeProfit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add fade-in animation to tailwind config or a global style tag if needed.
// For simplicity, we can add it here.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);
