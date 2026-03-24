import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { TicketStatus } from '@/types/api';
import { ticketStatusColor } from '@/mappers/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusKeys: Record<TicketStatus, string> = {
  [TicketStatus.Open]: 'tickets:statusOpen',
  [TicketStatus.InProgress]: 'tickets:statusInProgress',
  [TicketStatus.Resolved]: 'tickets:statusResolved',
  [TicketStatus.Closed]: 'tickets:statusClosed',
  [TicketStatus.Cancelled]: 'tickets:statusCancelled',
  [TicketStatus.OnHold]: 'tickets:statusOnHold',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation('tickets');
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
      ticketStatusColor[status],
      className,
    )}>
      {t(statusKeys[status].split(':')[1])}
    </span>
  );
};

export default StatusBadge;
