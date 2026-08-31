// ============================================================
// OMKARA WhatsApp Bot — Main Server
// ============================================================
// HTTP server that receives webhooks from OpenWA and routes
// messages to the handler. Uses Node's built-in http module.
//
// Start: npm run dev
// ============================================================

import * as http from 'node:http';
import * as crypto from 'node:crypto';
import { config } from 'dotenv';
import { OpenWAClient } from './openwa-client.js';
import { handleInboundMessage, type HandlerConfig } from './message-handler.js';

// Load .env
config();

// Configuration
const PORT = parseInt(process.env.BOT_PORT ?? '3001', 10);
const OPENWA_URL = process.env.OPENWA_URL ?? 'http://localhost:2785';
const OPENWA_API_KEY = process.env.OPENWA_API_KEY ?? '';
const OPENWA_SESSION_ID = process.env.OPENWA_SESSION_ID ?? '';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? '';
const ADMIN_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER ?? '';
const STOREFRONT_URL = process.env.STOREFRONT_URL ?? 'https://omkara.store';

// Validate required config
if (!OPENWA_API_KEY) {
  console.error('❌ OPENWA_API_KEY is required in .env');
  process.exit(1);
}

// Initialize OpenWA client
const openwa = new OpenWAClient(OPENWA_URL, OPENWA_API_KEY, OPENWA_SESSION_ID);

const handlerConfig: HandlerConfig = {
  storefrontUrl: STOREFRONT_URL,
  adminNumber: ADMIN_NUMBER,
};

// ----- HTTP Server -----

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', bot: 'omkara-whatsapp-bot' }));
    return;
  }

  // Webhook receiver
  if (req.method === 'POST' && req.url === '/webhook') {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body);

      // HMAC signature verification (if secret is configured)
      if (WEBHOOK_SECRET) {
        const signature = req.headers['x-webhook-signature'] as string | undefined;
        if (signature) {
          const expected = crypto
            .createHmac('sha256', WEBHOOK_SECRET)
            .update(body)
            .digest('hex');
          if (signature !== expected) {
            console.warn('[Server] ⚠️ Invalid webhook signature, rejecting');
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid signature' }));
            return;
          }
        }
      }

      // Respond immediately to OpenWA (don't block the webhook)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true }));

      // Process the message asynchronously
      await processWebhookPayload(payload);
    } catch (error) {
      console.error('[Server] Webhook error:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bad request' }));
    }
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

/**
 * Process a webhook payload from OpenWA.
 * The payload shape depends on the event type.
 */
async function processWebhookPayload(payload: Record<string, unknown>): Promise<void> {
  const event = payload.event as string | undefined;

  // We only care about message.received events
  if (event !== 'message.received') {
    console.log(`[Server] Ignoring event: ${event}`);
    return;
  }

  const data = payload.data as Record<string, unknown> | undefined;
  if (!data) {
    console.warn('[Server] message.received event has no data');
    return;
  }

  // Extract message fields
  const message = {
    chatId: (data.chatId ?? data.from ?? '') as string,
    body: (data.body ?? '') as string,
    fromMe: (data.fromMe ?? false) as boolean,
    sender: (data.sender ?? data.from ?? '') as string,
    timestamp: (data.timestamp ?? undefined) as number | undefined,
    type: (data.type ?? 'chat') as string,
  };

  if (!message.chatId || !message.body) {
    console.log('[Server] Skipping message with no chatId or body');
    return;
  }

  // Hand off to the message handler
  await handleInboundMessage(openwa, message, handlerConfig);
}

/**
 * Read the full request body as a string.
 */
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// ----- Start -----

server.listen(PORT, () => {
  console.log('');
  console.log('  🌿 OMKARA WhatsApp Bot');
  console.log('  ══════════════════════════════════════');
  console.log(`  🤖 Bot server:    http://localhost:${PORT}`);
  console.log(`  🔗 OpenWA:        ${OPENWA_URL}`);
  console.log(`  📱 Session:       ${OPENWA_SESSION_ID || '(not set — set OPENWA_SESSION_ID in .env)'}`);
  console.log(`  🔔 Admin alerts:  ${ADMIN_NUMBER || '(disabled — set ADMIN_WHATSAPP_NUMBER in .env)'}`);
  console.log(`  🏪 Storefront:    ${STOREFRONT_URL}`);
  console.log('  ══════════════════════════════════════');
  console.log('');
  console.log('  Webhook endpoint: POST http://localhost:' + PORT + '/webhook');
  console.log('  Health check:     GET  http://localhost:' + PORT + '/health');
  console.log('');

  if (!OPENWA_SESSION_ID) {
    console.log('  ⚠️  OPENWA_SESSION_ID is not set!');
    console.log('  1. Open OpenWA dashboard: http://localhost:2785');
    console.log('  2. Create a session and scan QR code');
    console.log('  3. Copy the session ID to bot/.env');
    console.log('  4. Restart the bot');
    console.log('');
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Bot] Shutting down...');
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Bot] Shutting down...');
  server.close();
  process.exit(0);
});
