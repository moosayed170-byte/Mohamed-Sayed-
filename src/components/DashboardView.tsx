import React, { useState } from 'react';
import {
  DollarSign,
  Cpu,
  PieChart,
  ShieldAlert,
  ArrowUpRight,
  Calculator,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  TrendingUp,
  Coins
} from 'lucide-react';
import { MetricSnapshot, Language } from '../types';

interface DashboardViewProps {
  metrics: MetricSnapshot;
  lang: Language;
  onToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ metrics, lang, onToast }) => {
  const isAr = lang === 'ar';

  // Calculator State
  const [calls, setCalls] = useState(100000);
  const [tokensPerCall, setTokensPerCall] = useState(1500);
  const [markup, setMarkup] = useState(250);
  const [aiAdvisorLoading, setAiAdvisorLoading] = useState(false);
  const [advisorData, setAdvisorData] = useState<any>(null);

  // Active chart hover index
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(3);

  // Economics calculation
  const totalTokens = calls * tokensPerCall;
  // Weighted smart router cost ~$0.0007 / 1k
  const rawCost = Math.round((totalTokens / 1000) * 0.0007);
  const suggestedPrice = Math.round(rawCost * (1 + markup / 100));
  const netProfit = suggestedPrice - rawCost;
  const netMarginPercent = suggestedPrice > 0 ? Math.round((netProfit / suggestedPrice) * 100) : 0;

  // Chart data
  const chartPoints = [
    { week: isAr ? 'الأسبوع 1' : 'Week 1', revenue: 6500, profit: 4800, cogs: 1700 },
    { week: isAr ? 'الأسبوع 2' : 'Week 2', revenue: 12800, profit: 9400, cogs: 3400 },
    { week: isAr ? 'الأسبوع 3' : 'Week 3', revenue: 19200, profit: 14100, cogs: 5100 },
    { week: isAr ? 'الأسبوع 4 (الحالي)' : 'Week 4 (Current)', revenue: 24850, profit: 18438, cogs: 6412 },
  ];

  const handleRunAdvisor = async () => {
    setAiAdvisorLoading(true);
    try {
      const res = await fetch('/api/pricing-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyCalls: calls,
          avgTokens: tokensPerCall,
          targetMargin: markup > 100 ? 75 : markup
        })
      });
      const data = await res.json();
      setAdvisorData(data);
      onToast(isAr ? 'تم تحليل هوامش الربح وتقديم خطة التسعير المثالية!' : 'AI Pricing Advisor optimized package margins!');
    } catch (err) {
      onToast(isAr ? 'تم استدعاء استشارة التسعير السريعة' : 'Generated rapid margin advice.');
    } finally {
      setAiAdvisorLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net Direct Profit */}
        <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl hover:border-emerald-500/40 transition">
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-center text-slate-400 text-xs mb-2">
            <span>{isAr ? 'صافي الأرباح المباشرة' : 'Net Direct Profit'}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            ${metrics.netProfit.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +24.5% {isAr ? 'هذا الشهر' : 'MoM'}
            </span>
            <span className="text-slate-500">
              {isAr ? `من إيراد $${(metrics.mrr / 1000).toFixed(1)}k` : `From $${(metrics.mrr / 1000).toFixed(1)}k`}
            </span>
          </div>
        </div>

        {/* COGS & Token Compute */}
        <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl hover:border-indigo-500/40 transition">
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-center text-slate-400 text-xs mb-2">
            <span>{isAr ? 'تكلفة التوكنز والتشغيل (COGS)' : 'Compute & Token COGS'}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            ${metrics.cogs.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-indigo-400 font-bold flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              Smart Router Active
            </span>
            <span className="text-slate-500">
              {isAr ? 'توفير 38% من التكلفة' : '38% saved vs single model'}
            </span>
          </div>
        </div>

        {/* LTV / CAC */}
        <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl hover:border-purple-500/40 transition">
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-center text-slate-400 text-xs mb-2">
            <span>{isAr ? 'القيمة التراكمية (LTV / CAC)' : 'LTV / CAC Efficiency'}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {metrics.ltvCacRatio} ratio
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-purple-400 font-bold">LTV: $8,400</span>
            <span className="text-slate-500">CAC: $1,000</span>
          </div>
        </div>

        {/* Security & PII Shield */}
        <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl hover:border-red-500/40 transition">
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-center text-slate-400 text-xs mb-2">
            <span>{isAr ? 'الحظر الوقائي والأمان' : 'Proactive Security Shield'}</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {metrics.piiThreatsBlocked}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-red-400 font-bold">100% PII Sanitized</span>
            <span className="text-slate-500">0 Data Leaks</span>
          </div>
        </div>

      </div>

      {/* Main Financial & Routing Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue & Margin Area Chart */}
        <div className="lg:col-span-8 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                {isAr ? 'الأداء المالي وهامش الربح الأسبوعي' : 'Weekly Financial Performance & Net Margins'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'تتبع الإيرادات الكلية مقابل تكاليف الـ LLM وتأثير نموذج التوجيه الذكي'
                  : 'Total B2B revenue vs model token compute costs with smart routing arbitrage'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold font-mono">
                {isAr ? 'أرباح قياسية +74%' : 'Record +74% Margin'}
              </span>
            </div>
          </div>

          {/* Interactive SVG Area Chart */}
          <div className="relative pt-4 pb-2">
            <svg viewBox="0 0 600 220" className="w-full h-56 overflow-visible">
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[40, 90, 140, 190].map((y, i) => (
                <line
                  key={i}
                  x1="40"
                  y1={y}
                  x2="580"
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Revenue Area */}
              <polygon
                points="50,190 50,145 210,95 370,55 530,25 530,190"
                fill="url(#emeraldGrad)"
              />
              {/* Revenue Line */}
              <polyline
                points="50,145 210,95 370,55 530,25"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Profit Line (Dashed) */}
              <polyline
                points="50,158 210,120 370,82 530,52"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { x: 50, y: 145, py: 158, idx: 0 },
                { x: 210, y: 95, py: 120, idx: 1 },
                { x: 370, y: 55, py: 82, idx: 2 },
                { x: 530, y: 25, py: 52, idx: 3 },
              ].map((pt) => {
                const isHovered = hoveredWeek === pt.idx;
                return (
                  <g
                    key={pt.idx}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredWeek(pt.idx)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 4.5}
                      fill="#10b981"
                      stroke="#060913"
                      strokeWidth="2"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.py}
                      r={isHovered ? 6 : 3.5}
                      fill="#6366f1"
                      stroke="#060913"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] text-slate-400 px-4 mt-2">
              {chartPoints.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setHoveredWeek(idx)}
                  className={`transition ${hoveredWeek === idx ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
                >
                  {item.week}
                </button>
              ))}
            </div>

            {/* Tooltip detail bar */}
            {hoveredWeek !== null && (
              <div className="mt-4 p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <span className="font-bold text-white">{chartPoints[hoveredWeek].week}:</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {isAr ? 'الإيراد الإجمالي:' : 'Gross Revenue:'}{' '}
                    <strong className="text-emerald-400 font-mono">${chartPoints[hoveredWeek].revenue.toLocaleString()}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    {isAr ? 'الأرباح الصافية:' : 'Net Profit:'}{' '}
                    <strong className="text-indigo-400 font-mono">${chartPoints[hoveredWeek].profit.toLocaleString()}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    {isAr ? 'التكلفة:' : 'COGS:'}{' '}
                    <span className="font-mono text-slate-300">${chartPoints[hoveredWeek].cogs.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Model Router Arbitrage */}
        <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              {isAr ? 'توزيع استدعاءات النماذج' : 'Model Router Allocation'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isAr
                ? 'تحقيق أقصى ربحية بتوجيه 62% من المهام للنماذج الأوفر سرعة وسعراً'
                : 'Routing tasks to lowest latency & cost models to expand margins'}
            </p>

            {/* Custom Circular Progress Bar */}
            <div className="flex items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background track */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" strokeWidth="10" />
                  {/* DeepSeek 62% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray="148 238"
                    strokeDashoffset="0"
                  />
                  {/* Claude 28% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="10"
                    strokeDasharray="67 238"
                    strokeDashoffset="-148"
                  />
                  {/* GPT-4o 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray="23 238"
                    strokeDashoffset="-215"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white font-mono">62%</span>
                  <span className="block text-[10px] text-slate-400">{isAr ? 'توكنز سريعة' : 'Fast Tier'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> DeepSeek-V3 / Flash (62%)
              </span>
              <span className="font-mono text-emerald-400 font-bold">$0.0001 / 1k</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Claude 3.5 Sonnet (28%)
              </span>
              <span className="font-mono text-indigo-400 font-bold">$0.0030 / 1k</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> GPT-4o Enterprise (10%)
              </span>
              <span className="font-mono text-amber-400 font-bold">$0.0025 / 1k</span>
            </div>
          </div>
        </div>

      </div>

      {/* Unit Economics & Dynamic Pricing Engine */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-400" />
              {isAr ? 'حاسبة الربحية والـ Dynamic Pricing Engine' : 'Unit Economics & Dynamic Pricing Engine'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'احسب هامش أرباح المنصة المباشرة عند تسعير باقات الوكلاء للعملاء'
                : 'Simulate gross margins, billable client prices, and COGS breakdown for enterprise tiers'}
            </p>
          </div>

          <button
            onClick={handleRunAdvisor}
            disabled={aiAdvisorLoading}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${aiAdvisorLoading ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'استشارة تسعير الذكاء الاصطناعي' : 'AI Margin Advisor'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs text-slate-300 block font-bold">
              {isAr ? 'عدد الاستدعاءات المتوقعة/شهرياً' : 'Expected Monthly Calls'}
            </label>
            <input
              type="number"
              value={calls}
              onChange={(e) => setCalls(Math.max(1000, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs text-slate-300 block font-bold">
              {isAr ? 'متوسط التوكنز في الطلب' : 'Avg Tokens / Request'}
            </label>
            <input
              type="number"
              value={tokensPerCall}
              onChange={(e) => setTokensPerCall(Math.max(100, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs text-slate-300 block font-bold">
              {isAr ? 'نسبة هامش ربح المنصة (%)' : 'Platform Markup (%)'}
            </label>
            <input
              type="number"
              value={markup}
              onChange={(e) => setMarkup(Math.max(10, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 p-4 rounded-2xl border border-indigo-500/30 flex flex-col justify-between shadow-inner">
            <div className="text-xs text-indigo-300 font-bold flex justify-between items-center">
              <span>{isAr ? 'السعر الموصى به للباقة' : 'Recommended Plan Price'}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                {netMarginPercent}% {isAr ? 'هامش' : 'margin'}
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono my-1">
              ${suggestedPrice.toLocaleString()} {isAr ? '/ شهر' : '/ mo'}
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>{isAr ? 'التكلفة الفعلية:' : 'Raw COGS:'} <strong className="text-slate-200">${rawCost.toLocaleString()}</strong></span>
              <span>{isAr ? 'الربح الصافي:' : 'Net Profit:'} <strong className="text-emerald-400">${netProfit.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>

        {/* AI Advisor Recommended Tiers Output */}
        {advisorData && advisorData.tiers && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {isAr ? 'توصيات باقات التسعير المثلى من الذكاء الاصطناعي' : 'AI Optimized Enterprise Package Tiers'}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                {isAr ? `توفير التوجيه الذكي: +$${advisorData.routerMonthlySavings}/شهر` : `Smart Router Savings: +$${advisorData.routerMonthlySavings}/mo`}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {advisorData.tiers.map((tier: any, i: number) => (
                <div key={i} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <strong className="text-white block">{tier.name}</strong>
                    <span className="text-slate-400 text-[10px] font-mono">
                      {tier.calls.toLocaleString()} {isAr ? 'استدعاء' : 'calls'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono font-bold block">${tier.price} / mo</span>
                    <span className="text-[10px] text-indigo-300 font-bold">{tier.margin}% Margin</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
