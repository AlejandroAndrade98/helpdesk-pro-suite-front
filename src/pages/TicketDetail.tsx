import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTicket } from '@/features/tickets/hooks/useTicket';
import { useUpdateTicketStatus } from '@/features/tickets/hooks/useUpdateStatus';
import { useAssignTicket } from '@/features/tickets/hooks/useAssignTicket';
import { useAgents } from '@/features/users/hooks/useUsers';
import { useComments } from '@/features/comments/hooks/useComments';
import { useCreateComment } from '@/features/comments/hooks/useCreateComment';
import { TicketStatus } from '@/types/api';
import StatusBadge from '@/features/tickets/components/StatusBadge';
import PriorityBadge from '@/features/tickets/components/PriorityBadge';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Send, UserCircle } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['tickets', 'common']);

  const { data: ticket, isLoading, isError } = useTicket(id!);
  const { data: agents } = useAgents();
  const { data: comments, isLoading: commentsLoading } = useComments(id!);
  const updateStatus = useUpdateTicketStatus(id!);
  const assignTicket = useAssignTicket(id!);
  const createComment = useCreateComment(id!);

  const [commentText, setCommentText] = React.useState('');

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ status: Number(status) as TicketStatus });
      toast.success(t('tickets:statusUpdated'));
    } catch {
      toast.error(t('common:errorOccurred'));
    }
  };

  const handleAssign = async (agentId: string) => {
    try {
      await assignTicket.mutateAsync({ agentId });
      toast.success(t('tickets:ticketAssigned'));
    } catch {
      toast.error(t('common:errorOccurred'));
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await createComment.mutateAsync({ content: commentText });
      setCommentText('');
    } catch {
      toast.error(t('common:errorOccurred'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive">{t('common:error')}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          {t('common:back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title={ticket.title} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('tickets:description')}
            </h3>
            <p className="text-foreground leading-relaxed" style={{ overflowWrap: 'break-word' }}>
              {ticket.description}
            </p>
          </div>

          {/* Comments */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('tickets:comments')} {comments && `(${comments.length})`}
            </h3>

            {commentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 rounded-lg bg-muted/50 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <UserCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {comment.userName || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt, 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground" style={{ overflowWrap: 'break-word' }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t('common:noResults')}
              </p>
            )}

            {/* Add comment */}
            <div className="mt-4 flex gap-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t('tickets:descriptionPlaceholder')}
                rows={2}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleComment}
                disabled={createComment.isPending || !commentText.trim()}
                className="shrink-0 self-end"
              >
                {createComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
            {/* Status */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('common:status')}
              </p>
              <div className="flex items-center gap-2">
                <StatusBadge status={ticket.status} />
              </div>
              <Select
                value={String(ticket.status)}
                onValueChange={handleStatusChange}
                disabled={updateStatus.isPending}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t('tickets:changeStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('tickets:statusOpen')}</SelectItem>
                  <SelectItem value="2">{t('tickets:statusInProgress')}</SelectItem>
                  <SelectItem value="3">{t('tickets:statusResolved')}</SelectItem>
                  <SelectItem value="4">{t('tickets:statusClosed')}</SelectItem>
                  <SelectItem value="5">{t('tickets:statusCancelled')}</SelectItem>
                  <SelectItem value="6">{t('tickets:statusOnHold')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('common:priority')}
              </p>
              <PriorityBadge priority={ticket.priority} />
            </div>

            {/* Assigned */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('tickets:assignedTo')}
              </p>
              <p className="text-sm text-foreground mb-2">
                {ticket.assignedToName || t('tickets:unassigned')}
              </p>
              {agents && (
                <Select onValueChange={handleAssign} disabled={assignTicket.isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tickets:selectAgent')} />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.firstName} {agent.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Created by */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('tickets:createdBy')}
              </p>
              <p className="text-sm text-foreground">{ticket.createdByName || '—'}</p>
            </div>

            {/* Dates */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('common:createdAt')}
              </p>
              <p className="text-sm text-foreground">
                {formatDate(ticket.createdAt, 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
