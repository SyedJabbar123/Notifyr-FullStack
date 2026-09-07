import React from "react";

const MAX_LENGTH = 150; // matches the backend's free_text validator limit

export default function FreeTextNote({ value, onChange }) {
  return (
    <div className="border border-[#E5E7EB] rounded-3xl px-5 py-4 bg-white">
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= MAX_LENGTH) onChange(e.target.value);
        }}
        placeholder="Any extra detail for the owner..."
        rows={3}
        className="w-full resize-none outline-none text-[#0B1C2D] text-sm placeholder:text-[#94A3B8]"
      />
      <div className="flex justify-end text-xs text-[#64748B] mt-2">
        {value.length}/{MAX_LENGTH}
      </div>
    </div>
  );
}
