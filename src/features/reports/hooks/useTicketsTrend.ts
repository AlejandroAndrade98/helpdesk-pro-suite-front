import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/features/reports/services/reportService';
import type { TicketsTrendPoint, ReportFilters } from '@/types/api';

export function useTicketsTrend(filters?: ReportFilters) {
  return useQuery<TicketsTrendPoint[]>({
    queryKey: ['reports', 'ticketsTrend', filters],
    queryFn: () => reportService.getTicketsTrend(filters),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}