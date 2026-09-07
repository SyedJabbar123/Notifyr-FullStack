import React from "react";
import { useNavigate } from "react-router-dom";
import { Tag, ScanLine, MessageCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/public/Navbar";

const STEPS = [
  {
    icon: Tag,
    title: "Attach a tag",
    description:
      "Get a durable Notifyr QR tag and stick it to your laptop, bag, bottle, or keys.",
  },
  {
    icon: ScanLine,
    title: "Register it",
    description:
      "Open the Notifyr app, scan the tag once, and link it to your item in seconds.",
  },
  {
    icon: MessageCircle,
    title: "Someone finds it",
    description:
      "If it's ever lost, whoever finds it scans the tag with any phone camera — no app required on their end.",
  },
  {
    icon: CheckCircle2,
    title: "Get an anonymous message",
    description:
      "They send you a message through Notifyr. Your phone number and email stay private the entire time.",
  },
];

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-5xl mx-auto px-8 pt-8 pb-24">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-4">
            How It Works
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#0A1931] tracking-tight leading-tight">
            From lost to found,
            <br />
            <span className="text-[#FFB800]">in four steps.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-white border border-[#F0F4F8] rounded-3xl p-8 shadow-sm relative"
              >
                <span className="absolute top-6 right-8 text-5xl font-black text-[#F1F5F9]">
                  {idx + 1}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#0A1931] flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#FFB800]" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A1931] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-[#0A1931] rounded-3xl p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Ready to protect what matters?
          </h2>
          <p className="text-[#9AA5B5] mb-8 max-w-md mx-auto">
            Get your tags and start reuniting with lost items before they're
            gone for good.
          </p>
          <button
            onClick={() => navigate("/get-tags")}
            className="bg-[#FFB800] text-[#0A1931] px-7 py-4 rounded-2xl font-bold shadow-lg shadow-[#FFB800]/20 hover:bg-[#e6a600] transition-all"
          >
            Get Tags
          </button>
        </div>
      </section>
    </div>
  );
}
