import { UserRole } from '@/types/api';

export const userRoleLabels: Record<UserRole, { en: string; es: string }> = {
  [UserRole.Requester]: { en: 'Requester', es: 'Solicitante' },
  [UserRole.Agent]: { en: 'Agent', es: 'Agente' },
  [UserRole.Admin]: { en: 'Admin', es: 'Administrador' },
};

export const userRoleColor: Record<UserRole, string> = {
  [UserRole.Requester]: 'bg-slate-100 text-slate-600 border-slate-200',
  [UserRole.Agent]: 'bg-blue-100 text-blue-700 border-blue-200',
  [UserRole.Admin]: 'bg-purple-100 text-purple-700 border-purple-200',
};