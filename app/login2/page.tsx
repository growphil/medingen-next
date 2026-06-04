"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Login2 = dynamic(() => import("@/components/Login2/Login2").then(m => ({ default: m.Login2 })), { ssr: false });
export default function Login2Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ fontFamily: "Outfit, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  return <Login2 />;
}
