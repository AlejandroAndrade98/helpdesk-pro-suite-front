import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { Comment, CreateCommentRequest } from '@/types/api';

function normalizeComment(raw: any): Comment {
  return {
    id: String(raw.id ?? ''),
    content: raw.content ?? '',
    ticketId: String(raw.ticketId ?? ''),
    userId: String(raw.userId ?? raw.createdBy?.id ?? ''),
    userName: raw.userName ?? raw.createdBy?.displayName ?? '',
    createdAt: raw.createdAtUtc ?? raw.createdAt ?? '',
  };
}

export const commentService = {
  getByTicket: async (ticketId: string): Promise<Comment[]> => {
    const res = await apiClient.get(API_ENDPOINTS.comments.list(ticketId));
    const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
    return raw.map(normalizeComment);
  },
  create: async (ticketId: string, data: CreateCommentRequest): Promise<Comment> => {
    const res = await apiClient.post(API_ENDPOINTS.comments.create(ticketId), data);
    return normalizeComment(res.data);
  },
};
