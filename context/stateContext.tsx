"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Product, CartItem, UserProfile } from "@/types";

// Cart Context
interface CartContextProps {
  cartItems: CartItem[];
  itemCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartState");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Failed to parse cart localstorage", err);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart and update cookie counts
  useEffect(() => {
    if (!Array.isArray(cartItems)) {
      setCartItems([]);
      return;
    }
    localStorage.setItem("cartState", JSON.stringify(cartItems));
    const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setItemCount(total);
    Cookies.set("cart_count", String(total), { expires: 7 });
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => String(item.product.product_id) === String(product.product_id));
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCartItems((prev) => prev.filter((item) => String(item.product.product_id) !== String(productId)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, itemCount, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

// Compare Context
interface CompareContextProps {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string | number) => void;
}

const CompareContext = createContext<CompareContextProps | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    setCompareItems((prev) => {
      if (prev.some((p) => String(p.product_id) === String(product.product_id))) return prev;
      if (prev.length >= 3) {
        alert("You can compare up to 3 medicines at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string | number) => {
    setCompareItems((prev) => prev.filter((p) => String(p.product_id) !== String(productId)));
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within a CompareProvider");
  return context;
};

// Profile Context
interface ProfileContextProps {
  profile: UserProfile;
  login: (userData: Omit<UserProfile, "isLoggedIn">) => void;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>({
    customer_id: "",
    phone_number: "",
    isLoggedIn: false,
  });

  useEffect(() => {
    const customer_id = Cookies.get("customer_id");
    const customer_name = Cookies.get("customer_name");
    const email = Cookies.get("email");
    const location = Cookies.get("location");

    if (customer_id) {
      setProfile({
        customer_id,
        customer_name,
        email,
        phone_number: "",
        location,
        isLoggedIn: true,
      });
    }
  }, []);

  const login = (userData: Omit<UserProfile, "isLoggedIn">) => {
    setProfile({
      ...userData,
      isLoggedIn: true,
    });
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    Cookies.remove("customer_id");
    Cookies.remove("customer_name");
    Cookies.remove("email");
    Cookies.remove("location");
    localStorage.clear();
    setProfile({ customer_id: "", phone_number: "", isLoggedIn: false });
  };

  return (
    <ProfileContext.Provider value={{ profile, login, logout }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};
