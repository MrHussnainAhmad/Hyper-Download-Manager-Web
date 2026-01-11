import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendLicenseEmail(to: string, key: string, plan: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[MOCK EMAIL] To: ${to}, Plan: ${plan}`);
    console.log('[SECURITY] Key generated securely. Configure EMAIL_USER and EMAIL_PASS to send real emails.');
    return;
  }

  const subject = `Your Hyper Download Manager ${plan} License`;
  const text = `Thank you for your purchase!\n\nHere is your license key for the ${plan} plan:\n\n${key}\n\nKeep this key safe. You can use it to activate your product.`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>Thank you for your purchase!</h1>
      <p>Here is your license key for the <strong>${plan}</strong> plan:</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 24px; letter-spacing: 2px;">
        ${key}
      </div>
      <p>Keep this key safe. You can use it to activate your product.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Hyper Download Manager" <noreply@example.com>',
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function sendExpirationWarning(to: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[MOCK EMAIL] Warning sent to: ${to}`);
    return;
  }

  const subject = `Your Hyper Download Manager License is Expiring Soon!`;
  const text = `Hi there,\n\nYour Plus license for Hyper Download Manager is set to expire in less than a week.\n\nWe hope you've enjoyed the experience! To keep downloading without limits, please visit our website and renew your plan.\n\nWith love,\nThe Hyper Download Manager Team`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2 style="color: #eab308;">Action Required: License Expiring</h2>
      <p>Hi there,</p>
      <p>Your <strong>Plus</strong> license for Hyper Download Manager is set to expire in less than a week.</p>
      <p>We hope you've enjoyed the experience! To keep downloading without limits, please visit our website to renew your plan.</p>
      <p>Don't forget to purchase again!</p>
      <br>
      <p>With love,</p>
      <p><strong>The Hyper Download Manager Team</strong></p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Hyper Download Manager" <noreply@example.com>',
      to,
      subject,
      text,
      html,
    });
    console.log(`Expiration warning sent to ${to}`);
  } catch (error) {
    console.error('Failed to send warning email:', error);
  }
}
