import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { recommendProducts, extractBudgetFromText, RecommendationResponse } from '../lib/brain';
import { ProductIllustration } from './ProductIllustration';
import {
  Sparkles,
  Search,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  ShoppingBag,
  Info
} from 'lucide-react';

interface SmartAssistantProps {
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const SmartAssistant: React.FC<SmartAssistantProps> = ({
  onAddToCart,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('a gift for my sister for Eid');
  const [budget, setBudget] = useState<number>(3000);
  const [engineMode, setEngineMode] = useState<'js' | 'python'>('js');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [pythonStatus, setPythonStatus] = useState<string>('Ready');

  const presetQueries = [
    { text: 'a gift for my sister for Eid', budget: 3000, label: 'Sister Eid Gift' },
    { text: 'traditional panjabi for pohela boishakh', budget: 2500, label: 'Boishakh Panjabi' },
    { text: 'organic breakfast food for parents', budget: 1500, label: 'Organic Breakfast' },
    { text: 'handcrafted clay tea cups for guests', budget: 800, label: 'Terracotta Cups' },
    { text: 'genuine leather wallet for brother', budget: 2000, label: 'Leather Wallet' }
  ];

  // Auto-extract budget if user types "under 2500", etc.
  const handleQueryChange = (text: string) => {
    setQuery(text);
    const detected = extractBudgetFromText(text);
    if (detected > 0) {
      setBudget(detected);
    }
  };

  const runRecommendation = async () => {
    if (!query.trim()) return;
    setLoading(true);

    if (engineMode === 'js') {
      try {
        const response = recommendProducts(undefined, query, budget, 6);
        setResults(response);
      } catch (err) {
        console.error('JS Engine error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Run Python backend engine
      try {
        setPythonStatus('Executing python3 brain.py...');
        const res = await fetch('/api/brain/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, budget, limit: 6 })
        });
        if (res.ok) {
          const json = await res.json();
          // Transform python response format to match RecommendationResponse
          const pyData = json.data;
          const formatted: RecommendationResponse = {
            query: pyData.query,
            parsedTokens: pyData.parsed_tokens,
            expandedKeywords: pyData.expanded_keywords,
            budgetLimit: pyData.budget_limit,
            budgetExcludedCount: pyData.budget_excluded_count,
            totalMatches: pyData.total_matches,
            results: pyData.results.map((r: any) => ({
              product: r.product,
              score: r.score,
              rawScore: r.raw_score,
              matchedWords: r.matched_words,
              matchedTags: r.matched_tags,
              budgetSavings: r.budget_savings,
              explanation: r.explanation
            }))
          };
          setResults(formatted);
          setPythonStatus('Python 3.10 Execution Completed (Deterministic)');
        } else {
          // Fallback to JS if server endpoint has an issue
          const response = recommendProducts(undefined, query, budget, 6);
          setResults(response);
          setPythonStatus('Server offline, executed identical JS client logic');
        }
      } catch {
        const response = recommendProducts(undefined, query, budget, 6);
        setResults(response);
        setPythonStatus('Executed client-side identical fallback');
      } finally {
        setLoading(false);
      }
    }
  };

  // Run on mount or when budget/query changes
  useEffect(() => {
    runRecommendation();
  }, [engineMode]);

  return (
    <section id="smart-assistant" className="w-full bg-[#FAF8F5] border-y border-stone-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Ethical Local AI Assistant</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 font-mono">Zero External APIs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
              Shop with Intelligent Natural Language
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Describe who you're shopping for, the occasion, or what you need. Our transparent, local keyword engine finds relevant Bangladeshi items and <span className="font-semibold text-emerald-900">guarantees zero budget overruns</span>.
            </p>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setEngineMode('js')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                engineMode === 'js'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>JavaScript Engine</span>
            </button>
            <button
              type="button"
              onClick={() => setEngineMode('python')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                engineMode === 'python'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Python (brain.py)</span>
            </button>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Natural Language Request */}
            <div className="lg:col-span-7">
              <label htmlFor="ai-query" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                What are you looking for? (Natural Language)
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="ai-query"
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runRecommendation()}
                  placeholder="e.g. a gift for my sister for Eid, or pure honey under 1000"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                />
              </div>
            </div>

            {/* Budget Controls */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="budget-input" className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Max Budget
                </label>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                  ৳{budget.toLocaleString('en-US')} BDT
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">
                    ৳
                  </span>
                  <input
                    id="budget-input"
                    type="number"
                    min="200"
                    max="10000"
                    step="100"
                    value={budget}
                    onChange={(e) => setBudget(Math.max(100, parseInt(e.target.value) || 0))}
                    className="w-full pl-7 pr-2 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-28 accent-emerald-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2">
              <button
                type="button"
                onClick={runRecommendation}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-98 disabled:opacity-60"
              >
                {loading ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Recommend</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Prompts */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-stone-400">Try asking:</span>
            {presetQueries.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setQuery(p.text);
                  setBudget(p.budget);
                }}
                className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 rounded-lg border border-stone-200 transition-colors"
              >
                {p.label} (৳{p.budget})
              </button>
            ))}
          </div>
        </div>

        {/* Ethical AI Guarantee Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-emerald-900/5 rounded-xl border border-emerald-900/10 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-emerald-950">Ethical AI Promise:</span>
            <span>No price inflation, zero hidden fees, hard budget ceiling strictly enforced.</span>
          </div>
          {results && (
            <div className="flex items-center gap-3 text-stone-600 font-mono text-[11px]">
              <span>Disqualified above budget: <strong>{results.budgetExcludedCount} items</strong></span>
              <span>·</span>
              <span>Active Engine: <strong>{engineMode === 'js' ? 'brain.ts (Client JS)' : 'brain.py (Python3)'}</strong></span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {results && (
          <div>
            {/* Query Parsing Breakdown */}
            <div className="mb-4 bg-white p-3.5 rounded-xl border border-stone-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700" />
                <span className="text-stone-500">Tokens parsed:</span>
                <div className="flex items-center gap-1 font-mono text-emerald-900">
                  {results.parsedTokens.map(t => (
                    <span key={t} className="bg-emerald-50 px-1.5 py-0.5 rounded">'{t}'</span>
                  ))}
                </div>
              </div>

              <div className="text-stone-500">
                Found <strong>{results.totalMatches}</strong> budget-compliant items within <strong>৳{results.budgetLimit.toLocaleString()}</strong>
              </div>
            </div>

            {results.results.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                <p className="text-base font-semibold text-stone-800 mb-1">
                  No products match within your ৳{budget.toLocaleString()} budget.
                </p>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  DhakaCart never compromises your budget by recommending items you cannot afford. Try increasing the budget slider or relaxing the query keywords.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.results.map((item, idx) => (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-xl border border-stone-200/90 hover:border-emerald-700/60 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                  >
                    {/* Visual & Top Bar */}
                    <div
                      onClick={() => onSelectProduct(item.product)}
                      className="relative aspect-16/10 w-full cursor-pointer bg-stone-100 overflow-hidden"
                    >
                      <ProductIllustration product={item.product} className="w-full h-full" />
                      
                      {/* Rank Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-emerald-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        #{idx + 1} Best Match
                      </div>

                      {/* Budget Compliance Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-emerald-900 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Saves ৳{Math.round(item.budgetSavings).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                        <span>{item.product.category}</span>
                        <span>{item.product.origin}</span>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(item.product)}
                        className="font-bold text-stone-900 text-sm hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                      >
                        {item.product.name}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 my-2">
                        {item.product.description}
                      </p>

                      {/* TRANSPARENT REASONING BOX */}
                      <div className="my-2 bg-[#FBF9F5] rounded-lg p-2.5 border border-stone-200/70 text-[11px]">
                        <div className="flex items-center justify-between text-stone-700 font-semibold mb-1">
                          <span>Why this item matched:</span>
                          <span className="font-mono text-emerald-900 text-[10px]">Score: {item.score}</span>
                        </div>
                        
                        {/* Matched Words */}
                        <div className="text-stone-600 mb-1">
                          <span className="text-stone-400">Matched query words: </span>
                          <span className="font-medium text-emerald-900">
                            {item.matchedWords.map(w => `'${w}'`).join(', ')}
                          </span>
                        </div>

                        {/* Matched Tags */}
                        <div className="text-stone-600">
                          <span className="text-stone-400">Triggered tags: </span>
                          <span className="font-mono text-stone-800">
                            {item.matchedTags.map(t => `#${t}`).join(' ')}
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-emerald-900 font-bold text-base">
                            ৳{item.product.price.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            Budget limit: ৳{budget.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectProduct(item.product)}
                            className="px-2 py-1 text-xs font-medium text-stone-600 hover:text-emerald-800 rounded transition-colors"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => onAddToCart(item.product)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium rounded-lg transition-all active:scale-95 shadow-xs"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
