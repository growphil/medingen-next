"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";

// Module-level cache to hold state across page transitions
let lastNavigationState: any = null;

export function useLegacyRouting() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const navigate = useCallback((path: any, options?: any) => {
    if (options && options.state) {
      lastNavigationState = options.state;
    } else {
      lastNavigationState = null;
    }

    if (path === -1 || path === "-1") {
      router.back();
    } else if (typeof path === "string") {
      router.push(path);
    } else {
      router.push(String(path));
    }
  }, [router]);

  const location = useMemo(() => ({
    pathname: pathname || "",
    search: searchParams ? `?${searchParams.toString()}` : "",
    state: lastNavigationState,
  }), [pathname, searchParams]);

  return useMemo(() => ({ navigate, location, params, router }), [navigate, location, params, router]);
}
