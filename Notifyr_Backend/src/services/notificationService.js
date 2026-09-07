import admin from '../config/fcm.js';
import * as userModel from '../models/userModel.js';

// Called after a message is safely written to the DB. Failure here must NEVER
// fail the finder's request — the message already exists regardless of push delivery.
export async function notifyOwnerOfMessage(ownerId, item, message) {
  const owner = await userModel.findById(ownerId);
  if (!owner?.fcm_token) return; // no device registered, nothing to do

  try {
    await admin.messaging().send({
      token: owner.fcm_token,
      notification: {
        title: `New message about "${item.nickname}"`,
        body: message.free_text || message.preset_type,
      },
      data: {
        item_id: item.id,
        message_id: message.id,
      },
    });
  } catch (err) {
    if (err.code === 'messaging/registration-token-not-registered') {
      // Token is stale (app uninstalled / rotated) — clear it so we don't retry forever.
      await userModel.clearFcmToken(ownerId);
    } else {
      console.error('FCM send failed:', err.message);
    }
  }
}
