import {request} from './apiClient';

export function login({email,password}){
    return request("/api/auth/login",{
        method:'POST',
        body:{email, password}
    });
}


export function signup({email,password,name,phone}){
    return request("/api/auth/signup",{
        method:'POST',
        body:{email, 
            password,name,phone}
    });
}


export function updateFcmToken(fcmToken, authToken) {
  return request('/api/auth/fcm-token', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: { fcm_token: fcmToken },
  });
}

export function updateProfile({ name, phone }, authToken) {
  return request('/api/auth/me', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${authToken}` },
    body: { name, phone },
  });
}



 
export function forgotPassword(email) {
  return request('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}
 


export function setGlobalDnd({ enabled, days, startHour, endHour }, authToken) {
  return request('/api/auth/global-dnd', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: { enabled, days, startHour, endHour },
  });
}
 


export function exportMyData(authToken) {
  return request('/api/auth/export', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}
 
export function deleteAccount(authToken) {
  return request('/api/auth/me', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}




export function changePassword(currentPassword, newPassword, authToken) {
  return request('/api/auth/change-password', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: { currentPassword, newPassword },
  });
}