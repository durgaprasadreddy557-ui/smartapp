import { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "./client";

export type RealtimeCallback<T = Record<string, unknown>> = (payload: {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T;
  old: T;
}) => void;

/**
 * Subscribes to real-time table modifications via Supabase Realtime
 */
export function subscribeToTable<T = Record<string, unknown>>(
  table: string,
  callback: RealtimeCallback<T>,
  filter?: string
): () => void {
  const supabase = createClient();
  let channel: RealtimeChannel;

  const channelName = `realtime:${table}${filter ? `:${filter}` : ""}`;
  channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table,
        filter,
      },
      (payload) => {
        callback({
          eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          new: payload.new as T,
          old: payload.old as T,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
