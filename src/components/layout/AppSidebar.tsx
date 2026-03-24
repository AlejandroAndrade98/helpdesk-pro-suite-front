import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Ticket,
  Users,
  UserCircle,
  LogOut,
  Headset,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import { ROUTES } from '@/constants/routes';
import { UserRole } from '@/types/api';

type NavItem = {
  titleKey: string;
  defaultLabel: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  {
    titleKey: 'dashboard:title',
    defaultLabel: 'Dashboard',
    url: ROUTES.dashboard,
    icon: LayoutDashboard,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    titleKey: 'tickets:myTickets',
    defaultLabel: 'My Tickets',
    url: ROUTES.requesterHome,
    icon: Ticket,
    roles: [UserRole.Requester],
  },
  {
    titleKey: 'tickets:title',
    defaultLabel: 'Tickets',
    url: ROUTES.tickets,
    icon: Ticket,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    titleKey: 'users:title',
    defaultLabel: 'Users',
    url: ROUTES.users,
    icon: Users,
    roles: [UserRole.Admin],
  },
  {
    titleKey: 'common:profile',
    defaultLabel: 'Profile',
    url: ROUTES.profile,
    icon: UserCircle,
    roles: [UserRole.Admin, UserRole.Agent, UserRole.Requester],
  },
];

export function AppSidebar() {
  const { t } = useTranslation(['common', 'dashboard', 'tickets', 'users']);
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { logout } = useAuth();
  const { data: currentUser } = useCurrentUser();

  const visibleNavItems = currentUser
    ? navItems.filter((item) => item.roles.includes(currentUser.role))
    : [];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <Headset className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>

        {!collapsed && (
          <span className="text-base font-bold text-sidebar-foreground">
            {t('common:appName')}
          </span>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">
            {!collapsed && t('common:menu', { defaultValue: 'Menu' })}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url !== '/' && location.pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end={item.url === '/'}
                        className="transition-colors duration-150"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <span>{t(item.titleKey, { defaultValue: item.defaultLabel })}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && currentUser && (
          <div className="mb-2 truncate px-2 text-xs text-sidebar-foreground/60">
            {currentUser.displayName}
          </div>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>{t('common:logout')}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}