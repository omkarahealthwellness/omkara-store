// ============================================================
// OMKARA WhatsApp Bot — Hinglish Reply Templates
// ============================================================
// All auto-reply messages branded for OMKARA.
// Hinglish = Hindi + English, the way OMKARA customers talk.
// ============================================================

export const REPLIES = {
  /** Sent when we detect an order message (from wa.me checkout) */
  ORDER_RECEIVED: [
    'Dhanyavaad! 🙏🌿',
    '',
    'Aapka order mil gaya hai.',
    'Hum jaldi confirm karenge — thoda sa intezaar karein.',
    '',
    '📋 Aapka order check kar rahe hain...',
    '',
    '— Team OMKARA',
    'Sehat Bhi. Swaad Bhi.',
  ].join('\n'),

  /** Sent when someone says hi/hello/namaste or any unrecognized message */
  GREETING: [
    'Namaste! 🌿',
    '',
    'OMKARA mein aapka swagat hai!',
    'Sehat Bhi. Swaad Bhi.',
    '',
    '🛒 Order karne ke liye humara menu dekhein:',
    '👉 "menu" type karein',
    '',
    '📍 Location: Bikaner, Rajasthan',
    '📞 8560078208',
    '',
    'Kaise madad kar sakte hain? 😊',
  ].join('\n'),

  /** Sent when someone asks for menu/catalog */
  MENU_REPLY: [
    '🌿 OMKARA — Fresh Menu 🌿',
    '',
    'Humara poora menu yahan dekhein:',
    '👉 {{STOREFRONT_URL}}',
    '',
    'Ya seedha order karein — jo chahiye wo batayein!',
    '',
    '✅ Fresh ingredients',
    '✅ No preservatives',
    '✅ Made in Bikaner',
    '',
    '— OMKARA 🌿',
  ].join('\n'),

  /** Sent when someone asks about timings/hours/address */
  STORE_INFO: [
    '📍 OMKARA Health & Wellness',
    'Bikaner, Rajasthan',
    '',
    '🕐 Store Timing:',
    '   Mon-Sat: 9:00 AM - 8:00 PM',
    '   Sunday: 10:00 AM - 6:00 PM',
    '',
    '📞 Phone: 8560078208',
    '📧 Email: omkara.health.wellness@gmail.com',
    '📸 Instagram: @omkara.health.bkn',
    '',
    'Aap humse yahan bhi mil sakte hain! 🌿',
  ].join('\n'),

  /** Sent when someone asks for help */
  HELP: [
    '🆘 OMKARA Bot — Help',
    '',
    'Aap ye type kar sakte hain:',
    '',
    '📋 "menu" — Humara menu dekhein',
    '📍 "address" — Store location & timing',
    '🛒 "order" — Order kaise karein',
    '💬 Kuch bhi — Hum reply karenge!',
    '',
    'Ya seedha humari website se order karein:',
    '👉 {{STOREFRONT_URL}}',
  ].join('\n'),

  /** Forwarded to admin when an order is received */
  ADMIN_ORDER_ALERT: [
    '🔔 NEW ORDER ALERT!',
    '',
    '📱 From: {{CUSTOMER_NUMBER}}',
    '⏰ Time: {{TIMESTAMP}}',
    '',
    '📋 Order:',
    '{{ORDER_TEXT}}',
    '',
    'Reply to the customer directly on WhatsApp.',
  ].join('\n'),

  /** Sent when someone asks how to order */
  HOW_TO_ORDER: [
    '🛒 OMKARA mein order kaise karein:',
    '',
    '1️⃣ Humari website kholein:',
    '   👉 {{STOREFRONT_URL}}',
    '',
    '2️⃣ Jo chahiye wo select karein',
    '',
    '3️⃣ Cart mein add karein',
    '',
    '4️⃣ "WhatsApp pe Order karein" button dabayein',
    '',
    '5️⃣ Hum confirm karenge! ✅',
    '',
    'Simple hai! 😊🌿',
  ].join('\n'),
} as const;

/**
 * Replace template placeholders like {{STOREFRONT_URL}} with actual values.
 */
export function fillTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}
