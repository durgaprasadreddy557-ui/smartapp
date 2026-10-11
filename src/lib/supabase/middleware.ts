import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "./types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  // If Supabase credentials are placeholder values, allow request through safely
  if (supabaseUrl.includes("placeholder-project") || supabaseAnonKey.includes("placeholder")) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Protected route checking:
  // If not authenticated and attempting to access restricted portals
  if (!user && (path.startsWith("/dashboard") || path.startsWith("/settings") || path.startsWith("/profile"))) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based route protection
  if (user && path.startsWith("/dashboard/")) {
    // Fetch user profile securely to verify role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = (profile as { role?: string } | null)?.role || "student";

    // Admin routes protection: Only admin can access /dashboard/admin
    if (path.startsWith("/dashboard/admin") && userRole !== "admin") {
      const redirectPath = userRole === "faculty" ? "/dashboard/faculty" : "/dashboard/student";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Faculty routes protection: Only faculty or admin can access /dashboard/faculty
    if (path.startsWith("/dashboard/faculty") && userRole !== "faculty" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }
  }

  return supabaseResponse;
}
