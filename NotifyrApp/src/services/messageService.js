// src/services/messageService.js
import { request } from './apiClient';

export function listMessages(token) {
  return request('/api/messages', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function listMessagesForItem(itemId, token) {
  return request(`/api/items/${itemId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function markRead(messageId, token) {
  return request(`/api/messages/${messageId}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteMessage(messageId, token) {
  return request(`/api/messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteAllMessages(token) {
  return request('/api/messages', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}