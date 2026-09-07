import React from "react";
import logo from "@/assets/logo.png";

export default function BrandHeader() {
  return (
    <header className="pt-32 pb-6 flex flex-col items-center">
      <img src={logo} alt="Notifyr" className="w-20 h-20 object-contain" />

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1C2D]">
        Notifyr
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Anonymous • Secure • Instant
      </p>
    </header>
  );
}
