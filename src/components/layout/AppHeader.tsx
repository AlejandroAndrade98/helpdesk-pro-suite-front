import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher';

const routeTitles: Record<string, string> = {
  '/': 'dashboard:title',
  '/tickets': 'tickets:title',
  '/users': 'users:title',
  '/profile': 'users:profileTitle',
};

const AppHeader: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'tickets', 'users']);
  const location = useLocation();

  const titleKey = routeTitles[location.pathname] || (location.pathname.startsWith('/tickets/') ? 'tickets:detail' : '');
  const title = titleKey ? t(titleKey) : '';

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="hidden lg:flex" />
        {title && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default AppHeader;
