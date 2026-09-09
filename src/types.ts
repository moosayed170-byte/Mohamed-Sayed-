export type TabId = 'dashboard' | 'agents' | 'tenants' | 'security' | 'sandbox';
export type Language = 'ar' | 'en';

export interface Agent {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: string;
  routedModel: string;
  priceUsd: number;
  priceModel: string; // e.g. "/ شهرياً" or "/ mo"
  marginPercent: number;
  escalationRate: number; // e.g. 3.1%
  status: 'ready' | 'high_complexity' | 'beta';
  systemPrompt: string;
}

export interface Tenant {
  id: string;
  name: string;
  planName: string;
  planPrice: number;
  tokensUsed: number;
  tokensLimit: number;
  apiKey: string;
  status: 'active' | 'suspended';
  avatarLetter: string;
  joinedDate: string;
}

export interface MetricSnapshot {
  mrr: number;
  netProfit: number;
  cogs: number;
  ltvCacRatio: string;
  smartRouterSavings: number;
  totalDailyCalls: number;
  piiThreatsBlocked: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  tag: 'SYSTEM' | 'ROUTER' | 'SECURITY' | 'ONBOARD' | 'SANDBOX' | 'CRITICAL';
  message: string;
  level: 'info' | 'success' | 'warning' | 'danger';
}

export interface ExecutionResult {
  success: boolean;
  agentId: string;
  agentName: string;
  routedModel: string;
  latencyMs: number;
  tokensIn: number;
  tokensOut: number;
  totalTokens: number;
  cogsCostUsd: number;
  billableUsd: number;
  marginPercent: number;
  piiItemsRedacted: number;
  response: string;
}

export interface InvoiceItem {
  desc: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  id: string;
  clientName: string;
  planName: string;
  amount: number;
  dueDate: string;
  createdDate: string;
  items: InvoiceItem[];
}
