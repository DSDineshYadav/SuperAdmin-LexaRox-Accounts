import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Search, Sparkles } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CHATBOT_SAFE_BOTTOM, ChatbotProvider, useAppChatbot } from "@/components/app-chatbot";
import { showSystemAdministration } from "@/lib/platform-navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ChatbotProvider>
      <AppShellLayout>{children}</AppShellLayout>
    </ChatbotProvider>
  );
}

function AskAiHeaderButton() {
  const { openChatbot } = useAppChatbot();

  return (
    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openChatbot()}>
      <Sparkles className="h-4 w-4 text-[var(--ai)]" />
      <span className="hidden sm:inline">Ask AI</span>
    </Button>
  );
}

function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur sm:px-6 min-h-[71px]">
            <SidebarTrigger className="shrink-0" />
            <div className="relative hidden min-w-0 flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search firms, inquiries, templates…"
                className="h-9 max-w-md border-transparent bg-muted pl-9"
              />
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <AskAiHeaderButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <span className="text-sm">Harper &amp; Lane LLP onboarded</span>
                    <span className="text-xs text-muted-foreground">12 min ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <span className="text-sm">Northgate Partners — payment failed</span>
                    <span className="text-xs text-muted-foreground">1 hr ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <span className="text-sm">New sales inquiry — MTD Early Bird</span>
                    <span className="text-xs text-muted-foreground">2 hrs ago</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    SC
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>Sarah Chen</span>
                    <span className="text-xs font-normal text-muted-foreground">Super Admin</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {showSystemAdministration && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/settings">Account settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main
            className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8"
            style={{ paddingBottom: CHATBOT_SAFE_BOTTOM }}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
