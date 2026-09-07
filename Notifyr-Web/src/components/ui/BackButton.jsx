import React from "react";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0B1C2D] transition mb-4"
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </button>
  );
}
