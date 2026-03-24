import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { Ticket, CreateTicketRequest, UpdateTicketStatusRequest, AssignTicketRequest, PaginatedRequest, PaginatedResponse } from '@/types/api';

/** Maps a raw API ticket object to the frontend Ticket shape */
function normalizeTicket(raw: any): Ticket {
  return {
    id: String(raw.id),
    title: raw.title ?? '',
    description: raw.description ?? '',
    status: raw.status,
    priority: raw.priority,
    createdById: raw.createdBy?.id ? String(raw.createdBy.id) : '',
    createdByName: raw.createdBy?.displayName ?? null,
    assignedToId: raw.assignedTo?.id ? String(raw.assignedTo.id) : null,
    assignedToName: raw.assignedTo?.displayName ?? null,
    createdAt: raw.createdAtUtc ?? raw.createdAt ?? '',
    updatedAt: raw.updatedAtUtc ?? raw.updatedAt ?? '',
  };
}

export const ticketService = {
  getAll: async (params: PaginatedRequest = { page: 1, pageSize: 50 }): Promise<PaginatedResponse<Ticket>> => {
    console.log('[ticketService.getAll] request params:', params);
    const res = await apiClient.get(API_ENDPOINTS.tickets.list, { params });
    console.log('[ticketService.getAll] response status:', res.status);
    console.log('[ticketService.getAll] raw items:', res.data?.items);

    const rawItems = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
    const items = rawItems.map(normalizeTicket);
    const totalCount = res.data?.total ?? res.data?.totalCount ?? items.length;
    const page = res.data?.page ?? 1;
    const pageSize = res.data?.pageSize ?? items.length;

    return { items, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / (pageSize || 1)) };
  },
  getById: async (id: string): Promise<Ticket> => {
    const res = await apiClient.get(API_ENDPOINTS.tickets.detail(id));
    console.log('[ticketService.getById] raw:', res.data);
    return normalizeTicket(res.data);
  },
  create: async (data: CreateTicketRequest): Promise<Ticket> => {
    const res = await apiClient.post(API_ENDPOINTS.tickets.create, data);
    return res.data;
  },
  updateStatus: async (id: string, data: UpdateTicketStatusRequest): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.tickets.status(id), data);
  },
  assign: async (id: string, data: AssignTicketRequest): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.tickets.assign(id), data);
  },
};
