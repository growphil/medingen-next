"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChangePassword = dynamic(
  () => import("@/components/ChangePassword/ChangePassword").then(m => ({ default: m.ChangePassword })),
  { ssr: false }
);

export default function ChangePasswordPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <ChangePassword />;
}
