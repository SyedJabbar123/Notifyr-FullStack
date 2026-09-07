import QRCode from "qrcode";

// FINDER_PORTAL_DOMAIN should point at the deployed Finder Portal, e.g. https://notifyr.app
// Falls back to a placeholder so this doesn't crash in local dev before that's set.
const FINDER_PORTAL_DOMAIN =
  process.env.FINDER_PORTAL_DOMAIN || "https://notifyr.app";

function qrTargetUrl(qrId) {
  return `${FINDER_PORTAL_DOMAIN}/t/${qrId}`;
}

// Generates the PNG bytes for a single QR code, in-memory — nothing touches disk.
// Deterministic: same qrId always produces the same image, so there's nothing to cache/store.
export async function generateQrPng(qrId) {
  return QRCode.toBuffer(qrTargetUrl(qrId), {
    type: "png",
    width: 400,
    margin: 2,
  });
}

// Same image, but as a data: URL string — handy for embedding directly in a JSON
// response so the admin table can render thumbnails without a second request per row.
export async function generateQrDataUrl(qrId) {
  return QRCode.toDataURL(qrTargetUrl(qrId), { width: 200, margin: 2 });
}
