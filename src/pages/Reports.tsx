import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import ReportsKPICards from '@/features/reports/components/ReportsKPICards';
import ReportsSections from '@/features/reports/components/ReportsSections';
import { useReportsOverview } from '@/features/reports/hooks/useReportsOverview';
import { reportService } from '@/features/reports/services/reportService';

const Reports: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data: overview, isLoading } = useReportsOverview();

  const handleExport = async () => {
    await reportService.exportTickets();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('dashboard:reports', { defaultValue: 'Reports' })}
        subtitle={t('dashboard:reportsSubtitle', {
          defaultValue: 'Overview of all ticket metrics',
        })}
      />

      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          {t('dashboard:exportCSV', { defaultValue: 'Export CSV' })}
        </Button>
      </div>

      <ReportsKPICards overview={overview} isLoading={isLoading} />

      <ReportsSections />
    </div>
  );
};

export default Reports;