// src/containers/auth/ResetPasswordForm.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../../api/client';

const APP_SCHEME_URL = 'notifyr://reset-success';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'submitting' | 'success' | 'error'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing its token. Please request a new one.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setStep('submitting');
    try {
      await client.post('/auth/reset-password', { token, newPassword });
      setStep('success');
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'This link is invalid or has expired. Please request a new one.'
      );
      setStep('error');
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-sm mx-auto text-center py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-[#0A1931]/5 flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">✅</span>
        </div>
        <h1 className="text-xl font-bold text-[#0A1931] mb-2">Password Updated</h1>
        <p className="text-sm text-gray-500 mb-8">
          Your password has been changed. You can now sign back in from the Notifyr app.
        </p>

        <a
          href={APP_SCHEME_URL}
          className="block w-full bg-[#0A1931] text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-[#0A1931]/90 transition-colors"
        >
          Open Notifyr App
        </a>
        <p className="text-xs text-gray-400 mt-4">
          Nothing happen? Just open the app manually and log in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto py-16 px-6">
      <h1 className="text-xl font-bold text-[#0A1931] mb-1">Reset Your Password</h1>
      <p className="text-sm text-gray-500 mb-8">Choose a new password for your account.</p>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#0A1931]/20 focus:border-[#0A1931]"
          placeholder="Enter new password"
        />

        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-[#0A1931]/20 focus:border-[#0A1931]"
          placeholder="Type it again"
        />

        <button
          type="submit"
          disabled={step === 'submitting'}
          className="w-full bg-[#0A1931] text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-[#0A1931]/90 transition-colors disabled:opacity-60"
        >
          {step === 'submitting' ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}