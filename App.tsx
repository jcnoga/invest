

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SimulationForm } from './components/SimulationForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { calculateCompoundInterest } from './services/financeService';
import type { SimulationParams, SimulationResult } from './types';
import { Share2, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const defaultState: SimulationParams = {
    initialCapital: 1000,
    periodicContribution: 500,
    contributionFrequency: 'mensal',
    interestRate: 0.8,
    rateType: 'mensal',
    period: 120, // 10 years in months
    reinvest: true,
    inflation: 4,
    taxRate: 15,
  };

  const [params, setParams] = useState<SimulationParams>(defaultState);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Load state from URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString()) {
      const loadedParams: Partial<SimulationParams> = {};
      for (const [key, value] of urlParams.entries()) {
        const numericKeys: (keyof SimulationParams)[] = ['initialCapital', 'periodicContribution', 'interestRate', 'period', 'inflation', 'taxRate'];
        if (numericKeys.includes(key as keyof SimulationParams)) {
          // FIX: Fix for "Type 'number' is not assignable to type 'never'".
          // When dynamically assigning a property using a key that is a union of string literals,
          // TypeScript struggles to infer the correct property type. Casting the object to `any`
          // bypasses this check, allowing the dynamic assignment.
          (loadedParams as any)[key] = Number(value);
        } else if (key === 'reinvest') {
          loadedParams.reinvest = value === 'true';
        } else {
          // FIX: Fix for "Type 'any' is not assignable to type 'never'".
          // This is the same issue as above. The `any` cast on `loadedParams` resolves it.
          (loadedParams as any)[key] = value;
        }
      }
      setParams(prev => ({ ...prev, ...loadedParams }));
    }
  }, []);


  const results = useMemo((): SimulationResult => {
    return calculateCompoundInterest(params);
  }, [params]);

  const handleReset = useCallback(() => {
    setParams(defaultState);
    // Clear URL params
    window.history.pushState({}, '', window.location.pathname);
  }, [defaultState]);

  const handleShare = useCallback(() => {
    const url = new URL(window.location.href.split('?')[0]);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
    navigator.clipboard.writeText(url.toString());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, [params]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
            Calculadora de Juros Compostos
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Simule seus investimentos de longo prazo, visualize a evolução do seu patrimônio e planeje seu futuro financeiro.
          </p>
        </header>

        <div className="flex justify-end gap-4 mb-6">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
            >
                <Share2 size={16} />
                Compartilhar
            </button>
            <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
            >
                <RotateCcw size={16} />
                Resetar
            </button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <SimulationForm params={params} setParams={setParams} />
          </div>
          <div className="lg:col-span-2">
            <ResultsDisplay results={results} />
          </div>
        </main>
      </div>

      {showToast && (
        <div className="fixed bottom-5 right-5 bg-brand-primary text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
          Link da simulação copiado!
        </div>
      )}
    </div>
  );
};

export default App;