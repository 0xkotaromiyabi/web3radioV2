
interface WebhookEvent {
  type: 'wallet_connected' | 'radio_played';
  timestamp: string;
  data: {
    walletAddress?: string;
    station?: string;
    userAgent?: string;
    sessionId?: string;
  };
}

export class WebhookEventDispatcher {
  private webhookUrl: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    // Try to get webhook URL from localStorage
    this.webhookUrl = localStorage.getItem('thirdweb_webhook_url');
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  setWebhookUrl(url: string) {
    this.webhookUrl = url;
    localStorage.setItem('thirdweb_webhook_url', url);
  }

  getWebhookUrl(): string | null {
    return this.webhookUrl;
  }

  private async sendWebhook(event: WebhookEvent) {
    if (!this.webhookUrl) {
      console.log('No webhook URL configured, skipping event:', event);
      return;
    }

    try {
      console.log('Sending webhook event:', event);
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
          source: 'web3-radio-app'
        }),
      });

      console.log('Webhook sent successfully');
    } catch (error) {
      console.error('Failed to send webhook:', error);
    }
  }

  async triggerWalletConnected(walletAddress: string) {
    const event: WebhookEvent = {
      type: 'wallet_connected',
      timestamp: new Date().toISOString(),
      data: {
        walletAddress,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      }
    };

    await this.sendWebhook(event);
  }

  async triggerRadioPlayed(station: string, walletAddress?: string) {
    const event: WebhookEvent = {
      type: 'radio_played',
      timestamp: new Date().toISOString(),
      data: {
        station,
        walletAddress,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      }
    };

    await this.sendWebhook(event);
  }
}

// Create a singleton instance
export const webhookDispatcher = new WebhookEventDispatcher();
