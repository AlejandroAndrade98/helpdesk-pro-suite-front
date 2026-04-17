import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import type { ReportsOverview } from '@/types/api';
import {
  Ticket,
  CirclePlus,
  CircleDot,
  Clock,
  Hourglass,
  CheckCircle2,
  Ban,
  PauseCircle,
  UserCheck,
  UserX,
  AlertOctagon,
  ArrowUp,
} from 'lucide-react';

interface KPICard {
  titleKey: string;
  getValue: (overview: ReportsOverview) => number;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

const kpiCards: KPICard[] = [
  { titleKey: 'totalTickets', getValue: (o) => o.totalTickets, icon: Ticket, colorClass: 'text-primary' },
  { titleKey: 'newTickets', getValue: (o) => o.newTickets, icon: CirclePlus, colorClass: 'text-violet-600' },
  { titleKey: 'openTickets', getValue: (o) => o.openTickets, icon: CircleDot, colorClass: 'text-sky-600' },
  { titleKey: 'inProgressTickets', getValue: (o) => o.inProgressTickets, icon: Clock, colorClass: 'text-amber-600' },
  { titleKey: 'waitingOnCustomerTickets', getValue: (o) => o.waitingOnCustomerTickets, icon: Hourglass, colorClass: 'text-orange-600' },
  { titleKey: 'resolvedTickets', getValue: (o) => o.resolvedTickets, icon: CheckCircle2, colorClass: 'text-emerald-600' },
  { titleKey: 'closedTickets', getValue: (o) => o.closedTickets, icon: Ban, colorClass: 'text-slate-600' },
  { titleKey: 'onHoldTickets', getValue: (o) => o.onHoldTickets, icon: PauseCircle, colorClass: 'text-stone-600' },
  { titleKey: 'assignedTickets', getValue: (o) => o.assignedTickets, icon: UserCheck, colorClass: 'text-teal-600' },
  { titleKey: 'unassignedTickets', getValue: (o) => o.unassignedTickets, icon: UserX, colorClass: 'text-red-600' },
  { titleKey: 'criticalTickets', getValue: (o) => o.criticalTickets, icon: AlertOctagon, colorClass: 'text-rose-700' },
  { titleKey: 'highPriorityTickets', getValue: (o) => o.highPriorityTickets, icon: ArrowUp, colorClass: 'text-red-600' },
];

interface ReportsKPICardsProps {
  overview?: ReportsOverview;
  isLoading: boolean;
}

const ReportsKPICards: React.FC<ReportsKPICardsProps> = ({ overview, isLoading }) => {
  const { t } = useTranslation('dashboard');

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {kpiCards.map((card) => (
        <div
          key={card.titleKey}
          className="rounded-xl border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {t(card.titleKey)}
            </p>
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg bg-muted',
                card.colorClass
              )}
            >
              <card.icon className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">
            {card.getValue(overview)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReportsKPICards;