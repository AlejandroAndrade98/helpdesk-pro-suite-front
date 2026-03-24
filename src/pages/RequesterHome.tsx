import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useTickets } from '@/features/tickets/hooks/useTickets';
import { useCreateTicket } from '@/features/tickets/hooks/useCreateTicket';
import { TicketPriority, TicketStatus } from '@/types/api';
import { ROUTES } from '@/constants/routes';

import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { SkeletonTable } from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const createTicket = useCreateTicket();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<string>('');

  const tickets = data?.items ?? [];

  const activeTickets = tickets.filter((ticket) => activeStatuses.includes(ticket.status));
  const pastTickets = tickets.filter((ticket) => closedStatuses.includes(ticket.status));

  const handleCreate = async () => {
    if (!newTitle.trim() || newPriority === '') return;

    try {
      await createTicket.mutateAsync({
        title: newTitle,
        description: newDescription,
        priority: Number(newPriority) as TicketPriority,
      });

      toast.success(t('tickets:ticketCreated'));
      setDialogOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewPriority('');
    } catch {
      toast.error(t('common:errorOccurred'));
    }
  };

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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('tickets:createTicket')}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('tickets:createTitle')}</DialogTitle>
                <DialogDescription>{t('tickets:createDescription')}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t('tickets:ticketTitle')}</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t('tickets:titlePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('tickets:description')}</Label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder={t('tickets:descriptionPlaceholder')}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('common:priority')}</Label>
                  <Select value={newPriority} onValueChange={setNewPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('tickets:selectPriority')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t('tickets:priorityLow')}</SelectItem>
                      <SelectItem value="2">{t('tickets:priorityMedium')}</SelectItem>
                      <SelectItem value="3">{t('tickets:priorityHigh')}</SelectItem>
                      <SelectItem value="4">{t('tickets:priorityCritical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t('common:cancel')}
                </Button>

                <Button
                  onClick={handleCreate}
                  disabled={createTicket.isPending || !newTitle.trim() || newPriority === ''}
                >
                  {createTicket.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('common:create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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