import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketStatusRequest,
  AssignTicketRequest,
  PaginatedRequest,
  PaginatedResponse,
  TicketStatus,
  TicketPriority,
} from '@/types/api';

type RawUserMini = {
  id?: number;
  displayName?: string;
  email?: string | null;
};

type RawTicket = {
  id?: number;
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  createdBy?: RawUserMini | null;
  assignedTo?: RawUserMini | null;
  createdAtUtc?: string;
  createdAt?: string;
  updatedAtUtc?: string | null;
  updatedAt?: string | null;
};

type CreateTicketResponse = {
  id: number;
};

function normalizeTicket(raw: RawTicket): Ticket {
  return {
    id: Number(raw.id ?? 0),
    title: raw.title ?? '',
    description: raw.description ?? '',
    status: raw.status ?? 1,
    priority: raw.priority ?? 2,
    createdById: Number(raw.createdBy?.id ?? 0),
    createdByName: raw.createdBy?.displayName ?? null,
    assignedToId:
      raw.assignedTo?.id !== undefined && raw.assignedTo?.id !== null
        ? Number(raw.assignedTo.id)
        : null,
    assignedToName: raw.assignedTo?.displayName ?? null,
    createdAt: raw.createdAtUtc ?? raw.createdAt ?? '',
    updatedAt: raw.updatedAtUtc ?? raw.updatedAt ?? '',
  };
}

export const ticketService = {
  getAll: async (
    params: PaginatedRequest = { page: 1, pageSize: 50 }
  ): Promise<PaginatedResponse<Ticket>> => {
    const res = await apiClient.get(API_ENDPOINTS.tickets.list, { params });

    const rawItems: RawTicket[] = Array.isArray(res.data)
      ? res.data
      : (res.data?.items ?? []);

    const items = rawItems.map(normalizeTicket);
    const totalCount = res.data?.total ?? res.data?.totalCount ?? items.length;
    const page = res.data?.page ?? 1;
    const pageSize = res.data?.pageSize ?? items.length;

    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / (pageSize || 1)),
    };
  },

  getById: async (id: string): Promise<Ticket> => {
    const res = await apiClient.get(API_ENDPOINTS.tickets.detail(id));
    return normalizeTicket(res.data);
  },

  create: async (data: CreateTicketRequest): Promise<CreateTicketResponse> => {
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