'use client';

import { motion } from 'framer-motion';

interface SignalMatrixProps {
  matrix: {
    news?: number;
    conflict?: number;
    markets?: number;
    climate?: number;
    trends?: number;
  };
}

const SIGNAL_CONFIG = [
  { id: 'news', icon: '📰', name: 'News Sentiment', color: '#ff6584' },
  { id: 'conflict', icon: '⚔️', name: 'Conflict', color: '#f97316' },
  { id: 'markets', icon: '📈', name: 'Markets', color: '#fbbf24' },
  { id: 'climate', icon: '🌡', name: 'Climate', color: '#4ade80' },
  { id: 'trends', icon: '🔍', name: 'Search Trends', color: '#ff6584' },
];

export function SignalMatrix({ matrix }: SignalMatrixProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="w-full max-w-5xl mx-auto mt-16">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-sm tracking-widest text-gray-400 uppercase font-mono">Signal Matrix</h2>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {SIGNAL_CONFIG.map((signal, idx) => {
          const score = matrix[signal.id as keyof typeof matrix] || 50;
          const offset = circumference - (score / 100) * circumference;

          return (
            <motion.div 
              key={signal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{signal.icon}</div>
              <div className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-4 text-center h-8">
                {signal.name}
              </div>

              <div className="relative w-[72px] h-[72px] flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
                  <circle 
                    cx="36" cy="36" r={radius}
                    fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"
                  />
                  <motion.circle 
                    cx="36" cy="36" r={radius}
                    fill="none" stroke={signal.color} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
                <div 
                  className="absolute inset-0 flex items-center justify-center font-mono text-sm font-medium"
                  style={{ color: signal.color }}
                >
                  {score}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
