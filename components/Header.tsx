
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 pb-2">
                AI Chart Analyst
            </h1>
            <p className="text-lg text-gray-400 mt-2">
                Upload your trading chart and get an instant technical analysis from Gemini.
            </p>
        </header>
    );
};
