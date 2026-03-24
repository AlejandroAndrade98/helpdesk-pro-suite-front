import { TicketPriority, TicketStatus } from '@/types/api';

export const ticketStatusLabels: Record<TicketStatus, { en: string; es: string }> = {
  [TicketStatus.New]: { en: 'New', es: 'Nuevo' },
  [TicketStatus.Open]: { en: 'Open', es: 'Abierto' },
  [TicketStatus.InProgress]: { en: 'In Progress', es: 'En progreso' },
  [TicketStatus.WaitingOnCustomer]: { en: 'Waiting on Customer', es: 'Esperando al cliente' },
  [TicketStatus.Resolved]: { en: 'Resolved', es: 'Resuelto' },
  [TicketStatus.Closed]: { en: 'Closed', es: 'Cerrado' },
  [TicketStatus.OnHold]: { en: 'On Hold', es: 'En espera' },
};

export const ticketPriorityLabels: Record<TicketPriority, { en: string; es: string }> = {
  [TicketPriority.Low]: { en: 'Low', es: 'Baja' },
  [TicketPriority.Medium]: { en: 'Medium', es: 'Media' },
  [TicketPriority.High]: { en: 'High', es: 'Alta' },
  [TicketPriority.Critical]: { en: 'Critical', es: 'Crítica' },
};

export const ticketStatusColor: Record<TicketStatus, string> = {
  [TicketStatus.New]: 'bg-slate-100 text-slate-700 border-slate-200',
  [TicketStatus.Open]: 'bg-sky-100 text-sky-700 border-sky-200',
  [TicketStatus.InProgress]: 'bg-amber-100 text-amber-700 border-amber-200',
  [TicketStatus.WaitingOnCustomer]: 'bg-violet-100 text-violet-700 border-violet-200',
  [TicketStatus.Resolved]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [TicketStatus.Closed]: 'bg-zinc-200 text-zinc-700 border-zinc-300',
  [TicketStatus.OnHold]: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const ticketPriorityColor: Record<TicketPriority, string> = {
  [TicketPriority.Low]: 'bg-slate-100 text-slate-700 border-slate-200',
  [TicketPriority.Medium]: 'bg-blue-100 text-blue-700 border-blue-200',
  [TicketPriority.High]: 'bg-orange-100 text-orange-700 border-orange-200',
  [TicketPriority.Critical]: 'bg-red-100 text-red-700 border-red-200',
};