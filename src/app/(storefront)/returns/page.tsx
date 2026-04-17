import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Return & Exchange Policy | Harmukh Threads',
  description:
    'Learn about our hassle-free return and exchange policy for hand-knotted rugs and pillow covers.',
};

const sections = [
  {
    icon: '🔄',
    title: 'Return Window',
    content: `We accept returns within **7 days** of delivery. Items must be in their original, unused condition with all tags intact. Due to the handcrafted nature of our products, minor natural variations in weave, colour, or texture are not considered defects.`,
  },
  {
    icon: '✅',
    title: 'Eligible Items',
    content: `The following items are eligible for return or exchange:
- Hand-knotted rugs (undamaged, uninstalled)
- Pillow covers (unused, in original packaging)

**Custom-made or personalised orders are non-returnable.**`,
  },
  {
    icon: '❌',
    title: 'Non-Returnable Items',
    content: `We cannot accept returns for:
- Items showing signs of use, washing, or installation
- Products damaged after delivery due to mishandling
- Custom orders made to specific dimensions or colour specifications
- Sale or clearance items marked as final sale`,
  },
  {
    icon: '📦',
    title: 'How to Initiate a Return',
    content: `To start a return:
1. Contact us on WhatsApp at **+91 84910 06127** or email **harmukhthreads@gmail.com** within 7 days of delivery
2. Share your **order number** and photos of the item
3. Our team will review and confirm eligibility within **24–48 hours**
4. We will arrange a pickup from your address at no extra cost for eligible returns`,
  },
  {
    icon: '💳',
    title: 'Refunds',
    content: `Once we receive and inspect the returned item:
- **UPI / Bank Transfer refunds** are processed within **5–7 business days**
- You will be refunded the full product amount (shipping cost is non-refundable unless the return is due to our error)
- Refunds are issued to the original payment method or UPI ID provided by you`,
  },
  {
    icon: '🔁',
    title: 'Exchanges',
    content: `If you'd like to exchange for a different size or product, please mention this when contacting us. Exchanges are subject to stock availability. Any price difference will be adjusted via UPI payment or refund.`,
  },
  {
    icon: '🚚',
    title: 'Damaged or Incorrect Items',
    content: `If your order arrives damaged or is incorrect, please **contact us within 48 hours of delivery** with photographs. We will arrange a replacement or full refund at no cost to you. We take full responsibility for any errors on our part.`,
  },
];

function renderContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('- ')) {
      return (
        <li key={i} style={{ marginBottom: '6px', lineHeight: 1.7, color: 'var(--on-surface-variant)' }}>
          {line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}
        </li>
      );
    }
    if (/^\d+\./.test(line)) {
      return (
        <li key={i} style={{ marginBottom: '6px', lineHeight: 1.7, color: 'var(--on-surface-variant)' }}>
          {line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
        </li>
      );
    }
    if (line === '') return <br key={i} />;
    // Bold inline
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{ marginBottom: '8px', lineHeight: 1.8, color: 'var(--on-surface-variant)' }}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} style={{ color: 'var(--on-surface)' }}>{part}</strong> : part
        )}
      </p>
    );
  });
}

export default function ReturnPolicyPage() {
  const isList = (text: string) => text.includes('\n- ') || text.match(/\n\d+\./);

  return (
    <div style={{ background: 'var(--surface-container-lowest)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--surface-container), var(--surface-container-low))',
        borderBottom: '1px solid var(--outline-variant)',
        padding: 'var(--space-3xl) var(--space-lg)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 'var(--space-md)' }}>
          Customer Care
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          Return & Exchange Policy
        </h1>
        <p style={{ maxWidth: '560px', margin: '0 auto', color: 'var(--on-surface-variant)', lineHeight: 1.8, fontSize: '1rem' }}>
          We stand behind every piece we sell. If you're not completely satisfied, we're here to make it right.
        </p>
      </div>

      <div className="container" style={{ padding: 'var(--space-3xl) var(--space-lg)', maxWidth: '780px' }}>

        {/* Quick summary bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-3xl)',
        }}>
          {[
            { icon: '📅', title: '7-Day Returns', sub: 'From date of delivery' },
            { icon: '🚚', title: 'Free Pickup', sub: 'For eligible returns' },
            { icon: '💸', title: '5–7 Day Refund', sub: 'To original payment method' },
            { icon: '💬', title: '24/7 Support', sub: 'WhatsApp & Email' },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--surface-container)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Policy sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {sections.map((section) => (
            <div key={section.title} style={{
              background: '#fff',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl) var(--space-2xl)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                  {section.title}
                </h2>
              </div>
              {isList(section.content) ? (
                <ul style={{ paddingLeft: '20px', margin: 0 }}>{renderContent(section.content)}</ul>
              ) : (
                <div>{renderContent(section.content)}</div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 'var(--space-3xl)',
          background: 'linear-gradient(135deg, var(--primary), #8b5e3c)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2xl)',
          textAlign: 'center',
          color: 'var(--on-primary)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🤝</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '12px' }}>
            Need to return something?
          </h2>
          <p style={{ opacity: 0.85, marginBottom: 'var(--space-xl)', lineHeight: 1.7 }}>
            Our team is ready to help. Reach out via WhatsApp or email and we'll sort it quickly.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/918491006127"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#25D366', color: '#fff',
                padding: '12px 24px', borderRadius: '99px',
                fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
              }}
            >
              💬 WhatsApp Us
            </a>
            <a
              href="mailto:harmukhthreads@gmail.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                padding: '12px 24px', borderRadius: '99px',
                fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              ✉️ Email Us
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: 'var(--space-xl)' }}>
          This policy was last updated in April 2026. For any questions, <Link href="/contact" style={{ color: 'var(--primary)' }}>contact our team</Link>.
        </p>
      </div>
    </div>
  );
}
