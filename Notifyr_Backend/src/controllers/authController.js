import * as authService from "../services/authService.js";

export async function signup(req, res, next) {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    await authService.verifyEmail(req.params.token);
    res.status(200).json({ verified: true });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateFcmToken(req, res, next) {
  try {
    await authService.updateFcmToken(req.ownerId, req.body.fcm_token);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const profile = await authService.getProfile(req.ownerId);
    res.status(200).json({ user: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    await authService.updateProfile(req.ownerId, req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({ reset: true });
  } catch (err) {
    next(err);
  }
}

export async function updateGlobalDnd(req, res, next) {
  try {
    await authService.updateGlobalDnd(req.ownerId, req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function deleteMe(req, res, next) {
  try {
    await authService.deleteAccount(req.ownerId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function exportMe(req, res, next) {
  try {
    const data = await authService.exportData(req.ownerId);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    await authService.changePassword(
      req.ownerId,
      req.body.currentPassword,
      req.body.newPassword,
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
