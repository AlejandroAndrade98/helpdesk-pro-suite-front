import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import { useUpdateUserRole } from '@/features/users/hooks/useUpdateUserRole';
import { UserRole } from '@/types/api';
import { userRoleColor } from '@/mappers/user';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { SkeletonTable } from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const roleKeys: Record<UserRole, string> = {
  [UserRole.Requester]: 'users:roleRequester',
  [UserRole.Agent]: 'users:roleAgent',
  [UserRole.Admin]: 'users:roleAdmin',
};

const UsersPage: React.FC = () => {
  const { t } = useTranslation(['users', 'common']);
  const { data: users, isLoading, isError } = useUsers();
  const { data: currentUser } = useCurrentUser();
  const updateRole = useUpdateUserRole();

  const [pendingRoles, setPendingRoles] = React.useState<Record<number, string>>({});

  const isAdmin = currentUser?.role === UserRole.Admin;

  const handleSaveRole = async (userId: number) => {
    const selectedRole = pendingRoles[userId];
    if (!selectedRole) return;

    try {
      await updateRole.mutateAsync({
        id: userId,
        role: Number(selectedRole) as UserRole,
      });

      toast.success(t('users:roleUpdated', { defaultValue: 'Role updated' }));

      setPendingRoles((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    } catch {
      toast.error(t('common:errorOccurred'));
    }
  };

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
                {isAdmin && <TableHead>{t('common:actions', { defaultValue: 'Actions' })}</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => {
                const selectedRole = pendingRoles[user.id] ?? String(user.role);
                const roleChanged = selectedRole !== String(user.role);

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.displayName}</TableCell>

                    <TableCell className="text-muted-foreground">{user.email}</TableCell>

                    <TableCell>
                      {isAdmin ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={selectedRole}
                            onValueChange={(value) =>
                              setPendingRoles((prev) => ({ ...prev, [user.id]: value }))
                            }
                            disabled={currentUser?.id === user.id && user.role === UserRole.Admin}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={String(UserRole.Requester)}>
                                {t('users:roleRequester')}
                              </SelectItem>
                              <SelectItem value={String(UserRole.Agent)}>
                                {t('users:roleAgent')}
                              </SelectItem>
                              <SelectItem value={String(UserRole.Admin)}>
                                {t('users:roleAdmin')}
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <span
                            className={cn(
                              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                              userRoleColor[Number(selectedRole) as UserRole],
                            )}
                          >
                            {t(roleKeys[Number(selectedRole) as UserRole])}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                            userRoleColor[user.role],
                          )}
                        >
                          {t(roleKeys[user.role])}
                        </span>
                      )}
                    </TableCell>

                    {isAdmin && (
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSaveRole(user.id)}
                          disabled={!roleChanged || updateRole.isPending}
                        >
                          {t('common:save', { defaultValue: 'Save' })}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;