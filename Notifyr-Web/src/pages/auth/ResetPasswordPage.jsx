// src/pages/auth/ResetPasswordPage.jsx
import React from 'react';
import ResetPasswordForm from '../../containers/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
}