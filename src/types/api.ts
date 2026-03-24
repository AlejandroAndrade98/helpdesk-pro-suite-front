// ── Enums (match API swagger values) ──────────────────

export enum TicketStatus {
  New = 1,
  Open = 2,
  InProgress = 3,
  WaitingOnCustomer = 4,
  Resolved = 5,
  Closed = 6,
  OnHold = 7,
}

export enum TicketPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

export enum UserRole {
  Requester = 1,
  Agent = 2,
  Admin = 3,
}

// ── Pagination ────────────────────────────────────────

export interface PaginatedRequest {
  page: number;
  pageSize: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Models ─────────────────────────────────────────────

export interface User {
  id: number;
  displayName: string;
  email: string;
  role: UserRole;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdById: number;
  createdByName?: string;
  assignedToId?: number | null;
  assignedToName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  body: string;
  isInternal: boolean;
  ticketId: number;
  userId: number;
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
  assignedToId?: number | null;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface AssignTicketRequest {
  assignedToId?: number | null;
}

export interface CreateCommentRequest {
  body: string;
  isInternal: boolean;
}

// ── Response DTOs ──────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
}

export interface ApiError {
  message: string;
  status: number;
}