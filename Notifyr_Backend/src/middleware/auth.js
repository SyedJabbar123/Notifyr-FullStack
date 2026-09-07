import { verifyOwnerToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import * as userModel from "../models/userModel.js";

// Attaches req.ownerId. Every /api/items/* and /api/blocks/* route needs this.
// Public /api/public/* routes must NEVER use this middleware.
export function requireOwnerAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(
      new AppError(
        "UNAUTHORIZED",
        "Missing or malformed Authorization header",
        401,
      ),
    );
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyOwnerToken(token);
    req.ownerId = payload.sub;
    next();
  } catch {
    next(new AppError("UNAUTHORIZED", "Invalid or expired token", 401));
  }
}

// Same JWT as owner auth (reusing the users table + is_admin flag), but additionally
// checks is_admin fresh from the DB each request — so revoking admin access takes
// effect immediately, rather than waiting for an old token to expire.
export async function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(
      new AppError(
        "UNAUTHORIZED",
        "Missing or malformed Authorization header",
        401,
      ),
    );
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyOwnerToken(token);
    const user = await userModel.findById(payload.sub);
    if (!user?.is_admin) {
      return next(new AppError("FORBIDDEN", "Admin access required", 403));
    }
    req.adminId = payload.sub;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError("UNAUTHORIZED", "Invalid or expired token", 401));
  }
}
