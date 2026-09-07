// src/services/blockService.js
import { request } from './apiClient';

export function blockDevice(deviceHash, itemId, token) {
  return request('/api/blocks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      device_hash: deviceHash,
      item_id: itemId,
    },
  });
}

export function listBlocks(token) {
  return request('/api/blocks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function unblockDevice(blockId, token) {
  return request(`/api/blocks/${blockId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}