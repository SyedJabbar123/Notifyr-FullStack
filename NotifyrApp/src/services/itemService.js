import { request } from "./apiClient";

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET,} from "@env";



export function getMyItems(token){
    return request("/api/items", {
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
}


export function createItem(item, token) {
  return request("/api/items", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: item,
  });
}


export function updateItem(id, item, token) {
  return request(`/api/items/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: item,
  });
}


export async function saveItem(item, token) {
    if (item.id) {
        return updateItem(item.id, item, token);
    }

    return createItem(item, token);
}



export async function updateStatus(id, status, token){
    return request(`/api/items/${id}/status`,{
        method:"PATCH",
        headers:{
            Authorization: `Bearer ${token}`,
        },
         body: { status },
    });
}


export function bindQr(id, qrCode, token) {
  return request(`/api/items/${id}/bind-qr`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { qr_id: qrCode },
  });
}


// Frontend uploads image
export async function uploadImage(photoFile) {
  const formData = new FormData();

  formData.append("file", {
    uri: photoFile.uri,
    type: photoFile.type || "image/jpeg",
    name: photoFile.fileName || "item_upload.jpg",
  });

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const result = await response.json();

  if (!result.secure_url) {
    throw new Error("Image upload failed.");
  }

  return result.secure_url;
}


export async function getItem(id, token) {
  const data = await request(`/api/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.item;
}



export function unbindQr(itemId, token) {
  return request(`/api/items/${itemId}/unbind-qr`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}




export async function deleteItem(id, token, { qrId } = {}) {
  // If this item has a linked tag, free it first — the backend's item
  // delete endpoint doesn't currently unassign the QR tag itself (only
  // clears messages/rate-limits/blocks), which would otherwise leave that
  // physical tag permanently stuck as "assigned" to a deleted item.
  if (qrId) {
    await unbindQr(id, token);
  }

  return request(`/api/items/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}