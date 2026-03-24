import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { TicketPriority } from '@/types/api';
import { ticketPriorityColor } from '@/mappers/ticket';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const priorityKeys: Record<TicketPriority, string> = {
  [TicketPriority.Low]: 'priorityLow',
  [TicketPriority.Medium]: 'priorityMedium',
  [TicketPriority.High]: 'priorityHigh',
  [TicketPriority.Critical]: 'priorityCritical',
};

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const { t } = useTranslation('tickets');
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
      ticketPriorityColor[priority],
      className,
    )}>
      {t(priorityKeys[priority])}
    </span>
  );
};

export default PriorityBadge;
