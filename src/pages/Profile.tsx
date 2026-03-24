import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import { UserRole } from '@/types/api';
import { userRoleColor } from '@/mappers/user';
import PageHeader from '@/components/shared/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserCircle, Mail, Shield } from 'lucide-react';

const roleKeys: Record<UserRole, string> = {
  [UserRole.Requester]: 'users:roleRequester',
  [UserRole.Agent]: 'users:roleAgent',
  [UserRole.Admin]: 'users:roleAdmin',
};

const ProfilePage: React.FC = () => {
  const { t } = useTranslation(['users', 'common']);
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-xl" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive">{t('common:error')}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          {t('common:retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('users:profileTitle')} subtitle={t('users:profileSubtitle')} />

      <div className="max-w-xl rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <UserCircle className="h-10 w-10 text-primary" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground">
              {user.displayName || 'Sin nombre'}
            </h2>

            <span
              className={cn(
                'mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                userRoleColor[user.role]
              )}
            >
              {t(roleKeys[user.role])}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('users:email')}</p>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t('users:role')}</p>
              <p className="text-sm font-medium text-foreground">{t(roleKeys[user.role])}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;