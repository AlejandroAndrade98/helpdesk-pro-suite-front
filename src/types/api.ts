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

export interface CommentAuthor {
  id: number;
  displayName: string;
  email: string | null;
}

export interface Comment {
  id: number;
  body: string;
  isInternal: boolean;
  author: CommentAuthor;
  createdAtUtc: string;
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

// ── Reports ────────────────────────────────────────────

export interface ReportFilters {
  fromUtc?: string;
  toUtc?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: number;
}

export interface ReportsOverview {
  totalTickets: number;
  newTickets: number;
  openTickets: number;
  inProgressTickets: number;
  waitingOnCustomerTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  onHoldTickets: number;
  assignedTickets: number;
  unassignedTickets: number;
  criticalTickets: number;
  highPriorityTickets: number;
}

export interface TicketsByStatus {
  status: TicketStatus;
  count: number;
}

export interface TicketsByPriority {
  priority: TicketPriority;
  count: number;
}

export interface TicketsTrendPoint {
  date: string;
  count: number;
}

export interface AgentWorkloadItem {
  userId: number;
  displayName: string;
  role: UserRole;
  assignedTickets: number;
  activeTickets: number;
  resolvedTickets: number;
  closedTickets: number;
}

export type ReportsExportParams = ReportFilters;

// ── Response DTOs ──────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
}

export interface ApiError {
  message: string;
  status: number;
}