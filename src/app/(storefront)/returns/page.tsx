import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quality Assurance & Return Policy | Harmukh Threads',
  description:
    'Learn about our pre-shipment quality inspection process and our strict no-returns policy.',
};

const inspectionSteps = [
  {
    step: '01',
    icon: '🧵',
    title: 'Material Verification',
    desc: 'Each piece is sourced and verified for 100% authentic Kashmiri origin. Material purity and GI compliance are confirmed at intake.',
  },
  {
    step: '02',
    icon: '🔍',
    title: 'Weave & Stitch Inspection',
    desc: 'Master weavers inspect every warp and weft under natural light — examining consistency, density, and the integrity of each knot or stitch.',
  },
  {
    step: '03',
    icon: '🎨',
    title: 'Color & Finish Check',
    desc: 'Dyes are inspected for evenness and colorfastness. Embroidery borders, fringes, and finishing edges are examined for perfection.',
  },
  {
    step: '04',
    icon: '📦',
    title: 'Pre-Shipment Sign-Off',
    desc: 'Only after a final sign-off by our senior quality lead is your order sealed, documented, and dispatched with full transit insurance.',
  },
];

const faqs = [
  {
    q: "Why don't you accept returns?",
    a: "Every order is personally inspected and verified by our master craftsmen before it is shipped. We guarantee the condition, authenticity, and quality of each piece when it leaves our atelier. Because we manually inspect every product for damage or quality issues prior to shipping, we do not accept returns or exchanges.",
  },
  {
    q: 'What if my item arrives damaged in transit?',
    a: 'All orders are shipped fully insured. In the extremely rare event that your piece is damaged during transit, please photograph the damage and packaging within 24 hours of delivery and contact us immediately at harmukhthreads@gmail.com or WhatsApp (+91 84910 06127). Transit damage claims are handled directly through shipping insurance.',
  },
  {
    q: 'Can I cancel my order after placing it?',
    a: 'Orders can be cancelled within 2 hours of placement, before our inspection and packaging process begins. Once an item enters pre-shipment inspection, the order cannot be cancelled.',
  },
  {
    q: 'How can I be sure the piece matches the photos?',
    a: 'All product photography represents the exact craft style. For high-value or hand-knotted pieces, we can provide additional live photos, video walkthroughs, and condition reports on request before you purchase.',
  },
  {
    q: 'What does the pre-shipment inspection cover?',
    a: 'Our inspection covers material authenticity (GI compliance), structural weave integrity, surface condition (checking for stains or snags), color consistency, and border/fringe finishing.',
  },
];

export default function ReturnPolicyPage() {
  return (
    <div style={{ background: 'var(--surface-container-lowest, #fcf9f2)', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1c1c18 0%, #3a2a20 60%, #9b4000 100%)',
          color: '#fcf9f2',
          padding: '4rem 1.5rem 3.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 219, 203, 0.12)',
            border: '1px solid rgba(255, 182, 146, 0.25)',
            borderRadius: '99px',
            padding: '6px 20px',
            marginBottom: '1.25rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffb692' }}>
            Quality Assurance & Shipping Policy
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem', color: '#ffffff' }}>
          Every piece is manually inspected.<br />
          <em style={{ color: '#ffb692', fontStyle: 'italic' }}>We do not do returns.</em>
        </h1>

        <p style={{ maxWidth: '620px', margin: '0 auto', color: 'rgba(252, 249, 242, 0.8)', lineHeight: 1.8, fontSize: '1.05rem' }}>
          To ensure total perfection and prevent any hassle, every single product is hand-checked for defects, weave integrity, and finish before shipment.
        </p>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '860px', margin: '0 auto' }}>
        {/* Warning Callout Box */}
        <div
          style={{
            background: '#fff5f0',
            border: '2px solid #9b4000',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '3rem',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'flex-start',
            boxShadow: '0 8px 24px rgba(155, 64, 0, 0.08)',
          }}
        >
          <div
            style={{
              background: '#9b4000',
              color: '#fff',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
            }}
          >
            🚫
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9b4000', marginBottom: '4px' }}>
              Strict Policy Notice
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.4rem', fontWeight: 700, color: '#1c1c18', marginBottom: '8px' }}>
              No Returns or Exchanges Accepted
            </h2>
            <p style={{ color: '#574238', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
              All sales at Harmukh Threads are <strong>final</strong>. We manually inspect each product for any damage, structural flaws, or quality issues prior to dispatch. Because only pristine items leave our facility, we do not accept returns or process exchanges.
            </p>
          </div>
        </div>

        {/* 4-Step Inspection Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9b4000', marginBottom: '8px' }}>
            Pre-Shipment Guarantee
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.8rem', fontWeight: 700, color: '#1c1c18' }}>
            Our Manual Quality Protocol
          </h2>
          <p style={{ color: 'var(--on-surface-variant, #574238)', maxWidth: '580px', margin: '8px auto 0', lineHeight: 1.7 }}>
            Here is how we verify your handcrafted piece before it is packed and dispatched:
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3.5rem',
          }}
        >
          {inspectionSteps.map((step) => (
            <div
              key={step.step}
              style={{
                background: '#ffffff',
                border: '1px solid var(--outline-variant, #dfc0b3)',
                borderRadius: '12px',
                padding: '1.5rem',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontFamily: 'var(--font-serif, serif)', fontSize: '2rem', fontWeight: 700, color: '#e5e2db' }}>
                {step.step}
              </div>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{step.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#1c1c18' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#574238', lineHeight: 1.6, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.6rem', fontWeight: 700, color: '#1c1c18', marginBottom: '1.5rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq) => (
              <div
                key={faq.q}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--outline-variant, #dfc0b3)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.05rem', fontWeight: 700, color: '#1c1c18', marginBottom: '8px' }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#574238', lineHeight: 1.7, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, #9b4000, #793000)',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>💬</div>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px' }}>
            Have a question before buying?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '1.75rem', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 1.75rem' }}>
            We want you to order with complete confidence. Contact our team for detailed photos, video inspections, or exact dimensions before completing your purchase.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/918491006127"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#25D366',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '99px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              💬 WhatsApp Us
            </a>
            <a
              href="mailto:harmukhthreads@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '99px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              ✉️ Email Us
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--on-surface-variant, #574238)', marginTop: '2rem' }}>
          For any special requests prior to ordering, <Link href="/contact" style={{ color: '#9b4000', textDecoration: 'underline' }}>contact our customer care team</Link>.
        </p>
      </div>
    </div>
  );
}
