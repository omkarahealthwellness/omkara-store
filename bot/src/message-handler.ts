// ============================================================
// OMKARA WhatsApp Bot — Message Handler
// ============================================================
// Routes incoming WhatsApp messages to the right auto-reply.
// Detects: orders, menu requests, greetings, help, store info.
// ============================================================

import { OpenWAClient } from './openwa-client.js';
import { REPLIES, fillTemplate } from './reply-templates.js';
import {
  isOrderMessage,
  parseOrderMessage,
  formatOrderSummary,
} from './order-parser.js';

/** Keyword sets for intent detection (case-insensitive matching). */
const INTENTS = {
  menu: ['menu', 'catalog', 'catalogue', 'product', 'products', 'kya hai', 'kya milega', 'list'],
  storeInfo: ['address', 'location', 'timing', 'time', 'hours', 'kahan', 'pata', 'jagah', 'samay'],
  help: ['help', 'madad', 'sahayata', 'bot', 'commands'],
  howToOrder: ['how to order', 'order kaise', 'kaise order', 'kaise khareedu', 'how to buy'],
  greeting: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hii', 'hiii', 'hlo', 'hlw'],
} as const;

/** Per-chat cooldown tracker to avoid spamming. */
const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 30_000; // 30 seconds between auto-replies per chat

export interface InboundMessage {
  /** The WhatsApp chat ID, e.g. "918560078208@c.us" */
  chatId: string;
  /** Message body text */
  body: string;
  /** Whether the message was sent by us */
  fromMe: boolean;
  /** Sender info */
  sender?: string;
  /** Unix timestamp */
  timestamp?: number;
  /** Message type (text, image, etc.) */
  type?: string;
}

export interface HandlerConfig {
  storefrontUrl: string;
  adminNumber: string; // empty = no admin alerts
}

/**
 * Handle an inbound WhatsApp message and send the appropriate auto-reply.
 */
export async function handleInboundMessage(
  client: OpenWAClient,
  message: InboundMessage,
  config: HandlerConfig,
): Promise<void> {
  // Never reply to our own messages
  if (message.fromMe) return;

  // Only handle text messages
  if (message.type && message.type !== 'chat') return;

  // Cooldown check — don't spam the same chat
  if (isInCooldown(message.chatId)) return;

  const text = (message.body ?? '').trim();
  if (!text) return;

  console.log(`[Bot] Message from ${message.chatId}: "${text.substring(0, 80)}..."`);

  const templateVars: Record<string, string> = {
    STOREFRONT_URL: config.storefrontUrl,
    CUSTOMER_NUMBER: message.chatId.replace('@c.us', ''),
    TIMESTAMP: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    ORDER_TEXT: text,
  };

  // 1. Check if it's an order from the storefront checkout
  if (isOrderMessage(text)) {
    console.log(`[Bot] 🛒 Order detected from ${message.chatId}`);
    await sendReply(client, message.chatId, REPLIES.ORDER_RECEIVED);
    enterCooldown(message.chatId);

    // Forward order to admin
    if (config.adminNumber) {
      const adminAlert = fillTemplate(REPLIES.ADMIN_ORDER_ALERT, templateVars);
      const adminChatId = `${config.adminNumber}@c.us`;
      await sendReply(client, adminChatId, adminAlert);
      console.log(`[Bot] 📩 Order forwarded to admin: ${config.adminNumber}`);
    }
    return;
  }

  // 2. Menu request
  if (matchesIntent(text, INTENTS.menu)) {
    const reply = fillTemplate(REPLIES.MENU_REPLY, templateVars);
    await sendReply(client, message.chatId, reply);
    enterCooldown(message.chatId);
    return;
  }

  // 3. How to order
  if (matchesIntent(text, INTENTS.howToOrder)) {
    const reply = fillTemplate(REPLIES.HOW_TO_ORDER, templateVars);
    await sendReply(client, message.chatId, reply);
    enterCooldown(message.chatId);
    return;
  }

  // 4. Store info / location / timing
  if (matchesIntent(text, INTENTS.storeInfo)) {
    await sendReply(client, message.chatId, REPLIES.STORE_INFO);
    enterCooldown(message.chatId);
    return;
  }

  // 5. Help
  if (matchesIntent(text, INTENTS.help)) {
    const reply = fillTemplate(REPLIES.HELP, templateVars);
    await sendReply(client, message.chatId, reply);
    enterCooldown(message.chatId);
    return;
  }

  // 6. Greeting (hi, hello, namaste)
  if (matchesIntent(text, INTENTS.greeting)) {
    await sendReply(client, message.chatId, REPLIES.GREETING);
    enterCooldown(message.chatId);
    return;
  }

  // 7. Default: for any unrecognized message, send greeting
  // Only if the message is short (< 100 chars) — long messages might be something specific
  if (text.length < 100) {
    await sendReply(client, message.chatId, REPLIES.GREETING);
    enterCooldown(message.chatId);
  }
  // Long unrecognized messages are ignored (could be forwarded content, etc.)
}

// ----- Helpers -----

/**
 * Check if any keyword from the intent list appears in the message text.
 * Uses word-boundary matching for short keywords, substring for phrases.
 */
function matchesIntent(
  text: string,
  keywords: readonly string[],
): boolean {
  const lower = text.toLowerCase();

  for (const keyword of keywords) {
    if (keyword.includes(' ')) {
      // Multi-word phrase: substring match
      if (lower.includes(keyword)) return true;
    } else {
      // Single word: check word boundaries to avoid false positives
      // e.g., "hi" should match "hi" and "hi!" but not "this"
      const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i');
      if (regex.test(text)) return true;
    }
  }
  return false;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function sendReply(
  client: OpenWAClient,
  chatId: string,
  text: string,
): Promise<void> {
  const result = await client.sendText(chatId, text);
  if (result.success) {
    console.log(`[Bot] ✅ Reply sent to ${chatId}`);
  } else {
    console.error(`[Bot] ❌ Failed to reply to ${chatId}:`, result.error);
  }
}

function isInCooldown(chatId: string): boolean {
  const until = cooldowns.get(chatId);
  if (!until) return false;
  if (Date.now() < until) {
    console.log(`[Bot] ⏳ Cooldown active for ${chatId}, skipping`);
    return true;
  }
  cooldowns.delete(chatId);
  return false;
}

function enterCooldown(chatId: string): void {
  cooldowns.set(chatId, Date.now() + COOLDOWN_MS);

  // Sweep old cooldowns periodically
  if (cooldowns.size > 1000) {
    const now = Date.now();
    for (const [key, until] of cooldowns) {
      if (until <= now) cooldowns.delete(key);
    }
  }
}
