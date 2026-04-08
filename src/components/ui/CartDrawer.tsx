'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';

type CartDrawerProps = object;

export function CartDrawer(_: CartDrawerProps) {
  const { items, count, total, isOpen, remove, updateQty, closeCart } = useCart();
  const router = useRouter();

  return (
    <>
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <h2 className="cart-title">Your Bag {count > 0 && <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--on-surface-variant)' }}>({count})</span>}</h2>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <p>Your bag is empty</p>
              <p className="cart-empty-sub">Discover our handcrafted pieces</p>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }} onClick={() => { closeCart(); router.push('/collections'); }}>
                Browse Collection
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="cart-item">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={72}
                  height={90}
                  className="cart-item-image"
                  style={{ objectFit: 'cover' }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-meta">{item.product.category}</div>
                  <div className="cart-item-actions">
                    <button className="qty-btn" onClick={() => updateQty(item.product.id, item.qty - 1)} aria-label="Decrease">−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.product.id, item.qty + 1)} aria-label="Increase">+</button>
                    <button
                      style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textDecoration: 'underline' }}
                      onClick={() => remove(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-price">{formatPrice(item.product.price * item.qty)}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Subtotal</span>
              <span className="cart-total-amount">{formatPrice(total)}</span>
            </div>
            <p className="cart-shipping-note">🚚 Free shipping on all orders · Cash on Delivery available</p>
            <button className="btn btn-primary btn-full" onClick={() => { closeCart(); router.push('/checkout'); }}>
              Proceed to Checkout
            </button>
            <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: '8px' }} onClick={closeCart}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
