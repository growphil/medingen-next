"use client";

import React from "react";
import { CartProvider, CompareProvider, ProfileProvider } from "@/api/stateContext";

// Cast JS-imported providers to Typed React Components to prevent false-positive IDE warnings
const ProfileProviderTyped = ProfileProvider as React.ComponentType<{ children: React.ReactNode }>;
const CartProviderTyped = CartProvider as React.ComponentType<{ children: React.ReactNode }>;
const CompareProviderTyped = CompareProvider as React.ComponentType<{ children: React.ReactNode }>;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProviderTyped>
      <CartProviderTyped>
        <CompareProviderTyped>
          {children}
        </CompareProviderTyped>
      </CartProviderTyped>
    </ProfileProviderTyped>
  );
}
