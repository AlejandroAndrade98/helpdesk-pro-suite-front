import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '@/features/users/hooks/useUsers';
import { UserRole } from '@/types/api';
import { userRoleColor } from '@/mappers/user';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { SkeletonTable } from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/formatDate';

const roleKeys: Record<UserRole, string> = {
  [UserRole.Admin]: 'users:roleAdmin',
  [UserRole.Agent]: 'users:roleAgent',
  [UserRole.Customer]: 'users:roleCustomer',
};

const UsersPage: React.FC = () => {
  const { t } = useTranslation(['users', 'common']);
  const { data: users, isLoading, isError } = useUsers();

  if (isError) {
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
      <PageHeader title={t('users:title')} subtitle={t('users:subtitle')} />

      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : !users || users.length === 0 ? (
        <EmptyState titleKey="noUsers" descriptionKey="noUsersDescription" ns="users" />
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('users:name')}</TableHead>
                <TableHead>{t('users:email')}</TableHead>
                <TableHead>{t('users:role')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('users:joinedAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <span className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      userRoleColor[user.role],
                    )}>
                      {t(roleKeys[user.role])}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
