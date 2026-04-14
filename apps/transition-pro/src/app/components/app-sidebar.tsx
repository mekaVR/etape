import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar";
import { useAuth } from "@/app/provider/auth-provider.tsx";
import {
  SignOutIcon,
  HouseIcon,
  UserCircleIcon,
  FolderIcon,
  FileIcon,
  CalendarIcon,
  CertificateIcon,
  UsersThreeIcon,
  EnvelopeIcon,
  HeadsetIcon,
} from "@phosphor-icons/react";

import logo from "@/assets/transition-pro_logo-sidebar.jpg";
import logo_collapse from "@/assets/transition-pro_logo_collapsed.png";

const navItems = [
  { title: "Tableau de bord", url: "/", icon: HouseIcon },
  { title: "Messagerie", url: "/messagerie", icon: EnvelopeIcon },
  { title: "Mon profil", url: "/profil", icon: UserCircleIcon },
  { title: "Mes dossiers", url: "/dossiers", icon: FolderIcon },
  { title: "Mes documents", url: "/documents", icon: FileIcon },
  { title: "Prendre rendez-vous", url: "/rendez-vous", icon: CalendarIcon },
  { title: "CPI", url: "/cpi", icon: CertificateIcon },
  { title: "RDPR", url: "/reseau", icon: UsersThreeIcon },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible={"icon"}>
      <SidebarHeader className="p-4">
        <img
          src={logo}
          alt="Transition Pro"
          className="h-20 w-auto object-contain group-data-[collapsible=icon]:hidden"
        />
        <img
          src={logo_collapse}
          alt="Transition Pro"
          className="hidden size-8 object-cover group-data-[collapsible=icon]:block"
        />
        <span className="text-md group-data-[collapsible=icon]:hidden">
          {user?.username}
        </span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground"
                >
                  <Link to={item.url}>
                    <item.icon />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span>
                    <HeadsetIcon />
                    Assistance
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer text-[0.9375rem] [&_svg]:size-5 hover:bg-muted hover:text-muted-foreground"
              onClick={logout}
            >
              <SignOutIcon />
              <span className="group-data-[collapsible=icon]:hidden">
                Se déconnecter
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
