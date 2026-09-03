import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Briefcase,
  CreditCard,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Settings,
  LifeBuoy,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const operations = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Manage Clients", url: "/clients", icon: Users },
  { title: "Task Management", url: "/tasks", icon: ListChecks },
] as const;

const intelligence = [
  { title: "AI-Assisted Communication", url: "/communications", icon: MessageSquare },
  { title: "Oversight", url: "/oversight", icon: ShieldCheck },
] as const;

const organisation = [
  { title: "Manage Staff", url: "/staff", icon: UserCog },
  { title: "Manage Services", url: "/services", icon: Briefcase },
  { title: "Subscription Management", url: "/subscriptions", icon: CreditCard },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === "/dashboard";
    if (url === "/tasks") {
      return pathname === "/tasks" || (pathname.startsWith("/tasks/") && pathname !== "/tasks/create");
    }
    return pathname.startsWith(url);
  };

  const renderGroup = (
    label: string,
    items: ReadonlyArray<{ title: string; url: string; icon: React.ElementType }>,
  ) => (
    <SidebarGroup className={cn(collapsed && "items-center")}>
      {!collapsed && (
        <SidebarGroupLabel className="text-[0.68rem] uppercase tracking-[0.14em] text-white/60 font-bold px-3 py-1.5">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className={cn("gap-1", collapsed && "items-center")}>
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title} className={cn(collapsed && "flex justify-center")}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <Link
                    to={item.url}
                    className={cn(
                      "flex items-center rounded-lg py-2 text-sm transition-all duration-150",
                      collapsed ? "size-8 justify-center px-0" : "gap-3 px-3",
                      active
                        ? "bg-[#3cadf1] text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10 font-medium",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-white" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[#3d3949] bg-[linear-gradient(180deg,#2c2a35_0%,#1e1c26_60%,#14121a_100%)] text-white shadow-2xl"
    >
      <SidebarHeader className={cn("py-4", collapsed ? "px-0" : "px-3")}>
        <Link
          to="/dashboard"
          className={cn("flex min-w-0 items-center gap-2", collapsed && "mx-auto justify-center")}
        >
          {collapsed ? (
            <img src="/favicon.png" alt="LexaRox" className="h-6 w-6" />
          ) : (
            <div className="w-full">
              <img src="/logo.png" alt="LexaRox Accounts" className="h-8 w-auto object-contain object-left" />
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn("gap-1", collapsed ? "px-0" : "px-1")}>
        {renderGroup("Operations", operations)}
        {renderGroup("Intelligence", intelligence)}
        {renderGroup("Organisation", organisation)}
      </SidebarContent>

      <SidebarFooter className={cn("gap-1 border-t border-[#3d3949]", collapsed ? "px-0 py-2" : "p-2")}>
        <SidebarMenu className={cn(collapsed && "items-center")}>
          <SidebarMenuItem className={cn(collapsed && "flex justify-center")}>
            <SidebarMenuButton asChild tooltip="Help & Support">
              <Link
                to="/help"
                className={cn(
                  "flex items-center rounded-lg py-2 text-white/80 transition-all hover:bg-white/10 hover:text-white font-medium",
                  collapsed ? "size-8 justify-center px-0" : "gap-3 px-3",
                )}
              >
                <LifeBuoy className="h-4 w-4 shrink-0 text-white" />
                {!collapsed && <span className="text-sm">Help &amp; Support</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className={cn(collapsed && "flex justify-center")}>
            <SidebarMenuButton asChild tooltip="Admin / Account Settings">
              <Link
                to="/settings"
                className={cn(
                  "flex h-auto items-center text-white transition-all",
                  collapsed
                    ? "size-8 justify-center p-0 border-0 bg-transparent hover:bg-transparent"
                    : "gap-3 rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10",
                )}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#3cadf1] text-xs font-bold text-white">
                  AW
                </span>
                {!collapsed && (
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-bold text-white">Andrea Whitfield</span>
                    <span className="truncate text-xs font-medium text-white/70">Admin · Account settings</span>
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
