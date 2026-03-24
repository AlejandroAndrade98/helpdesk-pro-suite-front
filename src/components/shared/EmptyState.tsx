import React from 'react';
import { useTranslation } from 'react-i18next';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  titleKey: string;
  descriptionKey: string;
  ns?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ titleKey, descriptionKey, ns = 'common', action }) => {
  const { t } = useTranslation(ns);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{t(titleKey)}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{t(descriptionKey)}</p>
      {action}
    </div>
  );
};

export default EmptyState;
