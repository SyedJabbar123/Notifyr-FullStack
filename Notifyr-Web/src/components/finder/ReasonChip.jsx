import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function ReasonChip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl px-5 py-4 text-left transition-all border ${
        selected
          ? "border-[#F5C400] bg-[#FFFBEB] shadow-sm"
          : "border-[#E5E7EB] bg-white hover:border-[#CBD5E1]"
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        <p className="text-[#0B1C2D] text-[15px] font-medium">{label}</p>
        {selected && (
          <CheckCircle2 className="w-5 h-5 text-[#D4A700] flex-shrink-0" />
        )}
      </div>
    </button>
  );
}
