import { TicketStatus, TicketPriority } from '@/types/api';

export const ticketStatusLabels: Record<TicketStatus, { en: string; es: string }> = {
  [TicketStatus.Open]: { en: 'Open', es: 'Abierto' },
  [TicketStatus.InProgress]: { en: 'In Progress', es: 'En Progreso' },
  [TicketStatus.Resolved]: { en: 'Resolved', es: 'Resuelto' },
  [TicketStatus.Closed]: { en: 'Closed', es: 'Cerrado' },
  [TicketStatus.Cancelled]: { en: 'Cancelled', es: 'Cancelado' },
  [TicketStatus.OnHold]: { en: 'On Hold', es: 'En Espera' },
};

export const ticketPriorityLabels: Record<TicketPriority, { en: string; es: string }> = {
  [TicketPriority.Low]: { en: 'Low', es: 'Baja' },
  [TicketPriority.Medium]: { en: 'Medium', es: 'Media' },
  [TicketPriority.High]: { en: 'High', es: 'Alta' },
  [TicketPriority.Critical]: { en: 'Critical', es: 'Crítica' },
};

export const ticketStatusColor: Record<TicketStatus, string> = {
  [TicketStatus.Open]: 'bg-sky-100 text-sky-700 border-sky-200',
  [TicketStatus.InProgress]: 'bg-amber-100 text-amber-700 border-amber-200',
  [TicketStatus.Resolved]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [TicketStatus.Closed]: 'bg-slate-100 text-slate-600 border-slate-200',
  [TicketStatus.Cancelled]: 'bg-red-100 text-red-600 border-red-200',
  [TicketStatus.OnHold]: 'bg-purple-100 text-purple-700 border-purple-200',
};

export const ticketPriorityColor: Record<TicketPriority, string> = {
  [TicketPriority.Low]: 'bg-slate-100 text-slate-600 border-slate-200',
  [TicketPriority.Medium]: 'bg-blue-100 text-blue-700 border-blue-200',
  [TicketPriority.High]: 'bg-orange-100 text-orange-700 border-orange-200',
  [TicketPriority.Critical]: 'bg-red-100 text-red-700 border-red-200',
};
