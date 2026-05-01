'use client';

import { motion } from 'framer-motion';

interface HeroSectionProps {
  word: string;
  explanation: string;
  confidence: number;
}

export function HeroSection({ word, explanation, confidence }: HeroSectionProps) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <section className="py-16 text-center max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-xs tracking-[0.2em] text-indigo-400 uppercase mb-8"
      >
        Global State · {dateStr}
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="font-display text-7xl md:text-9xl font-bold tracking-wider mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-400 to-pink-500 pb-2"
      >
        {word}
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-indigo-100/70 leading-relaxed mb-8"
      >
        {explanation}
      </motion.p>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-indigo-300"
      >
        <span>Confidence</span>
        <div className="w-16 h-1 bg-indigo-900/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span>{confidence}%</span>
      </motion.div>
    </section>
  );
}
