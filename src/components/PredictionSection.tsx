'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface Prediction {
  date: string;
  predicted_word: string;
  simulation_summary: string;
  base_word: string;
}

export function PredictionSection() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrediction() {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('date', today)
          .single();

        if (error) throw error;
        setPrediction(data);
      } catch (err) {
        console.error('Error fetching prediction:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl animate-pulse">
        <div className="h-6 w-48 bg-white/10 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto mt-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-sm tracking-widest text-gray-400 uppercase font-mono">Temporal Signal</h2>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-white/10 rounded-2xl overflow-hidden border border-white/10">
        
        {/* Yesterday Cell */}
        <div className="bg-[#0d0f1a] p-8 text-center">
          <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-mono mb-3">Yesterday</div>
          <div className="text-3xl font-bold tracking-wide font-display text-white/50">{prediction?.base_word || 'UNKNOWN'}</div>
          <div className="text-xs font-mono mt-3 text-green-400">✓ Logged</div>
        </div>

        {/* Today Cell */}
        <div className="bg-[#1a1c2d] p-8 text-center border-x border-indigo-500/30">
          <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-mono mb-3">Today · Now</div>
          <div className="text-5xl font-bold tracking-wide font-display text-indigo-400">{prediction?.base_word || 'PRECARIOUS'}</div>
          <div className="text-xs font-mono mt-3 text-indigo-300">Live State</div>
        </div>

        {/* Tomorrow Cell (MiroFish Prediction) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0d0f1a] p-8 text-center relative group"
        >
          <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-mono mb-3">Tomorrow · Predicted</div>
          <div className="text-4xl font-bold tracking-wide font-display text-white">
            {prediction ? prediction.predicted_word : 'PENDING'}
          </div>
          
          <div className="text-xs font-mono mt-3 text-orange-400">
            {prediction ? 'Simulation Complete' : 'Awaiting Engine'}
          </div>

          {/* Hover Tooltip for Simulation Summary */}
          {prediction?.simulation_summary && (
            <div className="absolute inset-x-0 bottom-full mb-4 p-4 bg-indigo-950 border border-indigo-500/30 rounded-xl text-sm text-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-2xl">
              <div className="font-mono text-[10px] text-indigo-400 mb-2 uppercase">MiroFish Summary</div>
              {prediction.simulation_summary}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
