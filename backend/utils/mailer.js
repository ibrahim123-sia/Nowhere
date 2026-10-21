const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM = () => `"Nowhere" <${process.env.EMAIL_USER}>`;

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const formatPkr = (amount) => `Rs. ${Math.round(Number(amount) || 0).toLocaleString("en-US")}`;

const layout = (title, body) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
    <p style="font-size: 22px; font-weight: bold; letter-spacing: 1px; margin: 0 0 24px;">NOWHERE</p>
    <h2 style="font-size: 18px; margin: 0 0 16px;">${title}</h2>
    ${body}
    <p style="font-size: 12px; color: #777; margin-top: 32px;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>`;

const codeBlock = (code) => `
  <div style="background: #f5f5f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
    <span style="font-size: 30px; letter-spacing: 8px; font-weight: bold;">${code}</span>
  </div>`;

function sendOtpEmail({ to, name, otp, purpose = "verify" }) {
  const isReset = purpose === "reset";
  return transporter.sendMail({
    from: FROM(),
    to,
    subject: isReset ? "Your Nowhere password reset code" : "Verify your Nowhere account",
    html: layout(
      isReset ? "Password reset" : "Welcome to Nowhere",
      `<p>Hello ${escapeHtml(name)},</p>
       <p>${isReset ? "Use this code to reset your password:" : "Use this code to verify your email:"}</p>
       ${codeBlock(otp)}
       <p>This code expires in 5 minutes.</p>`
    ),
  });
}

function sendOrderConfirmation(order) {
  if (!order.email || !process.env.EMAIL_USER) return Promise.resolve();
  const rows = order.orderItems
    .map(
      (i) => `<tr>
        <td style="padding: 8px 0;">${escapeHtml(i.name)}<br/><span style="color:#777;font-size:12px;">${escapeHtml(i.size)} / ${escapeHtml(i.color)} × ${i.quantity}</span></td>
        <td style="padding: 8px 0; text-align: right;">${formatPkr(i.price * i.quantity)}</td>
      </tr>`
    )
    .join("");

  return transporter.sendMail({
    from: FROM(),
    to: order.email,
    subject: `Order ${order.orderNumber} confirmed`,
    html: layout(
      `Thanks for your order, ${escapeHtml(order.shippingAddress.fullName || "there")}!`,
      `<p>Your order <strong>${order.orderNumber}</strong> has been placed and is being prepared.</p>
       <table style="width: 100%; border-collapse: collapse; font-size: 14px;">${rows}
         <tr><td style="padding-top: 12px; border-top: 1px solid #eee;">Shipping</td><td style="padding-top: 12px; border-top: 1px solid #eee; text-align: right;">${order.shippingPrice ? formatPkr(order.shippingPrice) : "Free"}</td></tr>
         ${order.discount ? `<tr><td>Discount</td><td style="text-align: right;">-${formatPkr(order.discount)}</td></tr>` : ""}
         <tr><td style="font-weight: bold;">Total (${escapeHtml(order.paymentMethod)})</td><td style="font-weight: bold; text-align: right;">${formatPkr(order.totalPrice)}</td></tr>
       </table>
       <p>You can track it any time with your order number and this email address.</p>`
    ),
  });
}

// Forwards a contact-form message to the store inbox; replies go to the customer.
function sendContactMessage({ name, email, subject, message }) {
  return transporter.sendMail({
    from: FROM(),
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `[Contact] ${subject || "New message"} - ${name}`,
    html: layout(
      "New contact form message",
      `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)})</p>
       <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>`
    ),
  });
}

module.exports = { transporter, sendOtpEmail, sendOrderConfirmation, sendContactMessage };
