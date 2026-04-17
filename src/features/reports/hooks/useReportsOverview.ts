import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/features/reports/services/reportService';
import type { ReportsOverview, ReportFilters } from '@/types/api';

export function useReportsOverview(filters?: ReportFilters) {
  return useQuery<ReportsOverview>({
    queryKey: ['reports', 'overview', filters],
    queryFn: () => reportService.getOverview(filters),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}