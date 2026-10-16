/**
 * Messaging & Communication Abstraction Layer
 * Decouples notification delivery from specific telco / messaging vendors
 * (supports Africa's Talking SMS, WhatsApp Cloud API, Resend/SendGrid Email).
 */

export type NotificationChannel = "SMS" | "WHATSAPP" | "EMAIL";

export interface NotificationRecipient {
  userId?: string;
  studentId?: string;
  name: string;
  phone?: string;
  email?: string;
  preferredChannel?: NotificationChannel;
}

export interface NotificationMessage {
  recipient: NotificationRecipient;
  channel: NotificationChannel;
  title?: string;
  body: string;
  templateId?: string;
  templateVariables?: Record<string, string | number>;
  metadata?: Record<string, any>;
}

export interface NotificationDeliveryResult {
  messageId: string;
  channel: NotificationChannel;
  recipientAddress: string;
  status: "SENT" | "DELIVERED" | "FAILED" | "QUEUED";
  providerReference?: string;
  error?: string;
  timestamp: string;
}

export interface NotificationProvider {
  name: string;
  channel: NotificationChannel;
  send(message: NotificationMessage): Promise<NotificationDeliveryResult>;
  sendBatch(messages: NotificationMessage[]): Promise<NotificationDeliveryResult[]>;
}

/**
 * Mock & Console notification provider for local development, tests, and preview
 */
export class MockNotificationProvider implements NotificationProvider {
  name = "Mock Local Dispatcher";
  channel: NotificationChannel;

  constructor(channel: NotificationChannel) {
    this.channel = channel;
  }

  async send(message: NotificationMessage): Promise<NotificationDeliveryResult> {
    const address = message.channel === "EMAIL" ? message.recipient.email : message.recipient.phone;
    const ref = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    return {
      messageId: ref,
      channel: message.channel,
      recipientAddress: address || "unknown",
      status: "SENT",
      providerReference: `MOCK-${ref.toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };
  }

  async sendBatch(messages: NotificationMessage[]): Promise<NotificationDeliveryResult[]> {
    return Promise.all(messages.map((m) => this.send(m)));
  }
}

/**
 * Central Notification Service
 */
export class NotificationService {
  private static providers: Map<NotificationChannel, NotificationProvider> = new Map([
    ["SMS", new MockNotificationProvider("SMS")],
    ["WHATSAPP", new MockNotificationProvider("WHATSAPP")],
    ["EMAIL", new MockNotificationProvider("EMAIL")],
  ]);

  static registerProvider(channel: NotificationChannel, provider: NotificationProvider) {
    this.providers.set(channel, provider);
  }

  static async dispatch(message: NotificationMessage): Promise<NotificationDeliveryResult> {
    const provider = this.providers.get(message.channel);
    if (!provider) {
      throw new Error(`No notification provider registered for channel: ${message.channel}`);
    }
    return provider.send(message);
  }

  static async dispatchBulk(messages: NotificationMessage[]): Promise<NotificationDeliveryResult[]> {
    return Promise.all(messages.map((m) => this.dispatch(m)));
  }
}
