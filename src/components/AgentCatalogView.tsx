import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Play,
  CheckCircle,
  Briefcase,
  Headphones,
  FileCheck,
  PhoneCall,
  Search,
  Sparkles,
  Bot
} from 'lucide-react';
import { Agent, Language } from '../types';

interface AgentCatalogViewProps {
  agents: Agent[];
  onOpenAddModal: () => void;
  onTestAgent: (agent: Agent) => void;
  lang: Language;
}

export const AgentCatalogView: React.FC<AgentCatalogViewProps> = ({
  agents,
  onOpenAddModal,
  onTestAgent,
  lang
}) => {
  const isAr = lang === 'ar';
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getAgentIcon = (icon: string) => {
    switch (icon) {
      case 'briefcase': return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case 'headset': return <Headphones className="w-5 h-5 text-purple-400" />;
      case 'file-check': return <FileCheck className="w-5 h-5 text-amber-400" />;
      case 'phone-call': return <PhoneCall className="w-5 h-5 text-emerald-400" />;
      default: return <Bot className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesCat = filterCategory === 'all' || agent.category.toLowerCase().includes(filterCategory);
    const textToMatch = `${agent.name} ${agent.nameAr} ${agent.description} ${agent.descriptionAr}`.toLowerCase();
    const matchesSearch = !searchQuery || textToMatch.includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            {isAr ? 'كتالوج الوكلاء التجاريين (Commercial Agent Fleet)' : 'Commercial Agent Fleet Catalog'}
          </h3>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'إدارة وتسعير واختبار أداء أسطول الذكاء الاصطناعي الجاهز للبيع مع حساب التكاليف وهوامش الربح'
              : 'Deploy, price, and test production-ready monetizable AI agents across targeted LLMs'}
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة وكيل ذكي جديد' : 'Deploy New Agent'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute top-2.5 right-3 text-slate-400" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في أسطول الوكلاء...' : 'Search agent fleet...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {['all', 'sales', 'customer', 'fintech', 'telephony'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition capitalize ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {cat === 'all' ? (isAr ? 'الكل' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between shadow-xl relative group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                  {getAgentIcon(agent.icon)}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                  agent.status === 'ready'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {agent.status === 'ready' ? (isAr ? 'جاهز للبيع' : 'Monetizable') : (isAr ? 'مرتفع التعقيد' : 'High SLA')}
                </span>
              </div>

              <h4 className="font-bold text-white text-base">
                {isAr ? agent.nameAr : agent.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {isAr ? agent.descriptionAr : agent.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{isAr ? 'النموذج الموجه:' : 'Routed Model:'}</span>
                  <span className="font-mono text-indigo-300 font-bold">{agent.routedModel}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isAr ? 'التسعير التجاري:' : 'Pricing:'}</span>
                  <span className="font-bold text-white font-mono">${agent.priceUsd} {agent.priceModel}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isAr ? 'هامش الربح المقدر:' : 'Gross Margin:'}</span>
                  <span className="font-bold text-emerald-400 font-mono">{agent.marginPercent}% Margin</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isAr ? 'التدخل البشري (Escalation):' : 'Escalation Rate:'}</span>
                  <span className="font-bold text-indigo-400 font-mono">{agent.escalationRate}%</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => onTestAgent(agent)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white fill-current" />
                <span>{isAr ? 'اختبار الأداء فوراً' : 'Test Live Performance'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
