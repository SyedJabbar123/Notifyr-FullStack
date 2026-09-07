import React from "react";
import { Link } from "react-router-dom";
import { Package, Boxes, Building2 } from "lucide-react";
import Navbar from "@/components/public/Navbar";

const PACKS = [
  {
    icon: Package,
    name: "Starter Pack",
    count: "3 tags",
    description: "Enough to cover your laptop, bag, and keys.",
  },
  {
    icon: Boxes,
    name: "Campus Pack",
    count: "10 tags",
    description: "Tag everything you carry across a semester.",
    highlighted: true,
  },
  {
    icon: Building2,
    name: "Department Pack",
    count: "Custom quantity",
    description: "For labs, libraries, or shared equipment pools.",
  },
];

export default function GetTagsPage() {
  const mailtoHref =
    "mailto:support@notifyr.app?subject=" +
    encodeURIComponent("Requesting Notifyr tags");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-5xl mx-auto px-8 pt-8 pb-24">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-4">
            Smart Campus Pilot
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#0A1931] tracking-tight leading-tight mb-4">
            Get Your <span className="text-[#FFB800]">Notifyr Tags</span>
          </h1>
          <p className="text-[#64748B] max-w-xl mx-auto">
            Tags are free for verified students and staff during the Smart
            Campus Pilot. Pick the pack that fits what you're protecting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKS.map((pack) => {
            const Icon = pack.icon;
            return (
              <div
                key={pack.name}
                className={`rounded-3xl p-8 border ${
                  pack.highlighted
                    ? "bg-[#0A1931] border-[#0A1931]"
                    : "bg-white border-[#F0F4F8] shadow-sm"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                    pack.highlighted ? "bg-[#FFB800]" : "bg-[#F1F5F9]"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      pack.highlighted ? "text-[#0A1931]" : "text-[#0A1931]"
                    }`}
                    strokeWidth={2}
                  />
                </div>
                <h3
                  className={`text-xl font-bold mb-1 ${
                    pack.highlighted ? "text-white" : "text-[#0A1931]"
                  }`}
                >
                  {pack.name}
                </h3>
                <p
                  className={`text-sm font-semibold mb-4 ${
                    pack.highlighted ? "text-[#FFB800]" : "text-[#64748B]"
                  }`}
                >
                  {pack.count}
                </p>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    pack.highlighted ? "text-[#9AA5B5]" : "text-[#64748B]"
                  }`}
                >
                  {pack.description}
                </p>
                <a
                  href={mailtoHref}
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${
                    pack.highlighted
                      ? "bg-[#FFB800] text-[#0A1931] hover:bg-[#e6a600]"
                      : "bg-[#0A1931] text-white hover:bg-[#132647]"
                  }`}
                >
                  Request Tags
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-[#94A3B8] mt-10">
          Requests are reviewed within 2–3 business days. Have questions
          first? Visit{" "}
          <Link to="/support" className="text-[#0A1931] font-semibold underline">
            Support
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
