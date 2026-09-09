import React from 'react';
import {
  TrendingUp,
  Layers,
  Building2,
  ShieldCheck,
  TerminalSquare
} from 'lucide-react';
import { TabId, Language } from '../types';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  lang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab, lang }) => {
  const isAr = lang === 'ar';

  const tabs: { id: TabId; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      labelAr: 'الأرباح والأداء المالي',
      labelEn: 'Financial Performance & Revenue',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'agents',
      labelAr: 'كتالوج الوكلاء والهامش الربحي',
      labelEn: 'Commercial Agent Fleet',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'tenants',
      labelAr: 'إدارة المشتركين (B2B Tenants)',
      labelEn: 'B2B Client Tenants & Billing',
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'security',
      labelAr: 'الأمان والحوكمة وتوجيه النماذج',
      labelEn: 'Security, PII & Smart Router',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      id: 'sandbox',
      labelAr: 'بيئة التجربة والـ Developer Sandbox',
      labelEn: 'Developer Sandbox & Live Testing',
      icon: <TerminalSquare className="w-4 h-4" />
    }
  ];

  return (
    <div className="border-b border-slate-800/80 bg-slate-950/60 sticky top-[69px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/60 shadow-md shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
                }`}
              >
                {tab.icon}
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
