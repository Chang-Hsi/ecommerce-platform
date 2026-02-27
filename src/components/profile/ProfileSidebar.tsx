"use client";

import {
  MapPinIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profileNavItems } from "@/content/profile";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavIcon({ kind }: Readonly<{ kind: (typeof profileNavItems)[number]["icon"] }>) {
  const className = "h-5 w-5";

  switch (kind) {
    case "account":
      return <UserIcon className={className} aria-hidden />;
    case "addresses":
      return <MapPinIcon className={className} aria-hidden />;
    case "preferences":
      return <ShoppingBagIcon className={className} aria-hidden />;
    case "visibility":
      return <UserCircleIcon className={className} aria-hidden />;
    case "privacy":
      return <ShieldCheckIcon className={className} aria-hidden />;
    default:
      return null;
  }
}

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden space-y-1 lg:block">
        {profileNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-base text-zinc-700 transition-colors",
                isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-100",
              )}
            >
              <NavIcon kind={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <nav className="lg:hidden">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {profileNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                  isActive
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-800",
                )}
              >
                <NavIcon kind={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
