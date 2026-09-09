import React from 'react';
import {
  Bot,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  Activity,
  UserPlus,
  Radio,
  Power,
  Languages
} from 'lucide-react';
import { MetricSnapshot, Language } from '../types';

interface HeaderProps {
  metrics: MetricSnapshot;
  isTelemetryActive: boolean;
  onToggleTelemetry: () => void;
  isKillSwitchActive: boolean;
  onToggleKillSwitch: () => void;
  onOpenOnboard: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  isTelemetryActive,
  onToggleTelemetry,
  isKillSwitchActive,
  onToggleKillSwitch,
  onOpenOnboard,
  lang,
  onToggleLang
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/90 sticky top-0 z-40 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row justify-between items-center gap-4">
        
        {/* Logo and Identity */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {isAr ? 'مركز العمليات التجارية للوكلاء الذكية' : 'AI Agents Commercial Hub'}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {isAr ? 'جاهز للإطلاق والربحية v3.2' : 'Commercial Launch Ready v3.2'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'إدارة الأرباح، تحكم التكاليف، أداء النماذج، والتوزيع التجاري'
                  : 'Revenue maximization, COGS control, model routing & B2B fleet'}
              </p>
            </div>
          </div>

          {/* Mobile Quick Kill Switch */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onToggleKillSwitch}
              className={`p-2 rounded-lg border transition ${
                isKillSwitchActive
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-red-600/20 text-red-400 border-red-500/30'
              }`}
              title={isAr ? 'زر إيقاف الطوارئ' : 'Emergency Kill Switch'}
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Telemetry Metrics Bar */}
        <div className="hidden sm:flex items-center gap-4 text-xs bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
          <div>
            <span className="text-slate-400 block text-[10px]">
              {isAr ? 'الإيراد الشهري (MRR)' : 'Monthly Revenue (MRR)'}
            </span>
            <span className="font-bold text-emerald-400 text-sm font-mono">
              ${metrics.mrr.toLocaleString()}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">
              {isAr ? 'هامش الربح الصافي' : 'Net Profit Margin'}
            </span>
            <span className="font-bold text-indigo-400 text-sm font-mono">
              {Math.round((metrics.netProfit / metrics.mrr) * 100)}%
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">
              {isAr ? 'توفير التوجيه الذكي' : 'Router Savings'}
            </span>
            <span className="font-bold text-purple-400 text-sm font-mono">
              +${metrics.smartRouterSavings.toLocaleString()}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">
              {isAr ? 'استدعاءات API اليوم' : 'Daily API Calls'}
            </span>
            <span className="font-bold text-amber-400 text-sm font-mono">
              {metrics.totalDailyCalls.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Executive Action Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Onboard Client CTA */}
          <button
            onClick={onOpenOnboard}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة مشترك Enterprise' : 'Onboard Enterprise'}</span>
          </button>

          {/* Telemetry Toggle */}
          <button
            onClick={onToggleTelemetry}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isTelemetryActive
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isTelemetryActive ? 'text-indigo-400 animate-pulse' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">
              {isAr
                ? isTelemetryActive ? 'البث: نشط' : 'البث: متوقف'
                : isTelemetryActive ? 'Live: On' : 'Live: Paused'}
            </span>
          </button>

          {/* Emergency Kill Switch */}
          <button
            onClick={onToggleKillSwitch}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isKillSwitchActive
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-lg shadow-red-600/40 animate-pulse'
                : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/40'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isKillSwitchActive ? (isAr ? 'إلغاء حظر الطوارئ' : 'Resume System') : 'Kill Switch'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
