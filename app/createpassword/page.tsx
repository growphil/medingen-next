"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CreatePassword = dynamic(
  () => import("@/components/CreatePassword/CreatePassword").then(m => ({ default: m.CreatePassword })),
  { ssr: false }
);

export default function CreatePasswordPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <CreatePassword />;
}
