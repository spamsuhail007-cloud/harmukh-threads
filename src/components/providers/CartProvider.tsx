'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string[];
};

export type CartItem = {
  product: CartProduct;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  add: (product: CartProduct) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  const add = useCallback((product: CartProduct) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) { remove(productId); return; }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i));
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider value={{ items, count, total, isOpen, add, remove, updateQty, clear, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
