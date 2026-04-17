export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-3xl) 0', maxWidth: '800px' }}>
      <h1 className="section-title">Terms of Service</h1>
      <p style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--space-xl)' }}>
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>

      <div style={{ lineHeight: 1.8, color: 'var(--on-surface)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <p>Welcome to Harmukh Threads. These Terms of Service outline the rules and regulations for the use of our website, harmukhthreads.com.</p>
        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Harmukh Threads if you do not agree to take all of the terms and conditions stated on this page.</p>

        <h3>1. General Conditions</h3>
        <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.</p>

        <h3>2. Products or Services</h3>
        <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>

        <h3>3. Accuracy of Billing and Account Information</h3>
        <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.</p>

        <h3>4. Security and Fraud Prevention</h3>
        <p>This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Terms of Service</a> apply.</p>

        <h3>5. Changes to Terms of Service</h3>
        <p>You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.</p>
        
        <h3>6. Contact Information</h3>
        <p>Questions about the Terms of Service should be sent to us at <strong>harmukhthreads@gmail.com</strong>.</p>
      </div>
    </div>
  );
}
