/** @OnlyCurrentDoc */

const PRAYER_MENTOR_NOTIFICATION_RECIPIENTS = [
  "keith@davidstemple.org",
];
const PRAYER_MENTOR_SPREADSHEET_ID = "1YwRrfJheo5kSzY-MoXraN1HsSdlFQNs5Rsf6miXsJBc";
const PRAYER_MENTOR_FIRST_DATA_ROW = 6;
const PRAYER_MENTOR_LAST_MENTOR_ROW = 205;
const PRAYER_MENTOR_LAST_MENTEE_ROW = 305;

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty("PRAYER_MENTOR_WEBHOOK_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, message: "Unauthorized" });
    }

    lock.waitLock(10000);
    const submissionId = safeText(payload.submissionId || "not-supplied");
    const submissionKey = `prayer_mentor_submission_${submissionId}`;
    const priorState = properties.getProperty(submissionKey);

    if (priorState === "complete") {
      return jsonResponse({ ok: true });
    }

    const spreadsheet = SpreadsheetApp.openById(PRAYER_MENTOR_SPREADSHEET_ID);
    const isMentor = payload.role === "mentor";
    const sheetName = isMentor ? "Mentors" : "Mentees";
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) throw new Error(`${sheetName} sheet was not found.`);

    if (!priorState) {
      const row = findFirstEmptyRow(
        sheet,
        PRAYER_MENTOR_FIRST_DATA_ROW,
        isMentor ? PRAYER_MENTOR_LAST_MENTOR_ROW : PRAYER_MENTOR_LAST_MENTEE_ROW,
      );
      const submittedAt = payload.submittedAt ? new Date(payload.submittedAt) : new Date();
      const values = isMentor
        ? mentorValues(payload, submissionId, submittedAt)
        : menteeValues(payload, submissionId, submittedAt);

      sheet.getRange(row, 1, 1, values.length).setValues([values]);
      sheet.getRange(row, 2).setNumberFormat("MM/dd/yyyy hh:mm");
      properties.setProperty(submissionKey, "saved");
    }

    const fullName = `${payload.firstName || ""} ${payload.lastName || ""}`.trim();
    const body = isMentor
      ? mentorEmailBody(payload, fullName, spreadsheet.getUrl())
      : menteeEmailBody(payload, fullName, spreadsheet.getUrl());

    MailApp.sendEmail({
      to: PRAYER_MENTOR_NOTIFICATION_RECIPIENTS.join(","),
      subject: isMentor
        ? `New prayer mentor signup: ${fullName}`
        : `New prayer mentee enrollment: ${fullName}`,
      body,
      name: "David's Temple Prayer Mentors",
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

function mentorValues(payload, submissionId, submittedAt) {
  return [
    `MENTOR-${payload.programYear}-${submissionId.slice(0, 8).toUpperCase()}`,
    submittedAt,
    Number(payload.programYear),
    "New",
    safeCell(payload.firstName),
    safeCell(payload.lastName),
    "",
    safeCell(payload.mobile),
    safeCell(payload.email),
    safeCell(payload.preferredContact),
    safeCell(payload.churchRelationship),
    "",
    "",
    "",
    Number(payload.maxMentees),
    "Not started",
  ];
}

function menteeValues(payload, submissionId, submittedAt) {
  return [
    `MENTEE-${payload.programYear}-${submissionId.slice(0, 8).toUpperCase()}`,
    submittedAt,
    Number(payload.programYear),
    "New",
    safeCell(payload.firstName),
    safeCell(payload.lastName),
    "",
    Number(payload.age),
    safeCell(payload.grade),
    safeCell(payload.guardianName),
    safeCell(payload.guardianMobile),
    safeCell(payload.guardianEmail),
    safeCell(payload.menteeMobile),
    safeCell(payload.menteeEmail),
    "",
    "",
    "",
  ];
}

function findFirstEmptyRow(sheet, firstRow, lastRow) {
  const ids = sheet.getRange(firstRow, 1, lastRow - firstRow + 1, 1).getDisplayValues();
  const emptyIndex = ids.findIndex((row) => !row[0]);
  if (emptyIndex === -1) throw new Error(`${sheet.getName()} signup capacity is full.`);
  return firstRow + emptyIndex;
}

function mentorEmailBody(payload, fullName, spreadsheetUrl) {
  return [
    "An adult submitted the David's Temple Prayer Mentor signup form.",
    "",
    `Name: ${fullName}`,
    `Mobile: ${payload.mobile}`,
    `Email: ${payload.email || "Not provided"}`,
    `Preferred contact: ${payload.preferredContact}`,
    `Church relationship: ${payload.churchRelationship}`,
    `Requested capacity: ${payload.maxMentees}`,
    "",
    "Next step: review eligibility, screening, background-check, and training requirements before matching.",
    "",
    `Spreadsheet: ${spreadsheetUrl}`,
  ].join("\n");
}

function menteeEmailBody(payload, fullName, spreadsheetUrl) {
  return [
    "A parent or guardian submitted the David's Temple Prayer Mentee enrollment form.",
    "",
    `Mentee: ${fullName}`,
    `Age / grade: ${payload.age} / ${payload.grade}`,
    `Parent or guardian: ${payload.guardianName}`,
    `Parent mobile: ${payload.guardianMobile}`,
    `Parent email: ${payload.guardianEmail}`,
    "",
    "Next step: review consent and matching needs before pairing the teen with an approved mentor of the same sex.",
    "",
    `Spreadsheet: ${spreadsheetUrl}`,
  ].join("\n");
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
