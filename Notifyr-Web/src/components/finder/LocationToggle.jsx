import React from "react";
import { MapPin } from "lucide-react";

export default function LocationToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-2 justify-center rounded-2xl px-4 py-3 border text-sm font-medium transition ${
        enabled
          ? "border-[#F5C400] bg-amber-50 text-[#0B1C2D]"
          : "border-[#E5E7EB] text-[#64748B]"
      }`}
    >
      <MapPin className="w-4 h-4" />
      {enabled ? "Location will be shared" : "Share my location (optional)"}
    </button>
  );
}
