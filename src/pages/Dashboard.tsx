import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '@/features/tickets/hooks/useTickets';
import { TicketStatus } from '@/types/api';
import { ROUTES } from '@/constants/routes';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/features/dashboard/components/StatsCard';
import StatusBadge from '@/features/tickets/components/StatusBadge';
import PriorityBadge from '@/features/tickets/components/PriorityBadge';
import EmptyState from '@/components/shared/EmptyState';
import { SkeletonCard, SkeletonTable } from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Ticket, CircleDot, Clock, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';

const Dashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'tickets', 'common']);
  const { data, isLoading, isError } = useTickets();
  const navigate = useNavigate();

  const tickets = data?.items ?? [];

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === TicketStatus.Open).length,
    inProgress: tickets.filter((t) => t.status === TicketStatus.InProgress).length,
    resolved: tickets.filter((t) => t.status === TicketStatus.Resolved).length,
  };

  const recentTickets = tickets.slice(0, 5);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive">{t('common:error')}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          {t('common:retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title={t('dashboard:title')} subtitle={t('dashboard:subtitle')} />

      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard titleKey="totalTickets" value={stats.total} icon={Ticket} colorClass="text-primary" />
          <StatsCard titleKey="openTickets" value={stats.open} icon={CircleDot} colorClass="text-sky-600" />
          <StatsCard titleKey="inProgressTickets" value={stats.inProgress} icon={Clock} colorClass="text-amber-600" />
          <StatsCard titleKey="resolvedTickets" value={stats.resolved} icon={CheckCircle2} colorClass="text-emerald-600" />
        </div>
      )}

      {/* Recent Tickets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t('dashboard:recentTickets')}</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.tickets)}>
            {t('dashboard:viewAll')} →
          </Button>
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : recentTickets.length === 0 ? (
          <EmptyState titleKey="noTicketsYet" descriptionKey="noTicketsDescription" ns="dashboard" />
        ) : (
          <div className="rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tickets:ticketTitle')}</TableHead>
                  <TableHead>{t('common:status')}</TableHead>
                  <TableHead>{t('common:priority')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('common:createdAt')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer"
                    onClick={() => navigate(ROUTES.ticketDetail(ticket.id))}
                  >
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell><StatusBadge status={ticket.status} /></TableCell>
                    <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {formatDate(ticket.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
