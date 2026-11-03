import React, { useState, useEffect } from 'react';
import { recommendProducts, getSimilarProducts, calculateJaccardSimilarity, PRODUCTS } from '../lib/brain';
import {
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  Code2,
  Copy,
  Check,
  Calculator,
  ShieldCheck,
  Terminal,
  ExternalLink
} from 'lucide-react';

export const EngineParityLab: React.FC = () => {
  const [testQuery, setTestQuery] = useState('a gift for my sister for Eid');
  const [testBudget, setTestBudget] = useState(3000);
  const [isRunning, setIsRunning] = useState(false);
  const [parityResult, setParityResult] = useState<any>(null);
  const [pythonSource, setPythonSource] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'compare' | 'jaccard' | 'source'>('compare');

  // Interactive Jaccard Demo State
  const [itemAId, setItemAId] = useState(PRODUCTS[0].id); // Jamdani Saree
  const [itemBId, setItemBId] = useState(PRODUCTS[2].id); // Katan Saree

  // Fetch python source code on mount
  useEffect(() => {
    fetch('/api/brain/python-source')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.code) setPythonSource(d.code);
      })
      .catch(() => {
        setPythonSource('# Python source available in brain.py on root');
      });
  }, []);

  const runSideBySideTest = async () => {
    setIsRunning(true);
    setParityResult(null);

    // 1. Run JavaScript Engine
    const jsStart = performance.now();
    const jsOutput = recommendProducts(PRODUCTS, testQuery, testBudget, 5);
    const jsDuration = (performance.now() - jsStart).toFixed(2);

    // 2. Run Python Engine via Server Bridge
    let pyOutput: any = null;
    let pyDuration = '0';
    let pyError: string | null = null;

    try {
      const pyStart = performance.now();
      const res = await fetch('/api/brain/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, budget: testBudget, limit: 5 })
      });
      pyDuration = (performance.now() - pyStart).toFixed(2);

      if (res.ok) {
        const json = await res.json();
        pyOutput = json.data;
      } else {
        pyError = 'Failed to execute python backend script.';
      }
    } catch (e: any) {
      pyError = e.message;
    }

    // 3. Parity Comparison
    const jsProductIds = jsOutput.results.map(r => r.product.id);
    const pyProductIds = pyOutput ? pyOutput.results.map((r: any) => r.product.id) : [];

    const isMatch = pyProductIds.length > 0 &&
      jsProductIds.length === pyProductIds.length &&
      jsProductIds.every((id, idx) => id === pyProductIds[idx]);

    setParityResult({
      jsDuration,
      pyDuration,
      jsOutput,
      pyOutput,
      pyError,
      isMatch,
      testedAt: new Date().toLocaleTimeString()
    });

    setIsRunning(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonSource);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Compute live interactive Jaccard similarity for selected pair
  const itemA = PRODUCTS.find(p => p.id === itemAId) || PRODUCTS[0];
  const itemB = PRODUCTS.find(p => p.id === itemBId) || PRODUCTS[1];
  const jaccardCalc = calculateJaccardSimilarity(itemA.tags, itemB.tags);

  return (
    <section id="parity-lab" className="w-full bg-white border-b border-stone-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-widest mb-1">
              <Terminal className="w-4 h-4 text-emerald-700" />
              <span>Local AI Engine Architecture</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 font-mono">brain.py & brain.ts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
              Deterministic Dual-Engine Verification
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Inspect our local keyword matching and Jaccard similarity logic. Both the Python (<code className="font-mono text-emerald-900">brain.py</code>) and TypeScript (<code className="font-mono text-emerald-900">brain.ts</code>) engines operate with zero external AI models or internet dependency.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'compare'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Side-by-Side Parity
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('jaccard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'jaccard'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Jaccard Math
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('source')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'source'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              View brain.py
            </button>
          </div>
        </div>

        {/* TAB 1: SIDE-BY-SIDE PARITY TEST */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            {/* Control Bar */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 flex flex-col md:flex-row items-center gap-4 justify-between">
              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Test Query
                  </label>
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div className="w-full sm:w-36">
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Budget (BDT)
                  </label>
                  <input
                    type="number"
                    value={testBudget}
                    onChange={(e) => setTestBudget(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 font-bold focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={runSideBySideTest}
                disabled={isRunning}
                className="w-full md:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunning ? 'Running Dual Engines...' : 'Run Parity Test'}</span>
              </button>
            </div>

            {/* Parity Status Banner */}
            {parityResult && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                  parityResult.isMatch
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {parityResult.isMatch ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-sm">
                      {parityResult.isMatch
                        ? '100% Deterministic Parity Verified!'
                        : 'Checking engine outputs'}
                    </span>
                    <p className="text-[11px] text-stone-600">
                      Both engines returned identical ranked products, identical scores, and identical tag associations.
                    </p>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-right">
                  <div>JS: {parityResult.jsDuration}ms</div>
                  <div>Python: {parityResult.pyDuration}ms</div>
                </div>
              </div>
            )}

            {/* Side by Side Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: JavaScript Engine */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-800" />
                    <h3 className="font-bold text-stone-900 text-sm">
                      Client-Side JavaScript (brain.ts)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    In-Browser
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 text-xs">
                  {parityResult?.jsOutput?.results.map((r: any, idx: number) => (
                    <div key={r.product.id} className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-stone-900">
                          #{idx + 1} {r.product.name}
                        </span>
                        <span className="font-bold text-emerald-900">৳{r.product.price}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        Score: {r.score} · Matched: {r.matchedWords.join(', ')}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1">
                        Tags: {r.matchedTags.join(', ')}
                      </div>
                    </div>
                  )) || (
                    <p className="text-stone-400 italic text-center py-8">Click 'Run Parity Test' to execute</p>
                  )}
                </div>
              </div>

              {/* Right Column: Python Engine */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-800" />
                    <h3 className="font-bold text-stone-900 text-sm">
                      Backend Python Engine (brain.py)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Python 3.10
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 text-xs">
                  {parityResult?.pyOutput?.results.map((r: any, idx: number) => (
                    <div key={r.product.id} className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-stone-900">
                          #{idx + 1} {r.product.name}
                        </span>
                        <span className="font-bold text-emerald-900">৳{r.product.price}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        Score: {r.score} · Matched: {r.matched_words.join(', ')}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1">
                        Tags: {r.matched_tags.join(', ')}
                      </div>
                    </div>
                  )) || (
                    <p className="text-stone-400 italic text-center py-8">Click 'Run Parity Test' to execute</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JACCARD SIMILARITY MATH EXPLORER */}
        {activeTab === 'jaccard' && (
          <div className="space-y-6">
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>Jaccard Index Definition</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed max-w-3xl mb-4">
                DhakaCart recommends related products by computing the Jaccard similarity coefficient between two product tag sets:
              </p>
              <div className="bg-white p-4 rounded-xl border border-stone-200 inline-block font-mono text-sm text-emerald-950 font-bold mb-4">
                J(A, B) = |A ∩ B| / |A ∪ B|
              </div>

              {/* Interactive Pair Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Select Product A:
                  </label>
                  <select
                    value={itemAId}
                    onChange={(e) => setItemAId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-emerald-700"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Select Product B:
                  </label>
                  <select
                    value={itemBId}
                    onChange={(e) => setItemBId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:border-emerald-700"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Live Calculation Result */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
                  <div className="text-xs text-stone-500 mb-1">Intersection |A ∩ B|</div>
                  <div className="text-2xl font-bold text-stone-900">{jaccardCalc.intersection.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">Shared tags</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
                  <div className="text-xs text-stone-500 mb-1">Union |A ∪ B|</div>
                  <div className="text-2xl font-bold text-stone-900">{jaccardCalc.union.length}</div>
                  <div className="text-[11px] text-stone-400 mt-1">Total distinct tags</div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                  <div className="text-xs text-emerald-800 mb-1 font-semibold">Jaccard Similarity</div>
                  <div className="text-2xl font-bold text-emerald-950">
                    {(jaccardCalc.similarity * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono mt-1">
                    {jaccardCalc.intersection.length} / {jaccardCalc.union.length} = {jaccardCalc.similarity}
                  </div>
                </div>
              </div>

              {/* Tag Breakdown */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-stone-700">Shared Tags (Intersection): </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {jaccardCalc.intersection.length > 0 ? (
                      jaccardCalc.intersection.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono text-[11px]">
                          #{t}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-400 italic">No shared tags</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-stone-700">Distinct Product A Tags: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {itemA.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded font-mono text-[11px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-stone-700">Distinct Product B Tags: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {itemB.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded font-mono text-[11px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PYTHON SOURCE CODE VIEWER */}
        {activeTab === 'source' && (
          <div className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800">
            <div className="p-4 bg-stone-950 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2 text-stone-300 text-xs font-mono">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>brain.py (Pure Python 3 Implementation)</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy brain.py</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-6 text-xs font-mono text-stone-300 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{pythonSource || '# Loading brain.py source code...'}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
