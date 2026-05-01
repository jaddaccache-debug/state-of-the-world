'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HeroSection } from './HeroSection';
import { SignalMatrix } from './SignalMatrix';
import { DriverFeed } from './DriverFeed';
import { PredictionSection } from './PredictionSection';

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveState() {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data: stateData, error } = await supabase
          .from('daily_states')
          .select('*')
          .eq('date', today)
          .single();

        if (error) throw error;
        setData(stateData);
      } catch (err) {
        console.error('Error fetching live state:', err);
        // Fallback demo data if fetch fails
        setData({
          word: "PRECARIOUS",
          explanation: "Financial market volatility and simultaneous high-severity conflict alerts across 3 major regions are outpacing stabilizing climate signals.",
          confidence_score: 87,
          matrix: { news: 31, conflict: 74, markets: 38, climate: 55, trends: 29 }
        });
      } finally {
        setLoading(false);
      }
    }

    fetchLiveState();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <HeroSection 
        word={data.word} 
        explanation={data.explanation} 
        confidence={data.confidence_score} 
      />
      <SignalMatrix matrix={data.matrix || {}} />
      <DriverFeed />
      <PredictionSection />
    </div>
  );
}
