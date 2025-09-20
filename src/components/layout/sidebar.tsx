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
} from 'lucide-react';
import { Logo } from '../logo';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/disease-identification',
    icon: ScanLine,
    label: 'Disease ID',
  },
  {
    href: '/soil-analysis',
    icon: Beaker,
    label: 'Soil Analysis',
  },
  {
    href: '/fertilizer-recommendation',
    icon: Sprout,
    label: 'Fertilizer Advice',
  },
  {
    href: '/location-guidance',
    icon: MapPin,
    label: 'Location Guidance',
  },
  {
    href: '/marketplace',
    icon: ShoppingCart,
    label: 'Marketplace',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

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
