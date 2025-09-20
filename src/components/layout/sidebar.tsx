
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Beaker,
  ScanLine,
  Sprout,
  MapPin,
  ShoppingCart,
  RadioReceiver,
  Settings,
} from 'lucide-react';
import { Logo } from '../logo';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';


export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation('sidebar');

  const menuItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: t('dashboard'),
    },
    {
      href: '/disease-identification',
      icon: ScanLine,
      label: t('diseaseId'),
    },
    {
      href: '/soil-analysis',
      icon: Beaker,
      label: t('soilAnalysis'),
    },
    {
      href: '/fertilizer-recommendation',
      icon: Sprout,
      label: t('fertilizerAdvice'),
    },
    {
      href: '/location-guidance',
      icon: MapPin,
      label: t('locationGuidance'),
    },
    {
      href: '/marketplace',
      icon: ShoppingCart,
      label: t('marketplace'),
    },
    {
      href: '/my-poll',
      icon: RadioReceiver,
      label: t('myPoll'),
    },
    {
      href: '/settings',
      icon: Settings,
      label: t('settings'),
    },
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
                as={Link}
                href={item.href}
                isActive={pathname === item.href}
                tooltip={item.label}
                onClick={() => setOpenMobile(false)}
                className={cn(pathname === item.href && 'font-semibold')}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
