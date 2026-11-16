
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
  LayoutGrid,
  FolderOpen,
  Mail,
  ChartNoAxesCombined,
  Settings2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ArrowUpRight,
  Plus,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import AdminBrand from "@/components/admin/AdminBrand";
import AdminNotifications from "@/components/admin/AdminNotifications";

const navigation = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderOpen,
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    icon: Mail,
  },
  {
    href: "/admin/intelligence",
    label: "Data Intelligence",
    icon: ChartNoAxesCombined,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings2,
  },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const currentPage =
    navigation.find((item) => {
      if (item.href === "/admin") {
        return pathname === "/admin";
      }

      return (
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`)
      );
    })?.label ?? "Studio";

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again.";

      window.alert(message);
      setLoggingOut(false);
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <div
      className={`atelier-app ${
        collapsed ? "atelier-collapsed" : ""
      }`}
    >
      {/* Mobile navigation overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="atelier-overlay"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`atelier-sidebar ${
          mobileOpen ? "atelier-sidebar-open" : ""
        }`}
        aria-label="Admin sidebar"
      >
        <div className="atelier-sidebar-top">
          <AdminBrand compact={collapsed} />

          <button
            type="button"
            className="atelier-mobile-close"
            aria-label="Close navigation"
            onClick={closeMobileMenu}
          >
            <X size={19} />
          </button>
        </div>

        <div className="atelier-sidebar-label">
          {!collapsed && "STUDIO CONTROL"}
        </div>

        {/* Main navigation */}
        <nav
          className="atelier-navigation"
          aria-label="Main administration navigation"
        >
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname === href ||
                  pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-current={active ? "page" : undefined}
                className={`atelier-nav-item ${
                  active ? "atelier-nav-active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="atelier-sidebar-bottom">
          <Link
            href="/admin/projects/new"
            className="atelier-sidebar-create"
            title="Create a new project"
            onClick={closeMobileMenu}
          >
            <Plus size={18} strokeWidth={2} />

            {!collapsed && <span>New Project</span>}
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="atelier-nav-item"
            title="View public website"
            onClick={closeMobileMenu}
          >
            <ArrowUpRight
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {!collapsed && <span>View Website</span>}
          </a>

          <button
            type="button"
            className="atelier-nav-item"
            disabled={loggingOut}
            onClick={() => void handleLogout()}
            title="Sign out of administration"
          >
            <LogOut
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {!collapsed && (
              <span>
                {loggingOut ? "Signing out..." : "Sign Out"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main workspace */}
      <div className="atelier-workspace">
        {/* Top navigation */}
        <header className="atelier-topbar">
          <div className="atelier-topbar-left">
            {/* Mobile menu */}
            <button
              type="button"
              className="atelier-icon-button atelier-menu-mobile"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={21} />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              type="button"
              className="atelier-icon-button atelier-menu-desktop"
              aria-label={
                collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              aria-expanded={!collapsed}
              onClick={() =>
                setCollapsed((previous) => !previous)
              }
            >
              {collapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>

            {/* Breadcrumb */}
            <div className="atelier-breadcrumb">
              <span>MEPPEPLIN</span>

              <span className="atelier-breadcrumb-divider">
                /
              </span>

              <strong>{currentPage}</strong>
            </div>
          </div>

          <div className="atelier-topbar-right">
            {/* Quick create project */}
            <Link
              href="/admin/projects/new"
              className="atelier-topbar-create"
              title="Create a new project"
            >
              <Plus size={16} />
              <span>New Project</span>
            </Link>

            {/* Functional enquiry notifications */}
            <AdminNotifications />

            {/* Administrator profile */}
            <Link
              href="/admin/settings"
              className="atelier-admin-avatar"
              title="Administrator settings"
              aria-label="Open administrator settings"
              style={{ textDecoration: "none" }}
            >
              M
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="atelier-main">
          {children}
        </main>
      </div>
    </div>
  );
}
