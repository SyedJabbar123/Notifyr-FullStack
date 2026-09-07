import * as blockService from "../services/blockService.js";

export async function create(req, res, next) {
  try {
    await blockService.blockDevice(req.ownerId, req.body);
    res.status(201).json({ blocked: true });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const blocks = await blockService.listBlocks(req.ownerId);
    res.status(200).json({ blocks });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await blockService.unblockDevice(req.params.id, req.ownerId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function blockByMessage(req, res, next) {
  try {
    await blockService.blockDeviceByMessage(req.ownerId, req.params.id);
    res.status(201).json({ blocked: true });
  } catch (err) {
    next(err);
  }
}
