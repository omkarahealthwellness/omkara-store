// ============================================================
// OMKARA WhatsApp Bot — OpenWA API Client
// ============================================================
// Lightweight HTTP client that talks to the OpenWA REST API.
// Uses Node's built-in fetch (Node 22+) — zero dependencies.
// ============================================================

interface SendTextPayload {
  chatId: string;
  text: string;
}

interface OpenWAResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export class OpenWAClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private sessionId: string;

  constructor(baseUrl: string, apiKey: string, sessionId: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // strip trailing slash
    this.apiKey = apiKey;
    this.sessionId = sessionId;
  }

  /**
   * Update the session ID (e.g., after creating one via the dashboard).
   */
  setSessionId(id: string): void {
    this.sessionId = id;
  }

  /**
   * Send a text message to a WhatsApp chat.
   * chatId format: "918560078208@c.us" (country code + number + @c.us)
   */
  async sendText(chatId: string, text: string): Promise<OpenWAResponse> {
    return this.post(`/sessions/${this.sessionId}/messages/send-text`, {
      chatId,
      text,
    } satisfies SendTextPayload);
  }

  /**
   * Create a webhook subscription for this session.
   */
  async createWebhook(
    url: string,
    events: string[],
    secret: string,
  ): Promise<OpenWAResponse> {
    return this.post(`/sessions/${this.sessionId}/webhooks`, {
      url,
      events,
      secret,
    });
  }

  /**
   * Create an automation rule for this session (built-in auto-replies).
   */
  async createAutomationRule(
    name: string,
    replyText: string,
    conditions?: Record<string, unknown>,
    cooldownSeconds: number = 60,
  ): Promise<OpenWAResponse> {
    return this.post(`/sessions/${this.sessionId}/automation-rules`, {
      name,
      replyText,
      conditions: conditions ?? null,
      cooldownSeconds,
      enabled: true,
    });
  }

  /**
   * List all sessions.
   */
  async listSessions(): Promise<OpenWAResponse> {
    return this.get('/sessions');
  }

  /**
   * Get session status.
   */
  async getSessionStatus(): Promise<OpenWAResponse> {
    return this.get(`/sessions/${this.sessionId}`);
  }

  // ----- HTTP helpers -----

  private async post(
    path: string,
    body: Record<string, unknown>,
  ): Promise<OpenWAResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error(
          `[OpenWA] POST ${path} → ${response.status}`,
          data ?? response.statusText,
        );
        return {
          success: false,
          error: `HTTP ${response.status}: ${data?.message ?? response.statusText}`,
        };
      }

      return { success: true, data };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[OpenWA] POST ${path} failed:`, msg);
      return { success: false, error: msg };
    }
  }

  private async get(path: string): Promise<OpenWAResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api${path}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${data?.message ?? response.statusText}`,
        };
      }

      return { success: true, data };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[OpenWA] GET ${path} failed:`, msg);
      return { success: false, error: msg };
    }
  }
}
