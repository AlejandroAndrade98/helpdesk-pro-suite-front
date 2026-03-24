import { UserRole } from '@/types/api';

export const userRoleLabels: Record<UserRole, { en: string; es: string }> = {
  [UserRole.Admin]: { en: 'Admin', es: 'Administrador' },
  [UserRole.Agent]: { en: 'Agent', es: 'Agente' },
  [UserRole.Customer]: { en: 'Customer', es: 'Cliente' },
};

export const userRoleColor: Record<UserRole, string> = {
  [UserRole.Admin]: 'bg-purple-100 text-purple-700 border-purple-200',
  [UserRole.Agent]: 'bg-blue-100 text-blue-700 border-blue-200',
  [UserRole.Customer]: 'bg-slate-100 text-slate-600 border-slate-200',
};
