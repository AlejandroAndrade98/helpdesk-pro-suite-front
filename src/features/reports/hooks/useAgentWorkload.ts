import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/features/reports/services/reportService';
import type { AgentWorkloadItem, ReportFilters } from '@/types/api';

export function useAgentWorkload(filters?: ReportFilters) {
  return useQuery<AgentWorkloadItem[]>({
    queryKey: ['reports', 'agentWorkload', filters],
    queryFn: () => reportService.getAgentWorkload(filters),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}