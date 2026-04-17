import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTicketsByStatus } from '@/features/reports/hooks/useTicketsByStatus';
import { useTicketsByPriority } from '@/features/reports/hooks/useTicketsByPriority';
import { useTicketsTrend } from '@/features/reports/hooks/useTicketsTrend';
import { useAgentWorkload } from '@/features/reports/hooks/useAgentWorkload';
import { SkeletonTable } from '@/components/shared/SkeletonCard';
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

const ReportsSections: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'tickets', 'common']);
  const { data: byStatus, isLoading: loadingByStatus } = useTicketsByStatus();
  const { data: byPriority, isLoading: loadingByPriority } = useTicketsByPriority();
  const { data: trend, isLoading: loadingTrend } = useTicketsTrend();
  const { data: workload, isLoading: loadingWorkload } = useAgentWorkload();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t('dashboard:ticketsByStatus', { defaultValue: 'Tickets by Status' })}
        </h2>
        {loadingByStatus ? (
          <SkeletonTable rows={6} />
        ) : (
          <div className="rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common:status')}</TableHead>
                  <TableHead className="text-right">{t('dashboard:count', { defaultValue: 'Count' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byStatus?.map((item) => (
                  <TableRow key={item.status}>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-right font-medium">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t('dashboard:ticketsByPriority', { defaultValue: 'Tickets by Priority' })}
        </h2>
        {loadingByPriority ? (
          <SkeletonTable rows={4} />
        ) : (
          <div className="rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common:priority')}</TableHead>
                  <TableHead className="text-right">{t('dashboard:count', { defaultValue: 'Count' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byPriority?.map((item) => (
                  <TableRow key={item.priority}>
                    <TableCell><PriorityBadge priority={item.priority} /></TableCell>
                    <TableCell className="text-right font-medium">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t('dashboard:ticketsTrend', { defaultValue: 'Tickets Trend' })}
        </h2>
        {loadingTrend ? (
          <SkeletonTable rows={7} />
        ) : (
          <div className="rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard:date', { defaultValue: 'Date' })}</TableHead>
                  <TableHead className="text-right">{t('dashboard:count', { defaultValue: 'Count' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trend?.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-muted-foreground">{item.date}</TableCell>
                    <TableCell className="text-right font-medium">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t('dashboard:agentWorkload', { defaultValue: 'Agent Workload' })}
        </h2>
        {loadingWorkload ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard:agent', { defaultValue: 'Agent' })}</TableHead>
                  <TableHead className="text-right">{t('dashboard:assigned', { defaultValue: 'Assigned' })}</TableHead>
                  <TableHead className="text-right">{t('dashboard:active', { defaultValue: 'Active' })}</TableHead>
                  <TableHead className="text-right">{t('dashboard:resolved', { defaultValue: 'Resolved' })}</TableHead>
                  <TableHead className="text-right">{t('dashboard:closed', { defaultValue: 'Closed' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workload?.map((item) => (
                  <TableRow key={item.userId}>
                    <TableCell className="font-medium">{item.displayName}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.assignedTickets}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.activeTickets}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.resolvedTickets}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.closedTickets}</TableCell>
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

export default ReportsSections;