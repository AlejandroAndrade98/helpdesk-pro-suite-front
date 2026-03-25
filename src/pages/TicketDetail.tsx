import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTicket } from '@/features/tickets/hooks/useTicket';
import { useUpdateTicketStatus } from '@/features/tickets/hooks/useUpdateStatus';
import { useAssignTicket } from '@/features/tickets/hooks/useAssignTicket';
import { useAgents } from '@/features/users/hooks/useUsers';
import { useComments } from '@/features/comments/hooks/useComments';
import { useCreateComment } from '@/features/comments/hooks/useCreateComment';
import { useAuth } from '@/features/auth/hooks/useAuth';
import StatusBadge from '@/features/tickets/components/StatusBadge';
import PriorityBadge from '@/features/tickets/components/PriorityBadge';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, Send, UserCircle } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';
import { TicketStatus, UserRole } from '@/types/api';

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['tickets', 'common']);
  const { user } = useAuth();

  const { data: ticket, isLoading, isError } = useTicket(id!);
  const { data: agents } = useAgents();
  const { data: comments, isLoading: commentsLoading } = useComments(id!);
  const updateStatus = useUpdateTicketStatus(id!);
  const assignTicket = useAssignTicket(id!);
  const createComment = useCreateComment(id!);

  const canManageTicket =
    user?.role === UserRole.Agent || user?.role === UserRole.Admin;

  const canUseInternalComments = canManageTicket;

  const [commentText, setCommentText] = React.useState('');
  const [isInternalComment, setIsInternalComment] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>('');
  const [selectedAssignedToId, setSelectedAssignedToId] = React.useState<string>('none');

  React.useEffect(() => {
    if (ticket) {
      setSelectedStatus(String(ticket.status));
      setSelectedAssignedToId(
        ticket.assignedToId !== null && ticket.assignedToId !== undefined
          ? String(ticket.assignedToId)
          : 'none'
      );
    }
  }, [ticket]);

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment.mutateAsync({
        body: commentText.trim(),
        isInternal: canUseInternalComments ? isInternalComment : false,
      });

      setCommentText('');
      setIsInternalComment(false);
    } catch {
      toast.error(t('common:errorOccurred'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
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

  const statusChanged =
    selectedStatus !== '' && selectedStatus !== String(ticket.status);

  const assignedChanged =
    selectedAssignedToId !==
    (ticket.assignedToId !== null && ticket.assignedToId !== undefined
      ? String(ticket.assignedToId)
      : 'none');

  const hasPendingChanges = statusChanged || assignedChanged;
  const isSaving = updateStatus.isPending || assignTicket.isPending;

  const handleSaveChanges = async () => {
    if (!hasPendingChanges || !canManageTicket) return;

    try {
      if (statusChanged) {
        await updateStatus.mutateAsync({
          status: Number(selectedStatus) as TicketStatus,
        });
      }

      if (assignedChanged) {
        await assignTicket.mutateAsync({
          assignedToId:
            selectedAssignedToId === 'none'
              ? null
              : Number(selectedAssignedToId),
        });
      }

      toast.success(t('tickets:changesSaved'));
    } catch {
      toast.error(t('common:errorOccurred'));
    }
  };

  const currentAssignedName =
    selectedAssignedToId === 'none'
      ? t('tickets:unassigned')
      : agents?.find((agent) => String(agent.id) === selectedAssignedToId)?.displayName ||
        ticket.assignedToName ||
        t('tickets:unassigned');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title={ticket.title} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('tickets:description')}
            </h3>
            <p className="leading-relaxed text-foreground" style={{ overflowWrap: 'break-word' }}>
              {ticket.description}
            </p>
          </div>

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
                {comments.map((comment) => {
                  const internal = comment.isInternal;

                  return (
                    <div
                      key={comment.id}
                      className={`flex gap-3 rounded-lg border-l-4 p-4 ${
                        internal
                          ? 'border-l-yellow-400 bg-yellow-50/60 dark:bg-yellow-950/10'
                          : 'border-l-blue-400 bg-blue-50/60 dark:bg-blue-950/10'
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <UserCircle className="h-5 w-5 text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {comment.author?.displayName || t('common:user')}
                          </span>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              internal
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}
                          >
                            {internal ? t('tickets:commentInternal') : t('tickets:commentPublic')}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAtUtc, 'MMM d, yyyy HH:mm')}
                          </span>
                        </div>

                        {comment.author?.email && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {comment.author.email}
                          </p>
                        )}

                        <p
                          className="mt-2 text-sm text-foreground"
                          style={{ overflowWrap: 'break-word' }}
                        >
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {t('common:noResults')}
              </p>
            )}

            <div className="mt-4 space-y-3">
              {canUseInternalComments && (
                <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsInternalComment(false)}
                className={
                  !isInternalComment
                    ? 'border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-300'
                    : ''
                }
              >
                {t('tickets:commentPublic')}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsInternalComment(true)}
                className={
                  isInternalComment
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-300 hover:text-yellow-900'
                    : ''
                }
              >
                {t('tickets:commentInternal')}
              </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    canUseInternalComments
                      ? isInternalComment
                        ? t('tickets:commentPlaceholderInternal')
                        : t('tickets:commentPlaceholderPublic')
                      : t('tickets:commentPlaceholderDefault')
                  }
                  rows={3}
                  className={`flex-1 ${
                    canUseInternalComments
                      ? isInternalComment
                        ? 'border-yellow-300 focus-visible:ring-yellow-400'
                        : 'border-blue-300 focus-visible:ring-blue-400'
                      : ''
                  }`}
                />

                <Button
                  size="icon"
                  onClick={handleComment}
                  disabled={createComment.isPending || !commentText.trim()}
                  className="shrink-0 self-end"
                >
                  {createComment.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('common:status')}
              </p>

              <div className="flex items-center gap-2">
                <StatusBadge status={Number(selectedStatus || ticket.status) as TicketStatus} />
              </div>

              {canManageTicket && (
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  disabled={isSaving}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t('tickets:changeStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('tickets:statusNew')}</SelectItem>
                    <SelectItem value="2">{t('tickets:statusOpen')}</SelectItem>
                    <SelectItem value="3">{t('tickets:statusInProgress')}</SelectItem>
                    <SelectItem value="4">{t('tickets:statusWaitingOnCustomer')}</SelectItem>
                    <SelectItem value="5">{t('tickets:statusResolved')}</SelectItem>
                    <SelectItem value="6">{t('tickets:statusClosed')}</SelectItem>
                    <SelectItem value="7">{t('tickets:statusOnHold')}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('common:priority')}
              </p>
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('tickets:assignedTo')}
              </p>

              <p className="mb-2 text-sm text-foreground">{currentAssignedName}</p>

              {canManageTicket && agents && (
                <Select
                  value={selectedAssignedToId}
                  onValueChange={setSelectedAssignedToId}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('tickets:selectAgent')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('tickets:unassigned')}</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={String(agent.id)}>
                        {agent.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {canManageTicket && (
              <Button
                className="w-full"
                onClick={handleSaveChanges}
                disabled={!hasPendingChanges || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {t('common:save', { defaultValue: 'Save' })}
              </Button>
            )}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('tickets:createdBy')}
              </p>
              <p className="text-sm text-foreground">{ticket.createdByName || '—'}</p>
            </div>

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