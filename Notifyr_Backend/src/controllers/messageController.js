import * as messageModel from "../models/messageModel.js";
import { AppError } from "../utils/AppError.js";

export async function list(req, res, next) {
  try {
    const messages = await messageModel.listOwnedBy(req.ownerId);
    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
}

export async function listForItem(req, res, next) {
  try {
    const messages = await messageModel.listForItemOwnedBy(
      req.params.id,
      req.ownerId,
    );
    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req, res, next) {
  try {
    const ok = await messageModel.markReadOwnedBy(req.params.id, req.ownerId);
    if (!ok) return next(new AppError("NOT_FOUND", "Message not found", 404));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function deleteOne(req, res, next) {
  try {
    const ok = await messageModel.deleteOwnedBy(req.params.id, req.ownerId);
    if (!ok) return next(new AppError("NOT_FOUND", "Message not found", 404));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function deleteAll(req, res, next) {
  try {
    await messageModel.deleteAllOwnedBy(req.ownerId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}