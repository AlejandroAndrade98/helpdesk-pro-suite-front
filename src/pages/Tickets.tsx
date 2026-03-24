import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '@/features/tickets/hooks/useTickets';
import { useCreateTicket } from '@/features/tickets/hooks/useCreateTicket';
import { TicketStatus, TicketPriority } from '@/types/api';
import { ROUTES } from '@/constants/routes';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/features/tickets/components/StatusBadge';
import PriorityBadge from '@/features/tickets/components/PriorityBadge';
import EmptyState from '@/components/shared/EmptyState';
import { SkeletonTable } from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';

const Tickets: React.FC = () => {
  const { t } = useTranslation(['tickets', 'common']);
  const { data, isLoading, isError } = useTickets();
  const createTicket = useCreateTicket();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<string>('');

  const tickets = data?.items ?? [];

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== 'all' && ticket.status !== Number(filterStatus)) return false;
    if (filterPriority !== 'all' && ticket.priority !== Number(filterPriority)) return false;
    return true;
  });

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
    <div className="space-y-6">
      <PageHeader
        title={t('tickets:title')}
        subtitle={t('tickets:subtitle')}
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />{t('tickets:createTicket')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('tickets:createTitle')}</DialogTitle>
                <DialogDescription>{t('tickets:createDescription')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t('tickets:ticketTitle')}</Label>
                  <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={t('tickets:titlePlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('tickets:description')}</Label>
                  <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder={t('tickets:descriptionPlaceholder')} rows={4} />
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
                <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common:cancel')}</Button>
                <Button onClick={handleCreate} disabled={createTicket.isPending || !newTitle.trim() || newPriority === ''}>
                  {createTicket.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('common:create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t('tickets:filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tickets:allStatuses')}</SelectItem>
            <SelectItem value="1">{t('tickets:statusOpen')}</SelectItem>
            <SelectItem value="2">{t('tickets:statusInProgress')}</SelectItem>
            <SelectItem value="3">{t('tickets:statusResolved')}</SelectItem>
            <SelectItem value="4">{t('tickets:statusClosed')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t('tickets:filterByPriority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tickets:allPriorities')}</SelectItem>
            <SelectItem value="1">{t('tickets:priorityLow')}</SelectItem>
            <SelectItem value="2">{t('tickets:priorityMedium')}</SelectItem>
            <SelectItem value="3">{t('tickets:priorityHigh')}</SelectItem>
            <SelectItem value="4">{t('tickets:priorityCritical')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          titleKey="noTickets"
          descriptionKey="noTicketsDescription"
          ns="tickets"
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />{t('tickets:createTicket')}
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tickets:ticketTitle')}</TableHead>
                <TableHead>{t('common:status')}</TableHead>
                <TableHead>{t('common:priority')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('tickets:assignedTo')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('common:createdAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer"
                  onClick={() => navigate(ROUTES.ticketDetail(ticket.id))}
                >
                  <TableCell className="max-w-xs truncate font-medium">{ticket.title}</TableCell>
                  <TableCell><StatusBadge status={ticket.status} /></TableCell>
                  <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {ticket.assignedToName || t('tickets:unassigned')}
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
    </div>
  );
};

export default Tickets;
