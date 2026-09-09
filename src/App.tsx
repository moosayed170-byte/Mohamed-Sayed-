import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { AgentCatalogView } from './components/AgentCatalogView';
import { TenantsView } from './components/TenantsView';
import { SecurityView } from './components/SecurityView';
import { SandboxView } from './components/SandboxView';
import { OnboardModal, AddAgentModal, InvoiceModal } from './components/Modals';
import { Toast } from './components/Toast';

import {
  TabId,
  Language,
  Agent,
  Tenant,
  MetricSnapshot,
  AuditLog,
  InvoiceData
} from './types';

import {
  INITIAL_METRICS,
  INITIAL_AGENTS,
  INITIAL_TENANTS,
  INITIAL_LOGS
} from './data/initialData';

export default function App() {
  // State
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [metrics, setMetrics] = useState<MetricSnapshot>(INITIAL_METRICS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);

  const [selectedAgentForTesting, setSelectedAgentForTesting] = useState<Agent | null>(INITIAL_AGENTS[0]);
  const [isTelemetryActive, setIsTelemetryActive] = useState<boolean>(true);
  const [isKillSwitchActive, setIsKillSwitchActive] = useState<boolean>(false);

  // Modals state
  const [isOnboardOpen, setIsOnboardOpen] = useState<boolean>(false);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState<boolean>(false);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const addLog = (
    tag: 'SYSTEM' | 'ROUTER' | 'SECURITY' | 'ONBOARD' | 'SANDBOX' | 'CRITICAL',
    message: string,
    level: 'info' | 'success' | 'warning' | 'danger' = 'info'
  ) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      tag,
      message,
      level
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Sync document language & direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Live Telemetry Loop
  useEffect(() => {
    if (!isTelemetryActive || isKillSwitchActive) return;

    const interval = setInterval(() => {
      const models = ['DeepSeek-V3', 'Claude 3.5 Sonnet', 'GPT-4o Enterprise', 'DeepSeek-Flash'];
      const model = models[Math.floor(Math.random() * models.length)];
      const latency = Math.floor(Math.random() * 150) + 220;
      const cogs = (Math.random() * 0.0003 + 0.00008).toFixed(5);

      addLog(
        'ROUTER',
        `Routed execution to ${model} (${latency}ms) - Cost: $${cogs} - Margin: 86%`,
        'success'
      );
    }, 7500);

    return () => clearInterval(interval);
  }, [isTelemetryActive, isKillSwitchActive]);

  // Emergency Kill Switch
  const handleToggleKillSwitch = () => {
    const nextState = !isKillSwitchActive;
    setIsKillSwitchActive(nextState);
    if (nextState) {
      addLog('CRITICAL', 'EMERGENCY SHUTDOWN ACTIVATED: All agent executions frozen.', 'danger');
      showToast(lang === 'ar' ? 'تحذير: تم تفعيل زر الإيقاف السريع منصة الأداء' : 'Kill Switch engaged!');
    } else {
      addLog('SYSTEM', 'System restored to nominal commercial operational state.', 'success');
      showToast(lang === 'ar' ? 'تم استئناف تشغيل النظام الطبيعي' : 'System nominal operations resumed.');
    }
  };

  // Telemetry Toggle
  const handleToggleTelemetry = () => {
    const next = !isTelemetryActive;
    setIsTelemetryActive(next);
    showToast(
      lang === 'ar'
        ? next ? 'تم استئناف البث المباشر للعمليات' : 'تم إيقاف البث المباشر مؤقتاً'
        : next ? 'Live telemetry resumed.' : 'Live telemetry paused.'
    );
  };

  // Onboard Tenant
  const handleAddTenant = (newTenantData: Omit<Tenant, 'id' | 'createdAt'>) => {
    const newTenant: Tenant = {
      ...newTenantData,
      id: `tenant-${Date.now()}`
    };

    setTenants((prev) => [newTenant, ...prev]);

    // Update MRR & Net Profit
    setMetrics((prev) => {
      const newMrr = prev.mrr + newTenant.planPrice;
      const newProfit = Math.round(newMrr * 0.742);
      return {
        ...prev,
        mrr: newMrr,
        netProfit: newProfit
      };
    });

    addLog('ONBOARD', `New enterprise tenant active: ${newTenant.name} (${newTenant.planName}).`, 'success');
    setIsOnboardOpen(false);
  };

  // Add Agent
  const handleAddAgent = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    addLog('SYSTEM', `New agent deployed to fleet: ${newAgent.name} (${newAgent.routedModel}).`, 'success');
    setIsAddAgentOpen(false);
  };

  // Test Agent Trigger
  const handleTestAgent = (agent: Agent) => {
    setSelectedAgentForTesting(agent);
    setActiveTab('sandbox');
    showToast(
      lang === 'ar'
        ? `تم تحديد الوكيل [${agent.nameAr}] للاختبار في Sandbox`
        : `Selected [${agent.name}] for live sandbox execution`
    );
  };

  // Toggle Tenant Status
  const handleToggleTenantStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextStatus = t.status === 'active' ? 'suspended' : 'active';
          showToast(
            lang === 'ar'
              ? nextStatus === 'active' ? `تم تفعيل حساب [${t.name}]` : `تم تعليق حساب [${t.name}]`
              : nextStatus === 'active' ? `Tenant activated` : `Tenant suspended`
          );
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Generate Invoice
  const handleGenerateInvoice = (tenant: Tenant) => {
    const invoice: InvoiceData = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: tenant.name,
      planName: tenant.planName,
      amount: tenant.planPrice,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      items: [
        {
          desc: `${tenant.planName} Monthly Enterprise License`,
          quantity: 1,
          unitPrice: tenant.planPrice,
          total: tenant.planPrice
        },
        {
          desc: 'Smart Model Routing & PII Sanitizer SLA',
          quantity: 1,
          unitPrice: 0,
          total: 0
        }
      ]
    };
    setActiveInvoice(invoice);
  };

  // Copy API Key
  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast(lang === 'ar' ? 'تم نسخ مفتاح الـ API إلى الحافظة' : 'API Key copied!');
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col justify-between bg-[#060913] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white"
    >
      {/* Top Header */}
      <Header
        metrics={metrics}
        isTelemetryActive={isTelemetryActive}
        onToggleTelemetry={handleToggleTelemetry}
        isKillSwitchActive={isKillSwitchActive}
        onToggleKillSwitch={handleToggleKillSwitch}
        onOpenOnboard={() => setIsOnboardOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      />

      {/* Emergency Kill Switch Banner */}
      <EmergencyBanner isVisible={isKillSwitchActive} lang={lang} />

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} lang={lang} />

      {/* Main Views Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <DashboardView metrics={metrics} lang={lang} onToast={showToast} />
        )}

        {activeTab === 'agents' && (
          <AgentCatalogView
            agents={agents}
            onOpenAddModal={() => setIsAddAgentOpen(true)}
            onTestAgent={handleTestAgent}
            lang={lang}
          />
        )}

        {activeTab === 'tenants' && (
          <TenantsView
            tenants={tenants}
            onOpenOnboard={() => setIsOnboardOpen(true)}
            onGenerateInvoice={handleGenerateInvoice}
            onToggleStatus={handleToggleTenantStatus}
            onCopyApiKey={handleCopyApiKey}
            lang={lang}
          />
        )}

        {activeTab === 'security' && (
          <SecurityView
            logs={logs}
            onClearLogs={() => setLogs([])}
            onAddLog={addLog}
            lang={lang}
          />
        )}

        {activeTab === 'sandbox' && (
          <SandboxView
            agents={agents}
            selectedAgent={selectedAgentForTesting}
            onSelectAgent={setSelectedAgentForTesting}
            isKillSwitchActive={isKillSwitchActive}
            onToast={showToast}
            onAddLog={addLog}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            {lang === 'ar'
              ? 'مركز العمليات التجارية وإطلاق وكلاء الذكاء الاصطناعي — نظام تحقيق الأرباح وتشغيل النماذج © 2026'
              : 'AI Agents Commercial Hub — Launch & Monetization Operating System © 2026'}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {lang === 'ar' ? 'كافة الأنظمة تعمل بكفاءة 100%' : 'All Systems Operational 100%'}
            </span>
            <span className="text-slate-400">SLA: 99.99% Guaranteed</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OnboardModal
        isOpen={isOnboardOpen}
        onClose={() => setIsOnboardOpen(false)}
        onAddTenant={handleAddTenant}
        onToast={showToast}
        lang={lang}
      />

      <AddAgentModal
        isOpen={isAddAgentOpen}
        onClose={() => setIsAddAgentOpen(false)}
        onAddAgent={handleAddAgent}
        onToast={showToast}
        lang={lang}
      />

      <InvoiceModal
        isOpen={Boolean(activeInvoice)}
        onClose={() => setActiveInvoice(null)}
        invoice={activeInvoice}
        onToast={showToast}
        lang={lang}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
