'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string[];
  stock: number;
  minOrderQty?: number;
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
    if (product.stock <= 0) return;
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      const minQty = product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : (product.category === 'Cushion Covers' ? 2 : 1);
      const initialQty = Math.min(minQty, product.stock);
      return [...prev, { product, qty: initialQty }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setItems(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (!item) return prev;
      const minQty = item.product.minOrderQty && item.product.minOrderQty > 1 ? item.product.minOrderQty : (item.product.category === 'Cushion Covers' ? 2 : 1);
      if (qty < minQty) {
        return prev.filter(i => i.product.id !== productId);
      }
      const finalQty = qty > item.product.stock ? item.product.stock : qty;
      return prev.map(i => i.product.id === productId ? { ...i, qty: finalQty } : i);
    });
  }, []);

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
