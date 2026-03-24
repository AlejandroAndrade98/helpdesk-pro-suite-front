import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { useTickets } from '@/features/tickets/hooks/useTickets';
import { TicketStatus } from '@/types/api';
import { ROUTES } from '@/constants/routes';

import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { SkeletonTable } from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

import StatusBadge from '@/features/tickets/components/StatusBadge';
import PriorityBadge from '@/features/tickets/components/PriorityBadge';
import { formatDate } from '@/lib/formatDate';

const activeStatuses = [
  TicketStatus.New,
  TicketStatus.Open,
  TicketStatus.InProgress,
  TicketStatus.WaitingOnCustomer,
  TicketStatus.OnHold,
];

const closedStatuses = [
  TicketStatus.Resolved,
  TicketStatus.Closed,
];

const RequesterHome: React.FC = () => {
  const { t } = useTranslation(['tickets', 'common']);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTickets();

  const tickets = data?.items ?? [];

  const activeTickets = tickets.filter((ticket) => activeStatuses.includes(ticket.status));
  const pastTickets = tickets.filter((ticket) => closedStatuses.includes(ticket.status));

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
      <PageHeader
        title={t('tickets:myTickets', { defaultValue: 'My Tickets' })}
        subtitle={t('tickets:myTicketsSubtitle', {
          defaultValue: 'Track your active and past support requests',
        })}
        action={
          <Button onClick={() => navigate(ROUTES.tickets)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('tickets:createTicket')}
          </Button>
        }
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t('tickets:activeTickets', { defaultValue: 'Active tickets' })}
        </h2>

        {isLoading ? (
          <SkeletonTable rows={4} />
        ) : activeTickets.length === 0 ? (
          <EmptyState
            titleKey="noActiveTickets"
            descriptionKey="noActiveTicketsDescription"
            ns="tickets"
          />
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
                {activeTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer"
                    onClick={() => navigate(ROUTES.ticketDetail(String(ticket.id)))}
                  >
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {formatDate(ticket.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t('tickets:pastTickets', { defaultValue: 'Past tickets' })}
        </h2>

        {isLoading ? (
          <SkeletonTable rows={4} />
        ) : pastTickets.length === 0 ? (
          <EmptyState
            titleKey="noPastTickets"
            descriptionKey="noPastTicketsDescription"
            ns="tickets"
          />
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
                {pastTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer"
                    onClick={() => navigate(ROUTES.ticketDetail(String(ticket.id)))}
                  >
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {formatDate(ticket.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
};

export default RequesterHome;