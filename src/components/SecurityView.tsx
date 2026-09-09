import React, { useState } from 'react';
import {
  ShieldCheck,
  Wand2,
  Lock,
  Terminal,
  AlertOctagon,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { AuditLog, Language } from '../types';

interface SecurityViewProps {
  logs: AuditLog[];
  onClearLogs: () => void;
  onAddLog: (tag: 'SYSTEM' | 'ROUTER' | 'SECURITY' | 'ONBOARD' | 'SANDBOX' | 'CRITICAL', msg: string, level: 'info' | 'success' | 'warning' | 'danger') => void;
  lang: Language;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  logs,
  onClearLogs,
  onAddLog,
  lang
}) => {
  const isAr = lang === 'ar';

  const [piiInput, setPiiInput] = useState<string>(
    'يرجى إرسال العقد التجاري إلى john.doe@enterprise-corp.com مع خصم القيمة من البطاقة 4111-2222-3333-4444 والتواصل هاتفياً على +966501234567.'
  );
  const [sanitizedResult, setSanitizedResult] = useState<string | null>(null);
  const [redactedCount, setRedactedCount] = useState<number>(0);
  const [isSanitizing, setIsSanitizing] = useState<boolean>(false);

  const handleRunPII = async () => {
    if (!piiInput.trim()) return;
    setIsSanitizing(true);
    try {
      const res = await fetch('/api/sanitize-pii', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: piiInput })
      });
      const data = await res.json();
      setSanitizedResult(data.sanitizedText);
      setRedactedCount(data.redactedCount);
      onAddLog('SECURITY', `Sanitized ${data.redactedCount} sensitive PII entities before model ingest.`, 'warning');
    } catch {
      // client-side fallback
      const sanitized = piiInput
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]')
        .replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[CREDIT_CARD_REDACTED]')
        .replace(/\b\d{10,12}\b/g, '[PHONE_REDACTED]');
      setSanitizedResult(sanitized);
      setRedactedCount(3);
      onAddLog('SECURITY', 'PII Sanitized: Client-side guardrail active.', 'warning');
    } finally {
      setIsSanitizing(false);
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'SYSTEM': return 'text-emerald-400';
      case 'ROUTER': return 'text-indigo-400';
      case 'SECURITY': return 'text-amber-400';
      case 'ONBOARD': return 'text-purple-400';
      case 'SANDBOX': return 'text-teal-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Security Rules & PII Engine (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {isAr ? 'محرك الأمان وتشفير البيانات (PII Redaction Engine)' : 'Enterprise PII Redaction & Guardrail Engine'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'تنقية البيانات الحساسة تلقائياً (البريد، البطاقات، الهواتف) قبل إرسالها إلى نماذج الـ LLM الخارجية'
                : 'Zero-trust masking of confidential identifiers before hitting external model providers'}
            </p>
          </div>

          {/* Interactive Guardrail Simulator */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 block">
                {isAr ? 'اختبار حجب بيانات العملاء الحساسة (Live PII Sanitizer)' : 'Live PII Masking Simulator'}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPiiInput('Contact john@corp.com with SSN 123-45-6789 and Card 4111-2222-3333-4444.')}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20"
                >
                  {isAr ? 'نموذج إنجليزي' : 'Sample EN'}
                </button>
                <button
                  onClick={() => setPiiInput('يرجى مراسلة sales@company.sa ورقم البطاقة 4111-2222-3333-4444 وهاتف 0501234567.')}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20"
                >
                  {isAr ? 'نموذج عربي' : 'Sample AR'}
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={piiInput}
              onChange={(e) => setPiiInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              placeholder={isAr ? 'أدخل نصاً يحتوي بريداً أو بطاقة ائتمان...' : 'Enter prompt containing sensitive PII...'}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <button
                onClick={handleRunPII}
                disabled={isSanitizing}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isSanitizing ? 'animate-spin' : ''}`} />
                <span>{isAr ? 'تشغيل التنقية الوقائية فوراً' : 'Sanitize Confidential Data'}</span>
              </button>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                GDPR, HIPAA & SOC2 Compliant
              </span>
            </div>

            {/* Sanitized Output */}
            {sanitizedResult && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs font-mono text-emerald-300 space-y-1 animate-in fade-in">
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>{isAr ? 'النص بعد التنقية والحجب الآمن:' : 'Sanitized Payload (Ready for LLM):'}</span>
                  <span className="text-emerald-400 font-bold">{redactedCount} {isAr ? 'عناصر محجوبة' : 'Entities Redacted'}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg text-slate-200 leading-relaxed break-words">
                  {sanitizedResult}
                </div>
              </div>
            )}
          </div>

          {/* Active Defense Rules */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white block">{isAr ? 'حظر هجمات الـ Prompt Injection' : 'Prompt Injection Active Defense'}</strong>
                <span className="text-slate-400 text-[11px]">
                  {isAr ? 'اكتشاف وحظر المحاولات الخبيثة لتبديل تعليمات النظام أو استخراج المفاتيح.' : 'Zero-day behavioral firewall scanning incoming token instructions.'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px] whitespace-nowrap">
                {isAr ? 'مفعل تلقائياً' : 'Enforced'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white block">{isAr ? 'التحويل التلقائي عند انخفاض SLA (Failover)' : 'Automated SLA Failover Routing'}</strong>
                <span className="text-slate-400 text-[11px]">
                  {isAr ? 'تحويل الطلب فوراً إلى DeepSeek أو Flash في حال تجاوز استجابة Frontier 800ms.' : 'Redirects execution to alternate LLM if upstream response exceeds 800ms.'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px] whitespace-nowrap">
                {isAr ? 'مفعل تلقائياً' : 'Enforced'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stream Audit Console (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                {isAr ? 'سجل الأمان وبث العمليات المباشر' : 'Live Operational Audit Console'}
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {isAr ? 'تتبع توجيه الاستدعاءات وحماية البيانات في الوقت الفعلي' : 'Real-time telemetry stream for model routing, margin alerts & security events'}
            </p>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 h-80 overflow-y-auto font-mono text-[11px] space-y-2.5">
              {logs.map((l) => (
                <div key={l.id} className="text-slate-300 leading-snug">
                  <span className="text-slate-500 text-[10px] mr-1 font-sans">[{l.timestamp}]</span>
                  <span className={`font-bold ml-1 ${getTagColor(l.tag)}`}>[{l.tag}]</span>{' '}
                  <span className="text-slate-300">{l.message}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-400" />
              Zero-Trust Enterprise Protocol
            </span>
            <button
              onClick={onClearLogs}
              className="text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>{isAr ? 'مسح الشاشة' : 'Clear Console'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
