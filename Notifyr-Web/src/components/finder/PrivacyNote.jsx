import React from "react";
import { Shield } from "lucide-react";

export default function PrivacyNote() {
  return (
    <div className="mt-8 bg-[#F8FAFC] rounded-2xl p-5 flex items-center justify-center gap-3 border border-[#E5E7EB]">
      <Shield className="w-5 h-5 text-[#0B1C2D] flex-shrink-0" />
      <p className="text-sm text-[#64748B]">
        Your identity is protected. Messages are sent anonymously.
      </p>
    </div>
  );
}
