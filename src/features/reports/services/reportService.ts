import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  ReportsOverview,
  TicketsByStatus,
  TicketsByPriority,
  TicketsTrendPoint,
  AgentWorkloadItem,
  ReportsExportParams,
  ReportFilters,
} from '@/types/api';

type RawReportsOverview = {
  totalTickets?: number;
  newTickets?: number;
  openTickets?: number;
  inProgressTickets?: number;
  waitingOnCustomerTickets?: number;
  resolvedTickets?: number;
  closedTickets?: number;
  onHoldTickets?: number;
  assignedTickets?: number;
  unassignedTickets?: number;
  criticalTickets?: number;
  highPriorityTickets?: number;
};

type RawTicketsByStatus = {
  status?: number;
  count?: number;
};

type RawTicketsByPriority = {
  priority?: number;
  count?: number;
};

type RawTicketsTrendPoint = {
  date?: string;
  count?: number;
};

type RawAgentWorkloadItem = {
  userId?: number;
  displayName?: string;
  role?: number;
  assignedTickets?: number;
  activeTickets?: number;
  resolvedTickets?: number;
  closedTickets?: number;
};

function normalizeReportsOverview(raw: RawReportsOverview): ReportsOverview {
  return {
    totalTickets: raw.totalTickets ?? 0,
    newTickets: raw.newTickets ?? 0,
    openTickets: raw.openTickets ?? 0,
    inProgressTickets: raw.inProgressTickets ?? 0,
    waitingOnCustomerTickets: raw.waitingOnCustomerTickets ?? 0,
    resolvedTickets: raw.resolvedTickets ?? 0,
    closedTickets: raw.closedTickets ?? 0,
    onHoldTickets: raw.onHoldTickets ?? 0,
    assignedTickets: raw.assignedTickets ?? 0,
    unassignedTickets: raw.unassignedTickets ?? 0,
    criticalTickets: raw.criticalTickets ?? 0,
    highPriorityTickets: raw.highPriorityTickets ?? 0,
  };
}

function normalizeTicketsByStatus(raw: RawTicketsByStatus): TicketsByStatus {
  return { status: raw.status ?? 1, count: raw.count ?? 0 };
}

function normalizeTicketsByPriority(raw: RawTicketsByPriority): TicketsByPriority {
  return { priority: raw.priority ?? 1, count: raw.count ?? 0 };
}

function normalizeTicketsTrendPoint(raw: RawTicketsTrendPoint): TicketsTrendPoint {
  return { date: raw.date ?? '', count: raw.count ?? 0 };
}

function normalizeAgentWorkloadItem(raw: RawAgentWorkloadItem): AgentWorkloadItem {
  return {
    userId: raw.userId ?? 0,
    displayName: raw.displayName ?? '',
    role: raw.role ?? 1,
    assignedTickets: raw.assignedTickets ?? 0,
    activeTickets: raw.activeTickets ?? 0,
    resolvedTickets: raw.resolvedTickets ?? 0,
    closedTickets: raw.closedTickets ?? 0,
  };
}

function parseItems<T>(res: any, normalizer: (raw: any) => T): T[] {
  const rawItems: any[] = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
  return rawItems.map(normalizer);
}

export const reportService = {
  getOverview: async (filters?: ReportFilters): Promise<ReportsOverview> => {
    const res = await apiClient.get(API_ENDPOINTS.reports.overview, { params: filters });
    return normalizeReportsOverview(res.data);
  },

  getTicketsByStatus: async (filters?: ReportFilters): Promise<TicketsByStatus[]> => {
    const res = await apiClient.get(API_ENDPOINTS.reports.ticketsByStatus, { params: filters });
    return parseItems(res, normalizeTicketsByStatus);
  },

  getTicketsByPriority: async (filters?: ReportFilters): Promise<TicketsByPriority[]> => {
    const res = await apiClient.get(API_ENDPOINTS.reports.ticketsByPriority, { params: filters });
    return parseItems(res, normalizeTicketsByPriority);
  },

  getTicketsTrend: async (filters?: ReportFilters): Promise<TicketsTrendPoint[]> => {
    const res = await apiClient.get(API_ENDPOINTS.reports.ticketsTrend, { params: filters });
    return parseItems(res, normalizeTicketsTrendPoint);
  },

  getAgentWorkload: async (filters?: ReportFilters): Promise<AgentWorkloadItem[]> => {
    const res = await apiClient.get(API_ENDPOINTS.reports.agentWorkload, { params: filters });
    return parseItems(res, normalizeAgentWorkloadItem);
  },

  exportTickets: async (filters?: ReportsExportParams): Promise<void> => {
    const params: Record<string, string> = {};
    if (filters?.fromUtc) params.fromUtc = filters.fromUtc;
    if (filters?.toUtc) params.toUtc = filters.toUtc;
    if (filters?.status) params.status = String(filters.status);
    if (filters?.priority) params.priority = String(filters.priority);
    if (filters?.assignedToId) params.assignedToId = String(filters.assignedToId);

    const res = await apiClient.get(API_ENDPOINTS.reports.exportTickets, {
      params,
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};