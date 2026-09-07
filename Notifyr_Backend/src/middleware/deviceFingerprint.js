import { getDeviceHash } from '../utils/deviceHash.js';

export function attachDeviceHash(req, res, next) {
  req.deviceHash = getDeviceHash(req);
  next();
}
