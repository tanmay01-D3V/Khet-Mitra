
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CircleUser, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useSidebar } from '@/context/sidebar-provider';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


export function Header() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Button size="icon" variant="outline" onClick={toggleSidebar} className="sm:hidden">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
        </Button>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photo || `https://avatar.vercel.sh/${user?.name}.png`} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.[0].toUpperCase() || <CircleUser/>}</AvatarFallback>
                </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <a href="/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
