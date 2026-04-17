import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/features/reports/services/reportService';
import type { TicketsByStatus, ReportFilters } from '@/types/api';

export function useTicketsByStatus(filters?: ReportFilters) {
  return useQuery<TicketsByStatus[]>({
    queryKey: ['reports', 'ticketsByStatus', filters],
    queryFn: () => reportService.getTicketsByStatus(filters),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}