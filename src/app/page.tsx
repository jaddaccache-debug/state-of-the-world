import { PredictionSection } from '@/components/PredictionSection';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#070810] text-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center py-12">
          <h1 className="text-6xl font-display font-bold tracking-wider mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-200 to-pink-300">
            STATE OF THE WORLD
          </h1>
          <p className="text-gray-400 font-mono tracking-widest uppercase text-sm">
            React / Next.js Dashboard Prototype
          </p>
        </header>

        {/* Prediction Strip Section */}
        <PredictionSection />

      </div>
    </main>
  );
}
