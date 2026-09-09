import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Key,
  CheckCircle2,
  Copy,
  Receipt,
  Bot,
  Plus,
  Download,
  Printer
} from 'lucide-react';
import { Agent, Tenant, InvoiceData, Language } from '../types';

interface OnboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => void;
  onToast: (msg: string) => void;
  lang: Language;
}

export const OnboardModal: React.FC<OnboardModalProps> = ({
  isOpen,
  onClose,
  onAddTenant,
  onToast,
  lang
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [clientName, setClientName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'1499' | '499' | '299'>('499');
  const [tokenLimit, setTokenLimit] = useState(3000000);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const plans = {
    '1499': { name: 'Enterprise Suite', price: 1499 },
    '499': { name: 'Pro SDR Pack', price: 499 },
    '299': { name: 'Support Starter', price: 299 }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    // Generate random API Key
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => b.toString(16).padStart(2, '0')).join('');
    const newApiKey = `mkt_live_${randomHex}`;
    setGeneratedKey(newApiKey);

    const planInfo = plans[selectedPlan];

    onAddTenant({
      name: clientName,
      planName: planInfo.name,
      planPrice: planInfo.price,
      tokensUsed: 15000,
      tokensLimit: tokenLimit,
      apiKey: newApiKey,
      status: 'active',
      avatarLetter: clientName.trim().charAt(0).toUpperCase(),
      joinedDate: new Date().toISOString().split('T')[0]
    });

    onToast(isAr ? `تم تفعيل اشتراك [${clientName}] وتوليد المفتاح بنجاح!` : `Client [${clientName}] onboarded!`);
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      onToast(isAr ? 'تم نسخ مفتاح API إلى الحافظة' : 'API Key copied!');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl space-y-4 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            {isAr ? 'تفعيل اشتراك Enterprise جديد' : 'Onboard Enterprise Tenant'}
          </h3>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'إضافة مؤسسة جديدة وتوليد مفاتيح API آمنة فوراً مع إعداد باقة الاستهلاك'
              : 'Provision enterprise credentials and configure monthly token quotas'}
          </p>
        </div>

        {!generatedKey ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-bold">
                {isAr ? 'اسم الشركة / المؤسسة' : 'Organization Name'}
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={isAr ? 'مثال: شركة الحلول الذكية للتقنية' : 'e.g. Apex Global Solutions'}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">
                {isAr ? 'باقة الاشتراك التجاري' : 'Subscription Plan Tier'}
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="1499">Enterprise Suite ($1,499 / mo)</option>
                <option value="499">Pro SDR Pack ($499 / mo)</option>
                <option value="299">Support Starter ($299 / mo)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">
                {isAr ? 'سقف التوكنز الشهري' : 'Monthly Token Limit'}
              </label>
              <input
                type="number"
                value={tokenLimit}
                onChange={(e) => setTokenLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold transition shadow-lg shadow-emerald-500/20 mt-2 flex items-center justify-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>{isAr ? 'تفعيل العميل وتوليد المفتاح فوراً' : 'Issue API Key & Activate'}</span>
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'تم تفعيل العميل وتوليد مفتاح الـ API بنجاح!' : 'Client Active & Key Generated!'}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-2 rounded-xl border border-emerald-800/60">
              <input
                type="text"
                readOnly
                value={generatedKey}
                className="w-full bg-transparent text-emerald-300 text-xs font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyKey}
                className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800"
                title="Copy Key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              {isAr
                ? 'يرجى حفظ المفتاح وتسليمه لمسؤول التكامل في الشركة، فلن يظهر كاملاً مجدداً.'
                : 'Share this secret key with your client. It will not be revealed in plain text again.'}
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition mt-2"
            >
              {isAr ? 'إغلاق ومتابعة' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAgent: (agent: Agent) => void;
  onToast: (msg: string) => void;
  lang: Language;
}

export const AddAgentModal: React.FC<AddAgentModalProps> = ({
  isOpen,
  onClose,
  onAddAgent,
  onToast,
  lang
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [model, setModel] = useState('Claude 3.5 Sonnet');
  const [price, setPrice] = useState(399);
  const [category, setCategory] = useState('Legal & Ops');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name,
      nameAr: name,
      description: desc,
      descriptionAr: desc,
      icon: 'bot',
      category,
      routedModel: model,
      priceUsd: price,
      priceModel: '/ mo',
      marginPercent: 85,
      escalationRate: 2.5,
      status: 'ready',
      systemPrompt: `You are ${name}. Provide high accuracy domain assistance in Arabic or English.`
    };

    onAddAgent(newAgent);
    onToast(isAr ? `تم إضافة الوكيل [${name}] إلى الكتالوج بنجاح!` : `Agent [${name}] deployed!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl space-y-4 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            {isAr ? 'إضافة وكيل ذكي جديد للكتالوج' : 'Deploy New Commercial Agent'}
          </h3>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'حدد النموذج الموجه وإعدادات التسعير التجاري للوكيل'
              : 'Configure routed foundation model, commercial pricing, and mission objectives'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-bold">
              {isAr ? 'اسم الوكيل التجاري' : 'Agent Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? 'مثال: Legal Contract Reviewer' : 'e.g. Healthcare Intake AI'}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-bold">
              {isAr ? 'وصف المهمة والقيمة التجارية' : 'Mission & Description'}
            </label>
            <textarea
              rows={2}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={isAr ? 'وصف مقتضب لعمل الوكيل وما يوفره للعملاء...' : 'What task does this agent automate?'}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1 font-bold">
                {isAr ? 'النموذج الموجه' : 'Routed Model'}
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="DeepSeek-V3">DeepSeek-V3 ($0.0001/1k)</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet ($0.003/1k)</option>
                <option value="GPT-4o Enterprise">GPT-4o Enterprise ($0.0025/1k)</option>
                <option value="DeepSeek-Flash">DeepSeek-Flash</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">
                {isAr ? 'التسعير الشهري ($)' : 'Monthly Price ($)'}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-lg shadow-indigo-600/30 mt-2 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة الوكيل التجاري فوراً' : 'Deploy to Marketplace Fleet'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
  onToast: (msg: string) => void;
  lang: Language;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onToast,
  lang
}) => {
  if (!isOpen || !invoice) return null;
  const isAr = lang === 'ar';

  const handlePrint = () => {
    window.print();
    onToast(isAr ? 'تم بدء تجهيز طباعة الفاتورة' : 'Printing invoice...');
  };

  const handleExportPDF = () => {
    onToast(isAr ? 'تم تصدير الفاتورة التجارية بنجاح' : 'Invoice exported successfully');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 rounded-3xl space-y-4 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'فاتورة اشتراك تجاري B2B' : 'B2B Enterprise Tax Invoice'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">Invoice #{invoice.id}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
            {isAr ? 'مدفوعة / معتمدة' : 'Paid & Verified'}
          </span>
        </div>

        {/* Client & Date Info */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-400 block text-[10px]">{isAr ? 'العميل المفوتر له:' : 'Billed To:'}</span>
            <strong className="text-white block mt-0.5">{invoice.clientName}</strong>
            <span className="text-slate-400 text-[10px]">{invoice.planName}</span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-slate-400 block text-[10px]">{isAr ? 'تاريخ الاستحقاق:' : 'Due Date:'}</span>
            <span className="text-slate-200 block font-mono mt-0.5">{invoice.dueDate}</span>
            <span className="text-slate-500 text-[10px]">Net 30 Terms</span>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-800/80 text-[11px]">
            <span>{isAr ? 'البيان / الخدمة' : 'Service Description'}</span>
            <span>{isAr ? 'المجموع' : 'Total'}</span>
          </div>
          {invoice.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-slate-200 py-1">
              <span>{item.desc} (x{item.quantity})</span>
              <span className="font-mono text-white">${item.total.toLocaleString()}</span>
            </div>
          ))}

          {/* Subtotal & Total */}
          <div className="pt-3 border-t border-slate-800/80 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{isAr ? 'المبلغ الفرعي:' : 'Subtotal:'}</span>
              <span className="font-mono text-slate-300">${invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{isAr ? 'ضريبة القيمة المضافة (0% B2B Reverse Charge):' : 'VAT / Tax:'}</span>
              <span className="font-mono text-slate-300">$0.00</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold text-sm pt-2 border-t border-slate-800">
              <span>{isAr ? 'الإجمالي المستحق:' : 'Total Amount:'}</span>
              <span className="font-mono">${invoice.amount.toLocaleString()} USD</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800 flex gap-2 print:hidden">
          <button
            onClick={handleExportPDF}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تحميل الفاتورة PDF' : 'Download PDF'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{isAr ? 'طباعة' : 'Print'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
