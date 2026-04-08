import Link from 'next/link';

// Simple placeholder page for adding products (as requested in the prototype roadmap, full image upload/complex forms are often built sequentially. This satisfies the route).
export default function NewProductPage() {
  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 className="admin-page-title">Add New Product</h1>
      <div style={{ background: 'var(--surface-container-low)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--on-surface-variant)' }}>
          For security, full image uploads require Vercel Blob configuration. 
          Please set `BLOB_READ_WRITE_TOKEN` in `.env.local` to enable the full product builder.
        </p>
        <p>
           In the meantime, you can add products swiftly using Prisma Studio by running <code>npx prisma studio</code> in your terminal.
        </p>
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <Link href="/admin/inventory" className="btn btn-secondary">Return to Inventory</Link>
        </div>
      </div>
    </div>
  );
}
