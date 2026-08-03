import { getAbandonedCarts } from '@/actions/abandonedCarts';
import AbandonedCartsClient from './AbandonedCartsClient';

export const dynamic = 'force-dynamic';

export default async function AbandonedCartsPage() {
  const leads = await getAbandonedCarts();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
            🛒 Abandoned Carts
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', marginTop: '4px' }}>
            Leads captured when customers filled checkout details but didn't complete payment. Reach out via Call, WhatsApp, or Email to recover sales!
          </p>
        </div>
      </div>

      <AbandonedCartsClient initialLeads={leads as any[]} />
    </div>
  );
}
