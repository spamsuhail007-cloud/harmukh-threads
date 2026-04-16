export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-3xl) 0', maxWidth: '800px' }}>
      <h1 className="section-title">Privacy Policy</h1>
      <p style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--space-xl)' }}>
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>

      <div style={{ lineHeight: 1.8, color: 'var(--on-surface)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <p>This Privacy Policy describes how Harmukh Threads ("we", "us", or "our") collects, uses, and discloses your personal information when you visit or make a purchase from harmukhthreads.com (the "Site").</p>

        <h3>1. Information We Collect</h3>
        <p>When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. We collect this information directly from you and through technologies like cookies, log files, and web beacons.</p>
        
        <h3>2. How We Use Your Information</h3>
        <p>We use your personal information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.</p>

        <h3>3. Google reCAPTCHA</h3>
        <p>We use Google reCAPTCHA v3 on our site to prevent spam and abuse. This service checks if the data entered on our website (such as on a checkout or contact form) has been entered by a human or an automated program. By using this service, your hardware and software information, such as device and application data, is collected by Google for analysis. The use of reCAPTCHA is subject to the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Terms of Service</a>.</p>

        <h3>4. Sharing Personal Information</h3>
        <p>We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</p>
        
        <h3>5. Your Rights</h3>
        <p>If you are a resident of certain regions, you have the right to access the personal information we hold about you, to port it to a new service, and to ask that your personal information be corrected, updated, or erased. If you would like to exercise these rights, please contact us through the contact information below.</p>
        
        <h3>6. Contact Us</h3>
        <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at <strong>hello@harmukh.in</strong>.</p>
      </div>
    </div>
  );
}
