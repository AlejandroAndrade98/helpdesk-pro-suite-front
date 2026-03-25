import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { Comment, CreateCommentRequest } from '@/types/api';

function normalizeComment(raw: any): Comment {
  return {
    id: Number(raw.id ?? 0),
    body: raw.body ?? '',
    isInternal: Boolean(raw.isInternal),
    author: {
      id: Number(raw.author?.id ?? 0),
      displayName: raw.author?.displayName ?? '',
      email: raw.author?.email ?? null,
    },
    createdAtUtc: raw.createdAtUtc ?? '',
  };
}

export const commentService = {
  getByTicket: async (ticketId: string): Promise<Comment[]> => {
    const res = await apiClient.get(API_ENDPOINTS.comments.list(ticketId));
    const raw = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
    return raw.map(normalizeComment);
  },

  create: async (ticketId: string, data: CreateCommentRequest) => {
    const res = await apiClient.post(API_ENDPOINTS.comments.create(ticketId), data);
    return res.data;
  },
};