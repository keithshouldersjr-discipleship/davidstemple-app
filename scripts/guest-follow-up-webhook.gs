/** @OnlyCurrentDoc */

const GUEST_SHEET_NAME = "Guest Follow-Up";
const GUEST_NOTIFICATION_RECIPIENTS = [
  "keith@davidstemple.org",
  "donald.wicks@gmail.com",
];

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty("GUEST_WEBHOOK_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, message: "Unauthorized" });
    }

    lock.waitLock(10000);
    const submissionId = safeText(payload.submissionId || "not-supplied");
    const submissionKey = `guest_submission_${submissionId}`;
    const priorState = properties.getProperty(submissionKey);

    if (priorState === "complete") {
      return jsonResponse({ ok: true });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(GUEST_SHEET_NAME);

    if (!sheet) throw new Error("Guest Follow-Up sheet was not found.");

    const submittedAt = payload.submittedAt ? new Date(payload.submittedAt) : new Date();
    if (!priorState) {
      const values = [
        submittedAt,
        safeCell(payload.firstName),
        safeCell(payload.lastName),
        safeCell(payload.mobile),
        safeCell(payload.email),
        safeCell(payload.firstVisit),
        safeCell(payload.textOptIn),
        safeCell(payload.prayerRequest),
        safeCell(Array.isArray(payload.interests) ? payload.interests.join(", ") : ""),
        safeCell(payload.howHeard),
        "",
        "New",
        "",
        "",
        payload.textOptIn === "Yes" ? "Add to Text List" : "Send Thank-You Text",
        `Online guest form · Submission ${submissionId}`,
      ];

      const row = sheet.getLastRow() + 1;
      sheet.getRange(row, 1, 1, values.length).setValues([values]);
      sheet.getRange(row, 1).setNumberFormat("MM/dd/yyyy");
      properties.setProperty(submissionKey, "saved");
    }

    const fullName = `${payload.firstName || ""} ${payload.lastName || ""}`.trim();
    const body = [
      "A guest submitted the David's Temple connection form.",
      "",
      `Name: ${fullName}`,
      `Mobile: ${payload.mobile || "Not provided"}`,
      `Email: ${payload.email || "Not provided"}`,
      `First visit: ${payload.firstVisit || "Not provided"}`,
      `Text list opt-in: ${payload.textOptIn || "Not provided"}`,
      `Interested in: ${Array.isArray(payload.interests) && payload.interests.length ? payload.interests.join(", ") : "Not provided"}`,
      `How they heard about us: ${payload.howHeard || "Not provided"}`,
      "",
      "Prayer request:",
      payload.prayerRequest || "Not provided",
      "",
      `Spreadsheet: ${spreadsheet.getUrl()}`,
    ].join("\n");

    MailApp.sendEmail({
      to: GUEST_NOTIFICATION_RECIPIENTS.join(","),
      subject: `New David's Temple guest: ${fullName}`,
      body,
      name: "David's Temple Guest Connection",
    });
    properties.setProperty(submissionKey, "complete");

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, message: "Unable to process submission" });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function safeText(value) {
  return String(value == null ? "" : value).trim().slice(0, 2000);
}

function safeCell(value) {
  const text = safeText(value);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
