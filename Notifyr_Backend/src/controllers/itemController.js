import * as itemService from "../services/itemService.js";

export async function list(req, res, next) {
  try {
    const items = await itemService.listOwnerItems(req.ownerId);
    res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const result = await itemService.createItem(req.ownerId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    await itemService.updateItem(req.params.id, req.ownerId, req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    await itemService.updateStatus(req.params.id, req.ownerId, req.body.status);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function bindQr(req, res, next) {
  try {
    await itemService.bindQr(req.params.id, req.ownerId, req.body.qr_id);
    res.status(200).json({ bound: true });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const item = await itemService.getOne(req.params.id, req.ownerId);
    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
}

export async function unbindQr(req, res, next) {
  try {
    await itemService.unbindQr(req.params.id, req.ownerId);
    res.status(200).json({ unbound: true });
  } catch (err) {
    next(err);
  }
}

export async function deleteOne(req, res, next) {
  try {
    await itemService.deleteItem(req.params.id, req.ownerId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
