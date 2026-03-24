import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  titleKey: string;
  value: number;
  icon: LucideIcon;
  colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ titleKey, value, icon: Icon, colorClass = 'text-primary' }) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{t(titleKey)}</p>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-muted', colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{value}</p>
    </div>
  );
};

export default StatsCard;
