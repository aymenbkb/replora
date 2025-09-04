"use client"

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import {
  LayoutDashboard,
  Bot,
  MessageSquareText,
  Users2,
  Megaphone,
  Rocket,
  LineChart,
  Settings,
  CreditCard,
  ChevronLeft,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Automation", href: "/automation", icon: Bot },
  { label: "Live Chat", href: "/live-chat", icon: MessageSquareText },
  { label: "Audience", href: "/audience", icon: Users2 },
  { label: "Broadcasts", href: "/broadcasts", icon: Megaphone },
  { label: "Growth Tools", href: "/growth-tools", icon: Rocket },
  { label: "Analytics", href: "/analytics", icon: LineChart },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const activeMap = useMemo(() => {
    const p = pathname || "";
    return Object.fromEntries(
      navItems.map((n) => [n.href, p === n.href || p.startsWith(`${n.href}/`)])
    ) as Record<string, boolean>;
  }, [pathname]);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-muted/20 h-full transition-all duration-200",
        collapsed ? "w-[64px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <span className={cn("text-sm font-semibold", collapsed && "sr-only")}>Navigation</span>
        <button
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground/70 hover:bg-muted",
            collapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-2 pb-4 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
              activeMap[href]
                ? "bg-primary/10 text-primary"
                : "text-foreground/80 hover:bg-muted"
            )}
            prefetch={false}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className={cn(collapsed && "sr-only")}>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
