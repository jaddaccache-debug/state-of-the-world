'use client';

import { motion } from 'framer-motion';

// Mock drivers based on the HTML prototype
const MOCK_DRIVERS = [
  { src: 'GDACS · UN/EU Alert System', text: 'RED alert issued for simultaneous flooding in Bangladesh and seismic activity near Taiwan Strait.', score: '-9.2', type: 'neg' },
  { src: 'CBOE · VIX Index', text: 'Volatility Index surged 34% intraday — highest single-session spike since March 2022 banking crisis.', score: '-8.7', type: 'neg' },
  { src: 'GDELT · Global News Graph', text: 'Global negative news tone index dropped to 31/100 — 3rd lowest reading in 18 months across 100+ languages.', score: '-8.1', type: 'neg' },
  { src: 'pytrends · Google Trends', text: '"Recession" and "war" searches hit 12-month global peak simultaneously, indicating broad public anxiety.', score: '-7.4', type: 'warn' },
  { src: 'Open-Meteo · Climate Index', text: 'Global climate anomaly index near neutral (55/100), acting as the single stabilizing signal in today\'s matrix.', score: '+2.1', type: 'pos' },
];

export function DriverFeed() {
  return (
    <section className="w-full max-w-5xl mx-auto mt-16 mb-16">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-sm tracking-widest text-gray-400 uppercase font-mono">Top Global Drivers</h2>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_DRIVERS.map((driver, idx) => {
          
          let scoreColorClass = "bg-white/10 text-gray-300";
          if (driver.type === 'neg') scoreColorClass = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
          if (driver.type === 'warn') scoreColorClass = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
          if (driver.type === 'pos') scoreColorClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 rounded-md px-2 py-1 h-fit mt-0.5 shrink-0">
                #{idx + 1}
              </div>
              <div className="flex-1">
                <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">{driver.src}</div>
                <div className="text-sm text-gray-200 leading-relaxed">{driver.text}</div>
              </div>
              <div className={`font-mono text-xs px-2 py-1 rounded-md h-fit shrink-0 ${scoreColorClass}`}>
                {driver.score}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
