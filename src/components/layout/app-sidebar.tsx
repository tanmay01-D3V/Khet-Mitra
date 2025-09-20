
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanLine,
  Beaker,
  Sprout,
  MapPin,
  ShoppingCart,
  RadioReceiver,
  Settings,
  CircleUser,
  LogOut,
  Users,
  Code,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Link from 'next/link';
import { Button } from '../ui/button';

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation('sidebar');
  const { user, logout } = useAuth();

  const menuItems = [
    { href: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard /> },
    { href: '/disease-identification', label: t('diseaseId'), icon: <ScanLine /> },
    { href: '/soil-analysis', label: t('soilAnalysis'), icon: <Beaker /> },
    { href: '/fertilizer-recommendation', label: t('fertilizerAdvice'), icon: <Sprout /> },
    { href: '/location-guidance', label: t('locationGuidance'), icon: <MapPin /> },
    { href: '/marketplace', label: t('marketplace'), icon: <ShoppingCart /> },
    { href: '/my-poll', label: t('myPoll'), icon: <RadioReceiver /> },
    { href: '/chatroom', label: t('chatroom'), icon: <Users /> },
    { href: '/settings', label: t('settings'), icon: <Settings /> },
    { href: '/the-devs', label: t('theDevs'), icon: <Code /> },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                as="a"
                href={item.href}
                isActive={pathname === item.href}
                tooltip={item.label}
                size="lg"
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2">
            <Button onClick={logout} className="w-full justify-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
                <LogOut className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden ml-2">Log out</span>
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
