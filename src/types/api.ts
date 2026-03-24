// ── Enums (match API swagger values) ──────────────────

export enum TicketStatus {
  Open = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4,
  Cancelled = 5,
  OnHold = 6,
}

export enum TicketPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

// ── Pagination ────────────────────────────────────────

export interface PaginatedRequest {
  page: number;
  pageSize: number;
  status?: number;
  priority?: number;
  assignedToId?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export enum UserRole {
  Admin = 0,
  Agent = 1,
  Customer = 2,
}

// ── Models ─────────────────────────────────────────────

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdById: string;
  createdByName?: string;
  assignedToId?: string | null;
  assignedToName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  ticketId: string;
  userId: string;
  userName?: string;
  createdAt: string;
}

// ── Request DTOs ───────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface AssignTicketRequest {
  agentId: string;
}

export interface CreateCommentRequest {
  content: string;
}

// ── Response DTOs ──────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
}

export interface ApiError {
  message: string;
  status: number;
}
