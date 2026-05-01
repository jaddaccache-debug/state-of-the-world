export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      
      <div className="text-center mb-20">
        <div className="font-mono text-xs tracking-[0.2em] text-indigo-400 uppercase mb-4">
          Full Transparency
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wider mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-200 to-pink-300 pb-2">
          METHODOLOGY
        </h1>
        <p className="text-lg text-indigo-100/70 leading-relaxed max-w-2xl mx-auto">
          Every data source, formula, and decision that produces today's word. Nothing hidden. Nothing invented.
        </p>
      </div>

      {/* Data Pipeline */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm tracking-widest text-gray-400 uppercase font-mono">Data Pipeline</h2>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        
        <div className="space-y-1.5">
          {[
            { step: 'L1', name: 'Ingestion', desc: 'Python cron fetches raw JSON/RSS from 5 free sources every 6 hours. Raw values stored with timestamps in Supabase.' },
            { step: 'L2', name: 'Normalization', desc: 'Each category converts heterogeneous data into a 0–100 Index Score. 50 = neutral baseline.' },
            { step: 'L3', name: 'Weighted Synthesis', desc: 'Category scores combined with fixed weights. Conflict (28%) carries the highest weight as the most acute human impact signal.' },
            { step: 'L4', name: 'Ontology Mapping', desc: 'Composite scores matched against a curated dictionary of World State Words using deterministic trigger conditions.' },
            { step: 'L5', name: 'AI Explanation', desc: 'The word + top-3 drivers passed as JSON to a free-tier LLM. Produces exactly one sentence. No internet access, no invention.' }
          ].map((item) => (
            <div key={item.step} className="flex">
              <div className="w-12 bg-indigo-500/10 border border-indigo-500/20 border-r-0 rounded-l-xl flex items-center justify-center font-mono text-xs text-indigo-400 shrink-0">
                {item.step}
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-r-xl p-4">
                <div className="text-sm font-semibold text-white mb-1">{item.name}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm tracking-widest text-gray-400 uppercase font-mono">Data Sources</h2>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto p-1">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-mono tracking-widest uppercase text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-4 font-normal">Category</th>
                <th className="p-4 font-normal">Source</th>
                <th className="p-4 font-normal">Update</th>
                <th className="p-4 font-normal">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              <tr><td className="p-4">News Sentiment</td><td className="p-4">GDELT Project — 100+ language global news graph</td><td className="p-4">15 min</td><td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono text-[10px]">Free</span></td></tr>
              <tr><td className="p-4">Conflict & Disasters</td><td className="p-4">GDACS (UN/EU) — severity-rated alert RSS feed</td><td className="p-4">Real-time</td><td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono text-[10px]">Free</span></td></tr>
              <tr><td className="p-4">Financial Markets</td><td className="p-4">Yahoo Finance (yfinance) — VIX, S&P 500, Nikkei, Gold</td><td className="p-4">Daily close</td><td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono text-[10px]">Free</span></td></tr>
              <tr><td className="p-4">Climate / Weather</td><td className="p-4">Open-Meteo — global city weather codes</td><td className="p-4">Hourly</td><td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono text-[10px]">Free</span></td></tr>
              <tr><td className="p-4">Search Trends</td><td className="p-4">Google Trends (pytrends) — global anxiety keyword interest</td><td className="p-4">Daily</td><td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono text-[10px]">Free</span></td></tr>
              <tr><td className="p-4">AI Synthesis</td><td className="p-4">Groq Llama 3 / Gemini Flash — 1-sentence JSON summarizer</td><td className="p-4">Once daily</td><td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono text-[10px]">Free tier</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Boundaries */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm tracking-widest text-gray-400 uppercase font-mono">AI Boundaries</h2>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3 text-sm text-gray-300">
          <div className="flex gap-3"><span className="text-green-400 shrink-0">✓</span><span>Summarize the word given a structured JSON object of scores and top drivers</span></div>
          <div className="flex gap-3"><span className="text-green-400 shrink-0">✓</span><span>Produce exactly one sentence in plain English, under 25 words</span></div>
          <div className="flex gap-3"><span className="text-rose-400 shrink-0">✗</span><span>Access the internet, browse news, or invent events</span></div>
          <div className="flex gap-3"><span className="text-rose-400 shrink-0">✗</span><span>Choose the word — selection is done by deterministic code only</span></div>
          <div className="flex gap-3"><span className="text-rose-400 shrink-0">✗</span><span>Modify or override any data scores — it receives read-only JSON</span></div>
        </div>
      </section>

      <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-6 text-sm text-gray-400 leading-relaxed">
        <strong className="text-rose-400">Disclaimer:</strong> State of the World is a data synthesis engine. It is not financial advice, political commentary, or a substitute for expert analysis. All outputs must be interpreted in the context of this methodology.
      </div>

    </div>
  );
}
