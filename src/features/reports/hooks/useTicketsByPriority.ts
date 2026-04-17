import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/features/reports/services/reportService';
import type { TicketsByPriority, ReportFilters } from '@/types/api';

export function useTicketsByPriority(filters?: ReportFilters) {
  return useQuery<TicketsByPriority[]>({
    queryKey: ['reports', 'ticketsByPriority', filters],
    queryFn: () => reportService.getTicketsByPriority(filters),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}