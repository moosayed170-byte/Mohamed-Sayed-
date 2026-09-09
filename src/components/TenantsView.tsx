import React from 'react';
import {
  Building2,
  Plus,
  FileText,
  Ban,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Tenant, Language } from '../types';

interface TenantsViewProps {
  tenants: Tenant[];
  onOpenOnboard: () => void;
  onGenerateInvoice: (tenant: Tenant) => void;
  onToggleStatus: (tenantId: string) => void;
  onCopyApiKey: (key: string) => void;
  lang: Language;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  tenants,
  onOpenOnboard,
  onGenerateInvoice,
  onToggleStatus,
  onCopyApiKey,
  lang
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              {isAr ? 'إدارة المشتركين والشركات (B2B SaaS Multi-Tenants)' : 'Enterprise B2B Multi-Tenants & Subscriptions'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'مراقبة حدود التوكنز، حالة مفاتيح API، وتوليد الفواتير بنقرة واحدة'
                : 'Monitor token quotas, provision client API credentials, and generate instant B2B billing statements'}
            </p>
          </div>

          <button
            onClick={onOpenOnboard}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة عميل جديد' : 'Onboard New Tenant'}</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-3">
                <th className="py-3 px-4 font-bold">{isAr ? 'اسم الشركة / العميل' : 'Company / Client'}</th>
                <th className="py-3 px-4 font-bold">{isAr ? 'الباقة المختارة' : 'Subscription Tier'}</th>
                <th className="py-3 px-4 font-bold">{isAr ? 'استهلاك التوكنز' : 'Tokens Quota'}</th>
                <th className="py-3 px-4 font-bold">{isAr ? 'الإيراد الشهري' : 'MRR'}</th>
                <th className="py-3 px-4 font-bold">{isAr ? 'مفتاح الـ API' : 'API Key'}</th>
                <th className="py-3 px-4 font-bold">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-4 text-center font-bold">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tenants.map((t) => {
                const percentage = Math.min(100, Math.round((t.tokensUsed / t.tokensLimit) * 100));
                return (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {t.avatarLetter}
                        </div>
                        <span className="truncate max-w-[200px]">{t.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold whitespace-nowrap">
                        {t.planName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-32 bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            percentage > 85 ? 'bg-amber-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                        {(t.tokensUsed / 1000000).toFixed(2)}M / {(t.tokensLimit / 1000000).toFixed(2)}M ({percentage}%)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-emerald-400 font-bold font-mono whitespace-nowrap">
                      ${t.planPrice.toLocaleString()} {isAr ? '/ شهر' : '/ mo'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[10px]">
                      <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 w-fit">
                        <span>{t.apiKey.substring(0, 12)}...</span>
                        <button
                          onClick={() => onCopyApiKey(t.apiKey)}
                          className="text-slate-400 hover:text-white transition"
                          title="Copy API Key"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                          t.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {t.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'موقوف' : 'Suspended')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onGenerateInvoice(t)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title={isAr ? 'توليد فاتورة تجارية' : 'Generate Invoice'}
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(t.id)}
                          className={`p-1.5 rounded-lg border transition ${
                            t.status === 'active'
                              ? 'bg-red-950/40 hover:bg-red-900/60 text-red-400 border-red-800/40'
                              : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border-emerald-800/40'
                          }`}
                          title={t.status === 'active' ? (isAr ? 'تعليق الحساب' : 'Suspend') : (isAr ? 'تنشيط الحساب' : 'Activate')}
                        >
                          {t.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
