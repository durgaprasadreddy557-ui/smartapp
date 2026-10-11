"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { campusNavigation } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, LogOut, User } from "lucide-react";
import { signOutAction } from "@/actions/auth";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/40">
      <div className="space-y-6">
        {campusNavigation.map((category) => (
          <div key={category.title} className="space-y-1">
            <h4 className="px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              {category.title}
            </h4>
            <div className="mt-1 space-y-0.5">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badge === "Live"
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : item.badge === "24/7"
                            ? "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      isActive && <ChevronRight className="h-3 w-3 text-white/70" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout button at bottom of sidebar */}
      <div className="pt-4 mt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Session</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
