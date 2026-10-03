// Mess Mosharraf – Google sync backend. Stores the ledger as mess-ledger.json in your Google Drive.
const FILE = "mess-ledger.json";

function getFile_() {
  const it = DriveApp.getFilesByName(FILE);
  return it.hasNext() ? it.next() : null;
}
function read_() {
  const f = getFile_();
  if (!f) return {};
  try { return JSON.parse(f.getBlob().getDataAsString()); } catch (e) { return {}; }
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() { return out_(read_()); }
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents);
    const cur = read_();
    if (!cur.t || (b.t || 0) >= cur.t) {
      const f = getFile_();
      if (f) f.setContent(JSON.stringify(b)); else DriveApp.createFile(FILE, JSON.stringify(b), MimeType.PLAIN_TEXT);
    }
    return out_({ ok: true });
  } finally { lock.releaseLock(); }
}
