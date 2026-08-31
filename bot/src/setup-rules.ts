// ============================================================
// OMKARA — OpenWA Automation Rules Setup Script
// ============================================================
// Run this AFTER OpenWA is running and a session is authenticated.
// It creates built-in auto-reply rules using OpenWA's automation API.
//
// Usage: npm run setup-rules
// ============================================================

import { config } from 'dotenv';
import { OpenWAClient } from './openwa-client.js';

config();

const OPENWA_URL = process.env.OPENWA_URL ?? 'http://localhost:2785';
const OPENWA_API_KEY = process.env.OPENWA_API_KEY ?? '';
const OPENWA_SESSION_ID = process.env.OPENWA_SESSION_ID ?? '';
const STOREFRONT_URL = process.env.STOREFRONT_URL ?? 'https://omkara.store';

if (!OPENWA_API_KEY || !OPENWA_SESSION_ID) {
  console.error('❌ Set OPENWA_API_KEY and OPENWA_SESSION_ID in bot/.env first');
  process.exit(1);
}

const client = new OpenWAClient(OPENWA_URL, OPENWA_API_KEY, OPENWA_SESSION_ID);

interface RuleConfig {
  name: string;
  replyText: string;
  conditions: Record<string, unknown>;
  cooldownSeconds: number;
}

const RULES: RuleConfig[] = [
  {
    name: 'omkara-greeting',
    replyText: [
      'Namaste! 🌿',
      '',
      'OMKARA mein aapka swagat hai!',
      'Sehat Bhi. Swaad Bhi.',
      '',
      '🛒 "menu" type karein humara menu dekhne ke liye.',
      '📍 "address" type karein location ke liye.',
      '',
      'Kaise madad kar sakte hain? 😊',
    ].join('\n'),
    conditions: {
      conditions: [
        {
          field: 'body',
          operator: 'contains',
          value: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hii', 'hiii'],
        },
      ],
    },
    cooldownSeconds: 300, // 5 min per chat
  },
  {
    name: 'omkara-menu',
    replyText: [
      '🌿 OMKARA — Fresh Menu 🌿',
      '',
      'Humara poora menu yahan dekhein:',
      `👉 ${STOREFRONT_URL}`,
      '',
      'Ya seedha order karein — jo chahiye wo batayein!',
      '',
      '✅ Fresh ingredients',
      '✅ No preservatives',
      '✅ Made in Bikaner',
      '',
      '— OMKARA 🌿',
    ].join('\n'),
    conditions: {
      conditions: [
        {
          field: 'body',
          operator: 'contains',
          value: ['menu', 'catalog', 'catalogue', 'product', 'products', 'list'],
        },
      ],
    },
    cooldownSeconds: 60,
  },
  {
    name: 'omkara-store-info',
    replyText: [
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
    conditions: {
      conditions: [
        {
          field: 'body',
          operator: 'contains',
          value: ['address', 'location', 'timing', 'time', 'hours', 'pata', 'kahan'],
        },
      ],
    },
    cooldownSeconds: 120,
  },
  {
    name: 'omkara-order-received',
    replyText: [
      'Dhanyavaad! 🙏🌿',
      '',
      'Aapka order mil gaya hai.',
      'Hum jaldi confirm karenge — thoda sa intezaar karein.',
      '',
      '— Team OMKARA',
      'Sehat Bhi. Swaad Bhi.',
    ].join('\n'),
    conditions: {
      conditions: [
        {
          field: 'body',
          operator: 'contains',
          value: ['place an order', 'TOTAL:', 'confirm availability'],
        },
      ],
    },
    cooldownSeconds: 30,
  },
];

async function main() {
  console.log('');
  console.log('🌿 OMKARA — Setting up WhatsApp Automation Rules');
  console.log('═══════════════════════════════════════════════');
  console.log(`   OpenWA: ${OPENWA_URL}`);
  console.log(`   Session: ${OPENWA_SESSION_ID}`);
  console.log('');

  // Verify session exists
  const sessionResult = await client.getSessionStatus();
  if (!sessionResult.success) {
    console.error('❌ Cannot reach OpenWA or session not found.');
    console.error('   Make sure OpenWA is running and the session ID is correct.');
    console.error('   Error:', sessionResult.error);
    process.exit(1);
  }
  console.log('✅ Session found');

  // Create rules
  for (const rule of RULES) {
    console.log(`   Creating rule: ${rule.name}...`);
    const result = await client.createAutomationRule(
      rule.name,
      rule.replyText,
      rule.conditions,
      rule.cooldownSeconds,
    );

    if (result.success) {
      console.log(`   ✅ ${rule.name} created`);
    } else {
      console.error(`   ❌ ${rule.name} failed:`, result.error);
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('✅ Done! Automation rules are now active.');
  console.log('');
  console.log('Test by sending these messages to your bot number:');
  console.log('   • "hi" or "namaste" → Greeting reply');
  console.log('   • "menu" → Menu with link');
  console.log('   • "address" → Store info');
  console.log('   • An order from the storefront → Order acknowledgement');
  console.log('');
}

main().catch(console.error);
