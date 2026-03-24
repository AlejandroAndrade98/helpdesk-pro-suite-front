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
  [TicketStatus.New]: 'statusNew',
  [TicketStatus.Open]: 'statusOpen',
  [TicketStatus.InProgress]: 'statusInProgress',
  [TicketStatus.WaitingOnCustomer]: 'statusWaitingOnCustomer',
  [TicketStatus.Resolved]: 'statusResolved',
  [TicketStatus.Closed]: 'statusClosed',
  [TicketStatus.OnHold]: 'statusOnHold',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation('tickets');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        ticketStatusColor[status],
        className,
      )}
    >
      {t(statusKeys[status])}
    </span>
  );
};

export default StatusBadge;