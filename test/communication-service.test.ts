import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CommunicationService } from "../lib/communication/communicationService";

describe("School Communication & Automated Messaging Engine", () => {
  const schoolId = "school-sop-001";

  it("should render template variables accurately", () => {
    const template = "Dear {parent_name}, your balance for {student_name} is KSh {amount}.";
    const rendered = CommunicationService.renderTemplate(template, {
      parent_name: "David Kimani",
      student_name: "Kevin Kimani",
      amount: "25,000",
    });

    assert.equal(rendered, "Dear David Kimani, your balance for Kevin Kimani is KSh 25,000.");
  });

  it("should publish school announcements and list them scoped to tenant", async () => {
    const ann = await CommunicationService.createAnnouncement({
      schoolId,
      title: "Science Fair 2026",
      channel: "SMS & EMAIL",
      targetRole: "ALL",
      content: "Annual STEM exhibition holding in Science Quad.",
      status: "PUBLISHED",
      author: "Head of Sciences",
    });

    assert.ok(ann.id.startsWith("ann-"));
    assert.equal(ann.title, "Science Fair 2026");

    const list = await CommunicationService.getAnnouncements(schoolId);
    assert.ok(list.some((a) => a.id === ann.id));
  });

  it("should dispatch a direct notification and record delivery log", async () => {
    const phone = `+254700${Math.floor(100000 + Math.random() * 900000)}`;
    const log = await CommunicationService.sendMessage({
      schoolId,
      recipientName: "Test Guardian",
      studentName: "Test Student",
      recipientPhone: phone,
      channel: "SMS",
      subject: "Test Subject",
      body: `Unique Notification Body ${Date.now()}`,
      sender: "Principal's Desk",
    });

    assert.ok(log.id.startsWith("log-"));
    assert.equal(log.status, "DELIVERED");
    assert.ok(log.providerReference?.startsWith("AT-SMS-"));
  });

  it("should prevent duplicate messages to the same recipient within the window", async () => {
    const phone = `+254711${Math.floor(100000 + Math.random() * 900000)}`;
    const body = `Repeated notification text ${Date.now()}`;

    // First send succeeds
    await CommunicationService.sendMessage({
      schoolId,
      recipientName: "Test Guardian",
      recipientPhone: phone,
      channel: "SMS",
      body,
      sender: "Test Sender",
    });

    // Immediate second send of exact same text to exact same phone must fail
    await assert.rejects(
      async () => {
        await CommunicationService.sendMessage({
          schoolId,
          recipientName: "Test Guardian",
          recipientPhone: phone,
          channel: "SMS",
          body,
          sender: "Test Sender",
        });
      },
      /DUPLICATE_MESSAGE_DETECTED/
    );
  });
});
