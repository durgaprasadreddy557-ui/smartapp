import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  const supabaseReady = isSupabaseConfigured();

  return NextResponse.json({
    status: "ok",
    app: "Smart Campus Full-Stack Platform",
    timestamp: new Date().toISOString(),
    services: {
      nextjs: "operational",
      supabase: supabaseReady ? "connected" : "credentials_required",
      auth: "supabase_auth",
      storage: "supabase_storage",
      realtime: "supabase_realtime",
    },
    version: "1.0.0",
  });
}
