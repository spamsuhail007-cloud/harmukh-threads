import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = 'sofisuhail007@gmail.com';
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'harmukh@upi';

type OrderItem = {
  name: string;
  image: string;
  price: number;
  qty: number;
};

type OrderEmailData = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
};

function formatPrice(rupees: number) {
  return '₹' + rupees.toLocaleString('en-IN');
}

function buildEmailHtml(order: OrderEmailData): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0e8e0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="60" style="vertical-align:top;">
                <img src="${item.image}" width="56" height="64"
                  style="object-fit:cover;border-radius:6px;display:block;" alt="${item.name}" />
              </td>
              <td style="padding-left:14px;vertical-align:top;">
                <div style="font-weight:600;font-size:15px;color:#1c1c18;">${item.name}</div>
                <div style="font-size:13px;color:#7a6550;margin-top:3px;">
                  Qty: ${item.qty} × ${formatPrice(item.price)}
                </div>
              </td>
              <td style="text-align:right;vertical-align:top;font-weight:700;color:#5c3d1e;font-size:15px;">
                ${formatPrice(item.price * item.qty)}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join('');

  const isPaid = order.paymentStatus === 'PAID';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed – Harmukh Threads</title>
</head>
<body style="margin:0;padding:0;background:#f5ede4;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#5c3d1e,#3d1f00);padding:36px 40px;text-align:center;">
              <div style="font-size:28px;letter-spacing:0.12em;color:#fef9f5;font-weight:700;">HARMUKH THREADS</div>
              <div style="font-size:13px;color:#c9a882;margin-top:6px;letter-spacing:0.05em;">Custodians of Kashmiri Craft</div>
            </td>
          </tr>

          <!-- Confirmed Banner -->
          <tr>
            <td style="background:#dcfce7;padding:18px 40px;text-align:center;border-bottom:1px solid #bbf7d0;">
              <div style="font-size:22px;">✅</div>
              <div style="font-size:18px;font-weight:700;color:#15803d;margin-top:6px;">Order Confirmed!</div>
              <div style="font-size:13px;color:#166534;margin-top:4px;">Your order <strong>#${order.orderNumber}</strong> has been confirmed by our team.</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <p style="font-size:16px;color:#3d1f00;margin:0 0 24px;">
                Dear <strong>${order.firstName}</strong>,<br/>
                Thank you for your order from Harmukh Threads. We've confirmed your order and our team is preparing it with care.
              </p>

              <!-- Order Items -->
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7a6550;margin-bottom:12px;">Your Items</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="font-size:14px;color:#7a6550;padding:6px 0;">Subtotal</td>
                  <td style="text-align:right;font-size:14px;color:#7a6550;padding:6px 0;">${formatPrice(order.subtotal)}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#7a6550;padding:6px 0;">Shipping</td>
                  <td style="text-align:right;font-size:14px;color:#7a6550;padding:6px 0;">${order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</td>
                </tr>
                <tr>
                  <td style="font-size:17px;font-weight:700;color:#3d1f00;padding:12px 0 6px;border-top:2px solid #f0e8e0;">Total</td>
                  <td style="text-align:right;font-size:22px;font-weight:700;color:#5c3d1e;padding:12px 0 6px;border-top:2px solid #f0e8e0;">${formatPrice(order.total)}</td>
                </tr>
              </table>

              <!-- Payment notice (if not yet paid) -->
              ${!isPaid ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#fef9c3;border:1px solid #fde047;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-size:15px;font-weight:700;color:#713f12;margin-bottom:8px;">💳 Complete Your Payment</div>
                    <div style="font-size:13px;color:#92400e;line-height:1.7;">
                      Please send <strong>${formatPrice(order.total)}</strong> to UPI ID: <strong style="font-family:monospace;">${UPI_ID}</strong><br/>
                      Add <strong>${order.orderNumber}</strong> in the payment note/remarks.<br/>
                      Use Google Pay, PhonePe, Paytm or any UPI app.
                    </div>
                  </td>
                </tr>
              </table>` : `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#dcfce7;border:1px solid #bbf7d0;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-size:14px;font-weight:700;color:#15803d;">✅ Payment Received</div>
                    <div style="font-size:13px;color:#166534;margin-top:4px;">We've received your payment. Thank you!</div>
                  </td>
                </tr>
              </table>`}

              <!-- Shipping Address -->
              <div style="margin-top:28px;padding:18px 20px;background:#fef9f5;border-radius:10px;border:1px solid #e8d5c4;">
                <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7a6550;margin-bottom:10px;">📦 Shipping To</div>
                <div style="font-size:14px;color:#3d1f00;line-height:1.8;">
                  ${order.firstName} ${order.lastName}<br/>
                  ${order.address}<br/>
                  ${order.city}, ${order.pincode}<br/>
                  ${order.country}<br/>
                  📞 ${order.phone}
                </div>
              </div>

              <div style="margin-top:28px;text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://harmukhthreads.com'}/collections"
                   style="display:inline-block;background:#5c3d1e;color:#fef9f5;padding:14px 32px;border-radius:99px;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.04em;">
                  Continue Shopping →
                </a>
              </div>

              <p style="font-size:13px;color:#a08060;margin-top:28px;line-height:1.7;text-align:center;">
                Questions? Contact us on
                <a href="https://wa.me/918491006127" style="color:#5c3d1e;">WhatsApp</a> — we're happy to help.<br/>
                Order reference: <strong>${order.orderNumber}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#3d1f00;padding:20px 40px;text-align:center;">
              <div style="font-size:12px;color:#c9a882;">© ${new Date().getFullYear()} Harmukh Threads · Made with care in Kashmir 🏔️</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `✅ Order Confirmed – #${order.orderNumber} | Harmukh Threads`,
      html: buildEmailHtml(order),
    });

    if (error) {
      console.error('[Resend] Failed to send order confirmation email:', error);
      return { success: false, error };
    }

    console.log('[Resend] Order confirmation email sent. ID:', data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Resend] Exception sending email:', err);
    return { success: false, error: err };
  }
}

function buildStatusHtml(order: OrderEmailData, status: string): string {
  let title = "Order Update";
  let subtitle = "Your order status has changed.";
  let bgBanner = "#dcfce7";
  let icon = "📦";

  if (status === 'PROCESSING') {
    title = "Order Processing";
    subtitle = `Your order <strong>#${order.orderNumber}</strong> is currently being processed by our artisans.`;
    bgBanner = "#fef3c7";
    icon = "⏳";
  } else if (status === 'SHIPPED') {
    title = "Order Shipped!";
    subtitle = `Your order <strong>#${order.orderNumber}</strong> has been shipped and is on its way!`;
    bgBanner = "#dbeafe";
    icon = "✈️";
  } else if (status === 'DELIVERED') {
    title = "Order Delivered!";
    subtitle = `Your order <strong>#${order.orderNumber}</strong> has been delivered. Enjoy 400 years of tradition.`;
    bgBanner = "#dcfce7";
    icon = "🎁";
  } else if (status === 'CANCELLED') {
    title = "Order Cancelled";
    subtitle = `Your order <strong>#${order.orderNumber}</strong> has been cancelled.`;
    bgBanner = "#fee2e2";
    icon = "❌";
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} – Harmukh Threads</title>
</head>
<body style="margin:0;padding:0;background:#f5ede4;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#5c3d1e,#3d1f00);padding:36px 40px;text-align:center;">
              <div style="font-size:28px;letter-spacing:0.12em;color:#fef9f5;font-weight:700;">HARMUKH THREADS</div>
              <div style="font-size:13px;color:#c9a882;margin-top:6px;letter-spacing:0.05em;">Custodians of Kashmiri Craft</div>
            </td>
          </tr>
          <tr>
            <td style="background:${bgBanner};padding:18px 40px;text-align:center;">
              <div style="font-size:22px;">${icon}</div>
              <div style="font-size:18px;font-weight:700;color:#1c1c18;margin-top:6px;">${title}</div>
              <div style="font-size:13px;color:#1c1c18;margin-top:4px;">${subtitle}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="font-size:16px;color:#3d1f00;margin:0 0 24px;">
                Dear <strong>${order.firstName}</strong>,<br/><br/>
                We wanted to let you know that the status of your order has been updated to: <strong>${status}</strong>.
              </p>
              <div style="margin-top:28px;padding:18px 20px;background:#fef9f5;border-radius:10px;border:1px solid #e8d5c4;">
                <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7a6550;margin-bottom:10px;">📦 Shipping To</div>
                <div style="font-size:14px;color:#3d1f00;line-height:1.8;">
                  ${order.firstName} ${order.lastName}<br/>
                  ${order.address}<br/>
                  ${order.city}, ${order.pincode}<br/>
                  ${order.country}
                </div>
              </div>
              <p style="font-size:13px;color:#a08060;margin-top:28px;line-height:1.7;text-align:center;">
                Questions? Contact us on
                <a href="https://wa.me/918491006127" style="color:#5c3d1e;">WhatsApp</a> — we're happy to help.<br/>
                Order reference: <strong>${order.orderNumber}</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#3d1f00;padding:20px 40px;text-align:center;">
              <div style="font-size:12px;color:#c9a882;">© ${new Date().getFullYear()} Harmukh Threads · Made with care in Kashmir 🏔️</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderStatusEmail(order: OrderEmailData, status: string) {
  try {
    let subjectIcon = '📦';
    if (status === 'PROCESSING') subjectIcon = '⏳';
    if (status === 'SHIPPED') subjectIcon = '✈️';
    if (status === 'DELIVERED') subjectIcon = '🎁';
    if (status === 'CANCELLED') subjectIcon = '❌';

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      replyTo: 'sofisuhail007@gmail.com',
      subject: `${subjectIcon} Order ${status} – #${order.orderNumber} | Harmukh Threads`,
      html: buildStatusHtml(order, status),
    });
    if (error) {
      console.error('[Resend] Failed to send order status email:', error);
      return { success: false, error };
    }
    return { success: true, id: data?.id };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function sendEnquiryCopyEmail(enquiry: { name: string; email: string; phone: string; subject: string; message: string }) {
  const html = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f5ede4;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#5c3d1e,#3d1f00);padding:36px 40px;text-align:center;">
              <div style="font-size:28px;letter-spacing:0.12em;color:#fef9f5;font-weight:700;">HARMUKH THREADS</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="font-size:16px;color:#3d1f00;margin:0 0 24px;">
                Dear <strong>${enquiry.name}</strong>,<br/><br/>
                Thank you for reaching out! We have received your message and our artisans or support team will get back to you shortly.
              </p>
              <div style="margin-top:20px;padding:18px 20px;background:#fef9f5;border-radius:10px;border:1px solid #e8d5c4;">
                <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7a6550;margin-bottom:10px;">Your Message</div>
                <div style="font-size:14px;color:#3d1f00;line-height:1.6;">
                  <strong>Subject:</strong> ${enquiry.subject}<br/><br/>
                  ${enquiry.message.replace(/n/g, '<br/>')}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#3d1f00;padding:20px 40px;text-align:center;">
              <div style="font-size:12px;color:#c9a882;">© ${new Date().getFullYear()} Harmukh Threads</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: enquiry.email,
      replyTo: 'sofisuhail007@gmail.com',
      subject: `Thank you for contacting Harmukh Threads: ${enquiry.subject}`,
      html,
    });
    if (error) return { success: false, error };
    return { success: true, id: data?.id };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function sendAdminOrderNotification(order: OrderEmailData) {
  const html = `
    <h2>New Order Received: #${order.orderNumber}</h2>
    <p><strong>Customer:</strong> ${order.firstName} ${order.lastName} (${order.email})</p>
    <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
    <p>Log in to the <a href="https://harmukhthreads.com/admin/orders">Admin Dashboard</a> to view details.</p>
  `;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚨 NEW ORDER: #${order.orderNumber} - ${formatPrice(order.total)}`,
      html,
    });
  } catch (err) {
    console.error('Failed to notify admin of order', err);
  }
}

export async function sendAdminEnquiryNotification(enquiry: { name: string; email: string; phone: string; subject: string; message: string }) {
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${enquiry.name} (${enquiry.email})</p>
    <p><strong>Phone:</strong> ${enquiry.phone}</p>
    <p><strong>Subject:</strong> ${enquiry.subject}</p>
    <hr/>
    <p>${enquiry.message.replace(/\n/g, '<br/>')}</p>
  `;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: enquiry.email,
      subject: `📩 Contact Form: ${enquiry.subject}`,
      html,
    });
  } catch (err) {
    console.error('Failed to notify admin of enquiry', err);
  }
}

