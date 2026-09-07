import React from "react";

export default function PinInput({ value, onChange, error }) {
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="• • • •"
        maxLength={20}
        autoFocus
        className="w-full border border-[#E5E7EB] rounded-2xl px-4 py-4 text-center text-2xl tracking-[0.3em] font-medium text-[#0B1C2D] outline-none focus:border-[#F5C400] focus:ring-4 focus:ring-[#FEF7E0] transition mb-4"
      />
      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}
    </>
  );
}
