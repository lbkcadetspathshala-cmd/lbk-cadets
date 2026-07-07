/* ===========================================================================
   LBK Cadets Pathshala — Eligibility Checker → Google Sheet Lead Logger
   HOW TO USE:
   1. Paste this entire file into Extensions > Apps Script (in your Google Sheet).
   2. Click Save (disk icon), name the project "LBK Eligibility Webhook".
   3. Click "Deploy" > "New deployment".
      - Click the gear icon next to "Select type" > choose "Web app".
      - Description: "Eligibility Checker Webhook"
      - Execute as: "Me"
      - Who has access: "Anyone"
      - Click "Deploy".
   4. Google will ask you to authorize permissions — click through and allow it
      (it will show an "unsafe" warning because it's your own unpublished script;
      click "Advanced" > "Go to [project name] (unsafe)" > "Allow"). This is safe
      because you wrote/own this script yourself.
   5. Copy the "Web app URL" shown (it ends in /exec). Send that URL back to Kiro
      (or paste it into GOOGLE_SHEET_WEBHOOK_URL in eligibility-checker-standalone.html).
   6. Every time someone submits the eligibility form, a new row will appear in
      this Sheet automatically.
   =========================================================================== */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads")
      || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row automatically if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Student Name", "DOB", "Mobile", "Class", "Gender", "Category", "Eligible Courses"]);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.dob || "",
      data.mobile || "",
      data.currentClass || "",
      data.gender || "",
      data.category || "",
      (data.eligibleCourses || []).join(", ")
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* Optional: lets you open the /exec URL directly in a browser to test it's alive */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "LBK Eligibility Webhook is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
