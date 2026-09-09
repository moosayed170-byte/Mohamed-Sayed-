import { Agent, Tenant, MetricSnapshot, AuditLog } from '../types';

export const INITIAL_METRICS: MetricSnapshot = {
  mrr: 24850,
  netProfit: 18438,
  cogs: 6412,
  ltvCacRatio: '8.4x',
  smartRouterSavings: 4210,
  totalDailyCalls: 184290,
  piiThreatsBlocked: 312
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'sdr-agent',
    name: 'Autonomous SDR Agent',
    nameAr: 'وكيل المبيعات التنفيذي (Autonomous SDR)',
    description: 'Enterprise B2B sales development: qualifies leads, crafts custom pitch decks, and closes contracts automatically.',
    descriptionAr: 'وكيل المبيعات التنفيذي: تأهيل الفرص، صياغة العروض المخصصة وإغلاق الصفقة بأعلى معدل تحويل.',
    icon: 'briefcase',
    category: 'Sales & Revenue',
    routedModel: 'Claude 3.5 Sonnet',
    priceUsd: 499,
    priceModel: '/ mo',
    marginPercent: 82,
    escalationRate: 3.1,
    status: 'ready',
    systemPrompt: 'You are an autonomous senior sales development representative. Your mission is to analyze prospective company needs, calculate ROI, and draft compelling conversion-driven B2B proposals.'
  },
  {
    id: 'support-agent',
    name: 'Support Auto-Resolver',
    nameAr: 'وكيل الدعم الفني التجاري (Auto-Resolver)',
    description: '24/7 omni-channel customer support: connects directly with Zendesk, Stripe & Shopify to issue refunds and resolve disputes.',
    descriptionAr: 'وكيل الدعم الفني التجاري: الربط المباشر مع Zendesk و Shopify لإعادة الأموال وحل المشكلات.',
    icon: 'headset',
    category: 'Customer Experience',
    routedModel: 'DeepSeek-V3 / Flash',
    priceUsd: 299,
    priceModel: '+ $0.05 / ticket',
    marginPercent: 91,
    escalationRate: 1.8,
    status: 'ready',
    systemPrompt: 'You are an empathetic, rapid-response customer service automation specialist. You analyze user tickets, provide step-by-step solutions, and safely initiate policy-compliant resolution actions.'
  },
  {
    id: 'fintech-agent',
    name: 'FinTech Compliance Auditor',
    nameAr: 'مراقب الحسابات ومكافحة الاحتيال (FinTech Auditor)',
    description: 'High-precision financial compliance: real-time AML screening, ledger fraud anomaly detection, and SOX reporting.',
    descriptionAr: 'مراقب الحسابات والقوائم المالية: اكتشاف الاحتيال والشذوذ المحاسبي ومراقبة الامتثال المالي الدولي.',
    icon: 'file-check',
    category: 'FinTech & Security',
    routedModel: 'GPT-4o Enterprise',
    priceUsd: 999,
    priceModel: '/ mo',
    marginPercent: 76,
    escalationRate: 0.2,
    status: 'high_complexity',
    systemPrompt: 'You are a certified forensic accountant and automated FinTech compliance auditor. You verify balance reconciliations, detect transactional anomalies, and cross-reference AML / KYC sanctions lists.'
  },
  {
    id: 'voice-agent',
    name: 'Voice AI Receptionist',
    nameAr: 'المواجهة الصوتية الذكية (Voice AI Receptionist)',
    description: 'Ultra-low latency conversational voice agent: automated telephony triage, calendar bookings, and patient intake.',
    descriptionAr: 'المواجهة الصوتية الذكية: الرد الهاتفي الفوري وتأكيد المواعيد للمستشفيات والشركات الكبرى.',
    icon: 'phone-call',
    category: 'Telephony & Voice',
    routedModel: 'DeepSeek-Flash / Eleven',
    priceUsd: 699,
    priceModel: '/ mo',
    marginPercent: 88,
    escalationRate: 4.2,
    status: 'ready',
    systemPrompt: 'You are an ultra-fast, courteous voice AI receptionist. You confirm client identity, check schedule availability, and log interaction records.'
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'مجموعة الحلول التكنولوجية المتطورة (TechSolutions Gulf)',
    planName: 'Enterprise Suite',
    planPrice: 1499,
    tokensUsed: 3250000,
    tokensLimit: 5000000,
    apiKey: 'mkt_live_8f9a21e4bc39d8e1',
    status: 'active',
    avatarLetter: 'ت',
    joinedDate: '2026-08-12'
  },
  {
    id: 'tenant-2',
    name: 'شركة الخدمات الرقمية السريعة (FastDigital Cloud)',
    planName: 'Pro SDR Pack',
    planPrice: 499,
    tokensUsed: 820000,
    tokensLimit: 2000000,
    apiKey: 'mkt_live_3c4e91a0fa22b109',
    status: 'active',
    avatarLetter: 'ش',
    joinedDate: '2026-08-25'
  },
  {
    id: 'tenant-3',
    name: 'مستشفى الشرق التخصصي (Al-Sharq Medical Center)',
    planName: 'Voice AI Receptionist Pack',
    planPrice: 699,
    tokensUsed: 1450000,
    tokensLimit: 3000000,
    apiKey: 'mkt_live_7d1b54ac8812ee47',
    status: 'active',
    avatarLetter: 'م',
    joinedDate: '2026-09-01'
  }
];

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '23:14:02',
    tag: 'SYSTEM',
    message: 'Commercial Hub v3.2 Engine initialized with Zero-Trust Security.',
    level: 'info'
  },
  {
    id: 'log-2',
    timestamp: '23:15:22',
    tag: 'ROUTER',
    message: 'Request routed to Claude 3.5 Sonnet (Latency: 340ms, Margin: 82%).',
    level: 'success'
  },
  {
    id: 'log-3',
    timestamp: '23:16:11',
    tag: 'SECURITY',
    message: 'PII Sanitizer safely stripped [EMAIL_REDACTED] and [CARD_REDACTED].',
    level: 'warning'
  },
  {
    id: 'log-4',
    timestamp: '23:17:45',
    tag: 'ROUTER',
    message: 'High-throughput batch routed to DeepSeek-V3 (Savings: +38% vs OpenAI).',
    level: 'success'
  }
];
