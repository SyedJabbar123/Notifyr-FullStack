// src/services/api.js
//
// Central place for talking to the Notifyr backend.
// NOTE: This IP only works while your phone and PC are on the SAME network
// (e.g. PC connected to your phone's hotspot). If that setup changes,
// update BASE_URL below to match (run `ipconfig` on the PC to find it).

const BASE_URL = 'http://10.165.242.115:4000';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // some responses (e.g. 204) have no body
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export async function signup({ name, email, password }) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: { name, email, password },
  });
}

export async function login({ email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}