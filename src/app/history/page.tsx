'use client';

import { motion } from 'framer-motion';

const MOCK_HISTORY = [
  { date: 'Apr 27', day: 27, word: 'PRECARIOUS', score: 38, conf: 87, desc: 'VIX spike and triple conflict alerts overwhelmed stabilizing climate signals.' },
  { date: 'Apr 26', day: 26, word: 'VOLATILE',   score: 42, conf: 81, desc: 'Financial market turbulence dominated after surprise inflation data.' },
  { date: 'Apr 25', day: 25, word: 'TURBULENT',  score: 40, conf: 78, desc: 'Escalating regional conflicts drove news sentiment to 18-month lows.' },
  { date: 'Apr 24', day: 24, word: 'UNCERTAIN',  score: 48, conf: 72, desc: 'Mixed signals — markets recovering but geopolitical tensions persisted.' },
  { date: 'Apr 23', day: 23, word: 'TENSE',      score: 44, conf: 80, desc: 'Diplomatic breakdowns in two major regions elevated the conflict index.' },
  { date: 'Apr 22', day: 22, word: 'ANXIOUS',    score: 46, conf: 75, desc: 'Global search trends for recession hit a 12-month peak.' },
  { date: 'Apr 21', day: 21, word: 'CAUTIOUS',   score: 52, conf: 69, desc: 'Moderate signals across all categories with no dominant driver.' },
  { date: 'Apr 20', day: 20, word: 'UNCERTAIN',  score: 49, conf: 70, desc: 'Central bank policy ambiguity kept markets and sentiment flat.' },
  { date: 'Apr 19', day: 19, word: 'HOPEFUL',    score: 61, conf: 65, desc: 'G7 cooperation signals and stable market session lifted the composite.' },
  { date: 'Apr 18', day: 18, word: 'RESILIENT',  score: 63, conf: 77, desc: 'Post-crisis recovery visible in markets and declining conflict alerts.' },
];

const POLARITY_COLORS: Record<string, string> = {
  PRECARIOUS: 'text-rose-400', VOLATILE: 'text-orange-500', TURBULENT: 'text-orange-500',
  FRAGILE: 'text-amber-400', ANXIOUS: 'text-amber-400', TENSE: 'text-amber-400',
  UNCERTAIN: 'text-gray-400', CAUTIOUS: 'text-blue-400',
  HOPEFUL: 'text-green-400', RESILIENT: 'text-green-400', STABLE: 'text-green-500', THRIVING: 'text-green-500'
};

export default function HistoryPage() {
  
  const wordMap = MOCK_HISTORY.reduce((acc, curr) => {
    acc[curr.day] = curr;
    return acc;
  }, {} as Record<number, typeof MOCK_HISTORY[0]>);

  const daysInMonth = 30; // April
  const offset = 2; // Starts on Wed

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      
      <div className="text-center mb-16">
        <div className="font-mono text-xs tracking-[0.2em] text-indigo-400 uppercase mb-4">
          The Record
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wider mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-200 to-pink-300 pb-2">
          HISTORY
        </h1>
        <p className="text-lg text-indigo-100/70 leading-relaxed max-w-2xl mx-auto">
          Every word the engine has ever produced, traceable to its source signals and drivers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { val: '30', lbl: 'Days on Record' },
          { val: '74%', lbl: 'Prediction Accuracy' },
          { val: '11', lbl: 'Unique Words' },
          { val: '79%', lbl: 'Avg Confidence' }
        ].map(stat => (
          <div key={stat.lbl} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="font-display text-4xl text-indigo-400 mb-2">{stat.val}</div>
            <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">{stat.lbl}</div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm tracking-widest text-gray-400 uppercase font-mono">April 2026</h2>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="text-center font-mono text-[10px] text-gray-500 uppercase tracking-widest py-2">
              {d}
            </div>
          ))}

          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px]" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const data = wordMap[day];
            const isToday = day === 27;

            return (
              <div 
                key={day} 
                className={`min-h-[80px] rounded-xl border p-2 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 hover:border-indigo-500/40 cursor-default
                  ${isToday ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-white/5 border-white/10'}
                  ${!data ? 'opacity-30' : ''}
                `}
              >
                <div className="font-mono text-[10px] text-gray-500">{day}</div>
                {data && (
                  <>
                    <div className={`font-display text-lg tracking-wider leading-none ${POLARITY_COLORS[data.word] || 'text-indigo-400'}`}>
                      {data.word}
                    </div>
                    <div className="font-mono text-[9px] text-gray-400">{data.conf}%</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm tracking-widest text-gray-400 uppercase font-mono">Recent Words</h2>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="space-y-3">
          {MOCK_HISTORY.map((h, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-indigo-500/30 hover:translate-x-1 transition-all"
            >
              <div className="font-mono text-xs text-gray-500 w-24 shrink-0">{h.date}, 2026</div>
              <div className="flex-1">
                <div className={`font-display text-2xl tracking-wide mb-1 ${POLARITY_COLORS[h.word] || 'text-indigo-400'}`}>
                  {h.word}
                </div>
                <div className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                  {h.desc}
                </div>
              </div>
              <div className="font-mono text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full px-3 py-1 shrink-0 h-fit mt-2 md:mt-0">
                {h.conf}% conf
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
