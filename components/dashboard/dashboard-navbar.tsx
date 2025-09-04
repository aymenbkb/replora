"use client"

import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Bell, Search, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils";

const DashboardNavbar = () => {
  const { user } = useUser();
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}` || undefined;
  const username = user?.username || user?.primaryEmailAddress?.emailAddress || "My Account";

  return (
    <header className="flex items-center h-14 gap-4 border-b border-border px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="shrink-0" aria-label="Go to Dashboard">
          <Logo variant="full" className="h-6" />
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-2 h-4 w-4 text-foreground/60" />
          <Input
            placeholder="Search contacts, flows, campaigns"
            className={cn("pl-8 w-72 lg:w-96")}
          />
        </div>

        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none" aria-label="User menu">
            <Avatar className="h-9 w-9">
              <AvatarImage alt={user?.fullName ?? "User"} src={user?.imageUrl} />
              <AvatarFallback>
                {initials ? (
                  <span className="text-xs font-medium">{initials}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage alt={user?.fullName ?? "User"} src={user?.imageUrl} />
                  <AvatarFallback className="text-[10px]">{initials ?? "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-tight truncate">{user?.fullName ?? "Account"}</span>
                  <span className="text-xs text-muted-foreground leading-tight truncate">{username}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardNavbar;
