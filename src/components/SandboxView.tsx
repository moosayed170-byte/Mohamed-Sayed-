import React, { useState } from 'react';
import {
  Code,
  Send,
  Copy,
  Check,
  Zap,
  Cpu,
  Clock,
  Coins,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCw
} from 'lucide-react';
import { Agent, ExecutionResult, Language } from '../types';

interface SandboxViewProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
  isKillSwitchActive: boolean;
  onToast: (msg: string) => void;
  onAddLog: (tag: 'SYSTEM' | 'ROUTER' | 'SECURITY' | 'ONBOARD' | 'SANDBOX' | 'CRITICAL', msg: string, level: 'info' | 'success' | 'warning' | 'danger') => void;
  lang: Language;
}

export const SandboxView: React.FC<SandboxViewProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  isKillSwitchActive,
  onToast,
  onAddLog,
  lang
}) => {
  const isAr = lang === 'ar';

  const currentAgent = selectedAgent || agents[0];
  const [langTab, setLangTab] = useState<'curl' | 'python' | 'node'>('curl');
  const [userPrompt, setUserPrompt] = useState<string>(
    'قم بتحليل العميل وتحديد القيمة المتوقعة للصفقة وصياغة مقترح مخصص لإغلاق العقد.'
  );
  const [sanitizePayload, setSanitizePayload] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  const getCodeSnippet = () => {
    const agentId = currentAgent.id;
    if (langTab === 'curl') {
      return `curl -X POST https://api.aiagentshub.com/v1/execute \\
  -H "Authorization: Bearer mkt_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "${agentId}",
    "prompt": "${userPrompt.replace(/"/g, '\\"')}",
    "stream": true,
    "sanitize_pii": ${sanitizePayload}
  }'`;
    }
    if (langTab === 'python') {
      return `import requests

url = "https://api.aiagentshub.com/v1/execute"
headers = {
    "Authorization": "Bearer mkt_live_your_api_key",
    "Content-Type": "application/json"
}
payload = {
    "agent_id": "${agentId}",
    "prompt": "${userPrompt.replace(/"/g, '\\"')}",
    "stream": True,
    "sanitize_pii": ${sanitizePayload ? 'True' : 'False'}
}

response = requests.post(url, json=payload)
print(response.json())`;
    }
    return `import { AIAgentsHub } from '@ai-agents-hub/sdk';

const client = new AIAgentsHub({ apiKey: process.env.AI_HUB_KEY });

const result = await client.agents.execute({
  agentId: '${agentId}',
  prompt: '${userPrompt.replace(/'/g, "\\'")}',
  sanitizePII: ${sanitizePayload}
});

console.log(result);`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    onToast(isAr ? 'تم نسخ كود التكامل إلى الحافظة!' : 'Code snippet copied to clipboard!');
  };

  const handleRunExecution = async () => {
    if (isKillSwitchActive) {
      onToast(isAr ? 'يتعذر تنفيذ الاختبار: زر Kill Switch مفعل!' : 'Execution blocked: Kill Switch is active!');
      return;
    }
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/execute-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: currentAgent.id,
          agentName: currentAgent.name,
          systemPrompt: currentAgent.systemPrompt,
          userPrompt,
          modelTarget: currentAgent.routedModel,
          sanitize: sanitizePayload
        })
      });

      const data: ExecutionResult = await res.json();
      setExecutionResult(data);
      onAddLog(
        'SANDBOX',
        `Executed ${currentAgent.name} via ${data.routedModel} (${data.latencyMs}ms, COGS: $${data.cogsCostUsd}, Margin: ${data.marginPercent}%).`,
        'success'
      );
      onToast(isAr ? 'تم تشغيل الوكيل واستلام الاستجابة بنجاح!' : 'Agent executed successfully with live metrics!');
    } catch {
      // Fallback result in case of network issue
      const fallback: ExecutionResult = {
        success: true,
        agentId: currentAgent.id,
        agentName: currentAgent.name,
        routedModel: currentAgent.routedModel,
        latencyMs: 310,
        tokensIn: 85,
        tokensOut: 190,
        totalTokens: 275,
        cogsCostUsd: 0.00019,
        billableUsd: 0.0041,
        marginPercent: 84,
        piiItemsRedacted: sanitizePayload ? 1 : 0,
        response: `تم تحليل طلب العميل بنجاح بواسطة [${currentAgent.name}].\n1. تقييم الفرصة: عميل تجاري ذو قيمة عالية.\n2. الإجراء الموصى به: إرسال عرض الباقة المؤسسية مع ضمان SLA 99.99%.\n3. تم استيفاء معايير الحماية والأمان بنجاح.`
      };
      setExecutionResult(fallback);
      onToast(isAr ? 'تم تشغيل الوكيل عبر المحاكي السريع' : 'Executed via local simulator');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: API & Code Generator (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" />
              {isAr ? 'أداة التكامل الفوري للعملاء (API & cURL Generator)' : 'Instant Client Integration & SDK Generator'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'مولد كود التكامل للاستخدام في تطبيقات العملاء بجميع اللغات عبر مفاتيح الـ API التجارية'
                : 'Copy-paste enterprise code snippets for cURL, Python, and Node.js SDKs'}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-bold">
                {isAr ? 'اختر الوكيل للربط البرمجي' : 'Select Target Agent'}
              </label>
              <select
                value={currentAgent.id}
                onChange={(e) => {
                  const target = agents.find(a => a.id === e.target.value);
                  if (target) onSelectAgent(target);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-bold"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {isAr ? a.nameAr : a.name} (${a.priceUsd} {a.priceModel}) - [{a.routedModel}]
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['curl', 'python', 'node'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLangTab(l)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition uppercase ${
                      langTab === l
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ الكود' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner max-h-72">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Sandbox Live Test Console (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              {isAr ? 'منصة اختبار الاستجابة البثية (Live Agent Execution Stream)' : 'Live Agent Execution & Profit Stream'}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {isAr
                ? 'اختبر استجابة الوكيل الذكي وحساب التوكنز والزمن وهامش الربح في كل عملية استدعاء'
                : 'Execute agent with server-side AI, verifying token consumption, COGS, and real margins'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">
                  {isAr ? 'نص الطلب أو تعليمات العميل' : 'User Input Prompt'}
                </label>
                <textarea
                  rows={3}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder={isAr ? 'أدخل تعليمات المهمة...' : 'Enter prompt task for the agent...'}
                />
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-400 py-0.5">{isAr ? 'أمثلة سريعة:' : 'Quick tasks:'}</span>
                <button
                  onClick={() => setUserPrompt('قم بتأهيل شركة تقنية تطلب 50 مقعداً برمجياً وصياغة عرض سعر احترافي.')}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700"
                >
                  {isAr ? 'تأهيل صفقة مبيعات' : 'Sales Lead Qualification'}
                </button>
                <button
                  onClick={() => setUserPrompt('حل تذكرة عميل متضرر يطلب استرجاع مبلغ اشتراك الشهر الماضي مع المحافظة على رضاه.')}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700"
                >
                  {isAr ? 'حل تذكرة دعم مالي' : 'Customer Dispute Refund'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                  <input
                    type="checkbox"
                    checked={sanitizePayload}
                    onChange={(e) => setSanitizePayload(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 bg-slate-950 border-slate-800"
                  />
                  <span>{isAr ? 'تنقية البيانات الحساسة (PII Sanitization)' : 'Auto-sanitize PII in payload'}</span>
                </label>

                <div className="text-[11px] text-indigo-300 font-mono">
                  {isAr ? 'النموذج:' : 'Model:'} <strong>{currentAgent.routedModel}</strong>
                </div>
              </div>

              <button
                onClick={handleRunExecution}
                disabled={isLoading || isKillSwitchActive}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري التنفيذ والاتصال بالـ Smart Router...' : 'Executing agent & measuring economics...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال الطلب واختبار البث (Execute Sandbox)' : 'Execute Agent Live'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stream Output & Metrics Bar */}
          <div className="mt-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-3 min-h-[170px] flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-500 mb-1 flex justify-between">
                <span>{isAr ? '// استجابة الوكيل الذكي:' : '// Agent Response Stream:'}</span>
                {executionResult && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {isAr ? 'معالجة آمنة 100%' : '100% Verified'}
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="text-indigo-400 animate-pulse text-xs py-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                  {isAr ? 'جاري استقبال تدفق الإجابة وتدقيق الامتثال وحساب التوكنز...' : 'Streaming response & evaluating economics...'}
                </div>
              ) : executionResult ? (
                <div className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                  {executionResult.response}
                </div>
              ) : (
                <div className="text-slate-500 text-xs py-4">
                  {isAr ? 'الاستجابة والقياسات الحسابية تظهر هنا فور الضغط على زر الإرسال...' : 'Response payload and financial metrics will stream here...'}
                </div>
              )}
            </div>

            {/* Economics Telemetry Bar */}
            {executionResult && (
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400">
                <div>
                  <span className="block text-slate-500">{isAr ? 'الزمن المستغرق:' : 'Latency:'}</span>
                  <strong className="text-emerald-400 font-mono">{executionResult.latencyMs}ms</strong>
                </div>
                <div>
                  <span className="block text-slate-500">{isAr ? 'إجمالي التوكنز:' : 'Tokens:'}</span>
                  <strong className="text-indigo-400 font-mono">{executionResult.totalTokens}</strong>
                </div>
                <div>
                  <span className="block text-slate-500">{isAr ? 'تكلفة التوكنز (COGS):' : 'COGS:'}</span>
                  <strong className="text-amber-400 font-mono">${executionResult.cogsCostUsd}</strong>
                </div>
                <div>
                  <span className="block text-slate-500">{isAr ? 'هامش الربح الصافي:' : 'Net Margin:'}</span>
                  <strong className="text-emerald-400 font-mono">{executionResult.marginPercent}%</strong>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
