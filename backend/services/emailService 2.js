const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const BRAND = 'WAVWAY';
const BRAND_URL = 'https://neglectedly-apophysate-janetta.ngrok-free.dev';

// ─── Base template ──────────────────────────────────────────────────────────
const base = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#f4f4f5; font-family:'Helvetica Neue',Arial,sans-serif; color:#18181b; }
    .wrapper { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,0.08); }
    .header { background:#0a0a0a; padding:28px 40px; display:flex; align-items:center; justify-content:space-between; }
    .brand { font-size:22px; font-weight:800; letter-spacing:4px; color:#fff; text-decoration:none; }
    .body { padding:40px; }
    .footer { background:#f4f4f5; padding:28px 40px; text-align:center; border-top:1px solid #e4e4e7; }
    .footer p { font-size:12px; color:#71717a; line-height:1.6; }
    .footer a { color:#71717a; }
    .btn { display:inline-block; padding:14px 32px; background:#0a0a0a; color:#fff!important; text-decoration:none; border-radius:8px; font-weight:700; font-size:15px; letter-spacing:0.2px; margin-top:8px; }
    .btn-outline { background:#fff; color:#0a0a0a!important; border:2px solid #0a0a0a; }
    h1 { font-size:26px; font-weight:800; color:#0a0a0a; margin-bottom:8px; letter-spacing:-0.3px; }
    h2 { font-size:18px; font-weight:700; color:#0a0a0a; margin-bottom:12px; margin-top:32px; }
    p { font-size:15px; color:#3f3f46; line-height:1.7; margin-bottom:12px; }
    .badge { display:inline-block; padding:4px 12px; border-radius:100px; font-size:12px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
    .badge-processing { background:#fef9c3; color:#854d0e; }
    .badge-shipped    { background:#dbeafe; color:#1e40af; }
    .badge-delivered  { background:#dcfce7; color:#166534; }
    .badge-cancelled  { background:#fee2e2; color:#991b1b; }
    .badge-incomplete { background:#f4f4f5; color:#52525b; }
    .divider { height:1px; background:#f4f4f5; margin:28px 0; }
    .order-table { width:100%; border-collapse:collapse; margin:16px 0; }
    .order-table th { text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#71717a; padding:0 0 10px 0; border-bottom:1px solid #e4e4e7; }
    .order-table td { padding:14px 0; border-bottom:1px solid #f4f4f5; font-size:14px; color:#3f3f46; vertical-align:top; }
    .order-table tr:last-child td { border-bottom:none; }
    .item-name { font-weight:600; color:#0a0a0a; font-size:14px; }
    .item-meta { font-size:12px; color:#71717a; margin-top:2px; }
    .total-row td { font-weight:700; color:#0a0a0a; font-size:15px; padding-top:16px!important; border-top:2px solid #0a0a0a!important; border-bottom:none!important; }
    .info-grid { display:table; width:100%; background:#fafafa; border-radius:10px; padding:20px; margin:20px 0; }
    .info-row { display:table-row; }
    .info-label { display:table-cell; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#71717a; padding:5px 16px 5px 0; white-space:nowrap; }
    .info-value { display:table-cell; font-size:14px; color:#0a0a0a; font-weight:500; padding:5px 0; }
    .status-bar { background:#f4f4f5; border-radius:10px; padding:20px 24px; margin:24px 0; display:flex; gap:0; }
    .step { flex:1; text-align:center; position:relative; }
    .step-dot { width:24px; height:24px; border-radius:50%; background:#e4e4e7; margin:0 auto 8px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#71717a; }
    .step-dot.done { background:#0a0a0a; color:#fff; }
    .step-dot.active { background:#6366f1; color:#fff; }
    .step-label { font-size:11px; color:#71717a; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
    .step-label.active { color:#6366f1; }
    .step-label.done { color:#0a0a0a; }
    .highlight-box { border:1.5px solid #e4e4e7; border-radius:10px; padding:20px 24px; margin:20px 0; }
    .highlight-box.purple { border-color:#e0e7ff; background:#f5f3ff; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <a href="${BRAND_URL}" class="brand">${BRAND}</a>
      <span style="font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;">FASHION STORE</span>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p style="margin-bottom:8px;">
        <a href="${BRAND_URL}">Shop</a> &nbsp;·&nbsp;
        <a href="${BRAND_URL}/orders">My Orders</a> &nbsp;·&nbsp;
        <a href="https://wa.me/?text=Hi+WAVWAY">WhatsApp Support</a>
      </p>
      <p>© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
      <p style="margin-top:6px;font-size:11px;color:#a1a1aa;">You're receiving this email because you have an account or placed an order at WAVWAY.</p>
    </div>
  </div>
</body>
</html>`;

// ─── Status step helper ──────────────────────────────────────────────────────
const statusSteps = (currentStatus) => {
    const steps = ['Processing', 'Shipped', 'Delivered'];
    const idx = steps.indexOf(currentStatus);
    return `
    <div class="status-bar">
      ${steps.map((s, i) => `
        <div class="step">
          <div class="step-dot ${i < idx ? 'done' : i === idx ? 'active' : ''}">
            ${i < idx ? '✓' : i + 1}
          </div>
          <div class="step-label ${i < idx ? 'done' : i === idx ? 'active' : ''}">${s}</div>
        </div>
      `).join('')}
    </div>`;
};

// ─── Items table helper ──────────────────────────────────────────────────────
const itemsTable = (items, totalAmount, discount) => `
  <table class="order-table">
    <thead><tr>
      <th>Item</th>
      <th style="text-align:center">Qty</th>
      <th style="text-align:right">Price</th>
    </tr></thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>
            <div class="item-name">${item.name}</div>
            <div class="item-meta">₹${Number(item.price).toLocaleString('en-IN')} each</div>
          </td>
          <td style="text-align:center;font-weight:600;">${item.quantity}</td>
          <td style="text-align:right;font-weight:600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>`).join('')}
      ${discount > 0 ? `
        <tr>
          <td colspan="2" style="text-align:right;font-size:13px;color:#16a34a;font-weight:600;padding-top:12px;">Coupon Discount</td>
          <td style="text-align:right;color:#16a34a;font-weight:600;padding-top:12px;">−₹${Number(discount).toLocaleString('en-IN')}</td>
        </tr>` : ''}
      <tr class="total-row">
        <td colspan="2">Total Payable</td>
        <td style="text-align:right">₹${Number(totalAmount).toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>`;

// ─── 1. Welcome Email ────────────────────────────────────────────────────────
const sendWelcomeEmail = async ({ name, email }) => {
    return resend.emails.send({
        from: `${BRAND} <${FROM}>`,
        to: email,
        subject: `Welcome to WAVWAY, ${name.split(' ')[0]}! 🎉`,
        html: base(`
          <h1>Welcome to WAVWAY, ${name.split(' ')[0]}! 👋</h1>
          <p style="margin-bottom:24px;">Your account has been created. Discover the latest fashion drops, exclusive member deals, and easy WhatsApp checkout.</p>

          <div class="highlight-box purple" style="margin-bottom:28px;">
            <p style="margin:0;font-size:14px;color:#4f46e5;font-weight:600;">🎁 First Order Perk</p>
            <p style="margin:6px 0 0;font-size:13px;color:#6366f1;">Enjoy free shipping on your first order. Just shop and checkout via WhatsApp!</p>
          </div>

          <a href="${BRAND_URL}" class="btn">Start Shopping →</a>

          <div class="divider"></div>
          <h2 style="margin-top:0;">Why shop at WAVWAY?</h2>
          <table style="width:100%;border-collapse:collapse;">
            ${[
              ['🛍️', 'Curated Collections', 'Hand-picked styles for Men, Women & Unisex.'],
              ['💬', 'WhatsApp Checkout', 'Simple, fast checkout over WhatsApp. No payment hassle.'],
              ['📦', 'Easy Tracking', 'Track every order in real-time from your account.'],
              ['🎫', 'Exclusive Coupons', 'Member-only discounts delivered straight to your inbox.'],
            ].map(([icon, title, desc]) => `
              <tr>
                <td style="padding:12px 12px 12px 0;font-size:22px;vertical-align:top;width:40px;">${icon}</td>
                <td style="padding:12px 0;">
                  <div style="font-weight:700;font-size:14px;color:#0a0a0a;margin-bottom:2px;">${title}</div>
                  <div style="font-size:13px;color:#71717a;">${desc}</div>
                </td>
              </tr>`).join('')}
          </table>
        `)
    });
};

// ─── 2. Order Confirmation ───────────────────────────────────────────────────
const sendOrderConfirmation = async (order) => {
    if (!order.email) return;
    const orderId = order._id?.toString().slice(-8).toUpperCase();
    return resend.emails.send({
        from: `${BRAND} <${FROM}>`,
        to: order.email,
        subject: `Order Confirmed #${orderId} — WAVWAY`,
        html: base(`
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <h1 style="margin:0;">Order Confirmed! ✅</h1>
            <span class="badge badge-processing">Processing</span>
          </div>
          <p>Hi <strong>${order.customerName.split(' ')[0]}</strong>, we've received your order and it's being prepared. You'll get another email when it ships.</p>

          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Order ID</div>
              <div class="info-value">#${orderId}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Order Date</div>
              <div class="info-value">${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Payment</div>
              <div class="info-value">Cash on Delivery / WhatsApp</div>
            </div>
          </div>

          <h2>Order Summary</h2>
          ${itemsTable(order.items, order.totalAmount, order.discount)}

          <h2>Delivery Address</h2>
          <div class="highlight-box">
            <p style="margin:0;font-weight:600;font-size:14px;">${order.customerName}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#71717a;">${order.address}, ${order.city} – ${order.zip}</p>
            <p style="margin:4px 0 0;font-size:13px;color:#71717a;">📞 ${order.phone}</p>
          </div>

          <div class="divider"></div>
          <p style="font-size:13px;color:#71717a;margin:0;">Need help? Reply to this email or chat with us on <a href="https://wa.me/?text=Hi+WAVWAY,+my+order+is+%23${orderId}" style="color:#0a0a0a;font-weight:600;">WhatsApp</a>.</p>
          <a href="${BRAND_URL}/orders" class="btn" style="margin-top:20px;display:inline-block;">Track My Order →</a>
        `)
    });
};

// ─── 3. Order Status Update ──────────────────────────────────────────────────
const sendOrderStatusUpdate = async (order) => {
    if (!order.email) return;
    const orderId = order._id?.toString().slice(-8).toUpperCase();
    const statusInfo = {
        Processing: { emoji: '⚙️', msg: 'Your order is being processed and packed carefully.', badge: 'badge-processing' },
        Shipped:    { emoji: '🚚', msg: 'Your order is on its way! Expected delivery in 2–5 business days.', badge: 'badge-shipped' },
        Delivered:  { emoji: '🎉', msg: 'Your order has been delivered. We hope you love it!', badge: 'badge-delivered' },
        Cancelled:  { emoji: '❌', msg: 'Your order has been cancelled. Contact us if this was a mistake.', badge: 'badge-cancelled' },
    };
    const info = statusInfo[order.status] || { emoji: '📦', msg: 'Your order status has been updated.', badge: 'badge-incomplete' };

    return resend.emails.send({
        from: `${BRAND} <${FROM}>`,
        to: order.email,
        subject: `${info.emoji} Order #${orderId} — ${order.status} | WAVWAY`,
        html: base(`
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;">
            <h1 style="margin:0;">Order ${order.status}</h1>
            <span class="badge ${info.badge}">${order.status}</span>
          </div>
          <p>Hi <strong>${order.customerName.split(' ')[0]}</strong>, ${info.msg}</p>

          ${['Processing','Shipped','Delivered'].includes(order.status) ? statusSteps(order.status) : ''}

          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Order ID</div>
              <div class="info-value">#${orderId}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status</div>
              <div class="info-value">${order.status}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Total</div>
              <div class="info-value">₹${Number(order.totalAmount).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <h2>Items in this Order</h2>
          ${itemsTable(order.items, order.totalAmount, order.discount)}

          ${order.status === 'Delivered' ? `
          <div class="highlight-box purple">
            <p style="margin:0;font-weight:700;font-size:15px;color:#4f46e5;">How was your order? 💬</p>
            <p style="margin:6px 0 12px;font-size:13px;color:#6366f1;">We'd love to hear from you. Share your experience on WhatsApp.</p>
            <a href="https://wa.me/?text=Hi+WAVWAY!+I+received+my+order+%23${orderId}" class="btn" style="font-size:13px;padding:10px 20px;">Share Feedback</a>
          </div>` : ''}

          <div class="divider"></div>
          <a href="${BRAND_URL}/orders" class="btn">View Order Details →</a>
        `)
    });
};

// ─── 4. Password Reset ───────────────────────────────────────────────────────
const sendPasswordResetEmail = async ({ name, email, resetToken }) => {
    const resetUrl = `${BRAND_URL}/reset-password?token=${resetToken}`;
    return resend.emails.send({
        from: `${BRAND} <${FROM}>`,
        to: email,
        subject: `Reset your WAVWAY password`,
        html: base(`
          <h1>Password Reset Request 🔐</h1>
          <p>Hi <strong>${name}</strong>, we received a request to reset your password. Click the button below to set a new one.</p>

          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" class="btn">Reset My Password →</a>
          </div>

          <div class="highlight-box" style="background:#fef9c3;border-color:#fde68a;">
            <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">⚠️ This link expires in 1 hour</p>
            <p style="margin:4px 0 0;font-size:12px;color:#b45309;">If you didn't request a password reset, you can safely ignore this email. Your account is secure.</p>
          </div>

          <div class="divider"></div>
          <p style="font-size:12px;color:#71717a;">If the button doesn't work, copy and paste this link:<br/>
          <a href="${resetUrl}" style="color:#6366f1;word-break:break-all;">${resetUrl}</a></p>
        `)
    });
};

// ─── 5. New Coupon / Promo ───────────────────────────────────────────────────
const sendPromoEmail = async ({ name, email, couponCode, discount, expiryDate }) => {
    return resend.emails.send({
        from: `${BRAND} <${FROM}>`,
        to: email,
        subject: `🎁 Exclusive ${discount}% Off Just for You — WAVWAY`,
        html: base(`
          <h1>You've Got an Exclusive Deal! 🎁</h1>
          <p>Hi <strong>${name}</strong>, here's a special offer just for you as a valued WAVWAY member.</p>

          <div style="text-align:center;margin:32px 0;padding:32px;background:#0a0a0a;border-radius:12px;">
            <p style="color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">Your Exclusive Coupon</p>
            <div style="font-size:36px;font-weight:800;letter-spacing:6px;color:#fff;font-family:monospace;margin-bottom:12px;">${couponCode}</div>
            <div style="display:inline-block;background:rgba(255,255,255,0.1);padding:6px 18px;border-radius:100px;color:rgba(255,255,255,0.8);font-size:14px;font-weight:600;">${discount}% OFF your entire order</div>
            ${expiryDate ? `<p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:12px;margin-bottom:0;">Valid until ${new Date(expiryDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>` : ''}
          </div>

          <a href="${BRAND_URL}" class="btn">Shop Now & Save →</a>

          <div class="divider"></div>
          <p style="font-size:12px;color:#71717a;">Apply code <strong>${couponCode}</strong> at checkout. One use per customer. Cannot be combined with other offers.</p>
        `)
    });
};

module.exports = {
    sendWelcomeEmail,
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendPasswordResetEmail,
    sendPromoEmail,
};
