
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
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer p-2 data-[collapsible=icon]:justify-center data-[collapsible=icon]:p-1.5 rounded-md hover:bg-sidebar-accent">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photo || `https://avatar.vercel.sh/${user?.name}.png`} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name}</span>
                    <span className="text-xs text-sidebar-foreground/70 truncate">Farmer</span>
                </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuItem asChild>
              <Link href="/profile">
                <CircleUser className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
