"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Clock, Trash2, Filter } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/state-views";
import {
  getNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/actions/operations";

export default function NotificationsPage() {
  const { success, info, error } = useToast();
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [filter, setFilter] = React.useState<string>("all");

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getNotificationsAction();
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = items.filter((n) => !n.is_read && !n.read).length;

  const markAllRead = async () => {
    try {
      const res = await markAllNotificationsReadAction();
      if (res.success) {
        setItems((prev) => prev.map((n) => ({ ...n, is_read: true, read: true })));
        success("All Marked as Read", "Your notification inbox is up to date.");
      } else {
        error("Action Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const toggleRead = async (id: string) => {
    try {
      await markNotificationReadAction(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true, read: true } : n))
      );
      info("Marked as read");
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    info("Notification dismissed from local view.");
  };

  const filtered = items.filter((n) => {
    const isUnread = !n.is_read && !n.read;
    if (filter === "unread") return isUnread;
    if (filter === "academic") return n.type === "academic";
    if (filter === "schedule") return n.type === "schedule";
    return true;
  });

  return (
    <DashboardShell
      title="Notifications & Activity Inbox"
      description="Real-time alerts, assignment reviews, class changes, and campus advisories"
      actions={
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="info">{unreadCount} Unread</Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All as Read</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 border-b border-zinc-200/80 pb-3 dark:border-zinc-800/80">
          {[
            { id: "all", label: "All Alerts" },
            { id: "unread", label: "Unread" },
            { id: "academic", label: "Academics" },
            { id: "schedule", label: "Schedule Shifts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === tab.id
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* State Views */}
        {loading ? (
          <LoadingState message="Fetching realtime notifications from PostgreSQL..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchNotifications} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Inbox Zero"
            description="No notifications in this view. You are all caught up!"
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const isUnread = !n.is_read && !n.read;
              const dateText = n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : n.time || "Recent";

              return (
                <Card
                  key={n.id}
                  className={`transition-all ${
                    isUnread
                      ? "border-l-4 border-l-blue-500 bg-blue-50/25 dark:bg-blue-950/20"
                      : "opacity-75"
                  }`}
                >
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold truncate text-zinc-900 dark:text-zinc-100">
                          {n.title}
                        </h4>
                        {isUnread && <Badge variant="info">New</Badge>}
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {n.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pt-1">
                        <Clock className="h-3 w-3" />
                        <span>{dateText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isUnread && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 dark:text-blue-400"
                          onClick={() => toggleRead(n.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <button
                        onClick={() => deleteItem(n.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
