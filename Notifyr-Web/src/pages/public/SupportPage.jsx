import React, { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import Navbar from "@/components/public/Navbar";

const FAQS = [
  {
    question: "How does the finder message me without seeing my number or email?",
    answer:
      "When someone scans your tag, they get a private in-app messaging thread routed through Notifyr's servers. Your phone number and email are never shown to them, in either direction.",
  },
  {
    question: "What does Global Do Not Disturb do?",
    answer:
      "Turning on Global DND pauses scan notifications across every item you own at once — useful during exams, meetings, or travel. You can turn it back on anytime from Settings.",
  },
  {
    question: "Can I block someone who's messaging me?",
    answer:
      "Yes. Open any message from that sender and choose \"Block Sender.\" They won't be able to send you further messages through that tag.",
  },
  {
    question: "What happens to my tags if I delete my account?",
    answer:
      "Deleting your account permanently removes your items and messages, and frees up any linked QR tags so they can be registered to someone else in the future.",
  },
  {
    question: "My tag is damaged or lost. What do I do?",
    answer:
      "Request a replacement from the Get Tags page. Once you register the new tag to the same item in the app, the old tag's link is automatically cleared.",
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#F0F4F8] py-5">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-bold text-[#0A1931] pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="text-sm text-[#64748B] leading-relaxed mt-3 pr-8">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-3xl mx-auto px-8 pt-8 pb-24">
        <div className="text-center mb-14">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-4">
            Support
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#0A1931] tracking-tight leading-tight">
            How can we <span className="text-[#FFB800]">help?</span>
          </h1>
        </div>

        <div className="bg-white border border-[#F0F4F8] rounded-3xl px-8 shadow-sm mb-12">
          {FAQS.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>

        <div className="bg-[#0A1931] rounded-3xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFB800] flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-6 text-[#0A1931]" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Still need help?
          </h2>
          <p className="text-[#9AA5B5] text-sm mb-6 max-w-sm mx-auto">
            Reach out and we'll get back to you within one business day.
          </p>
          <a
            href="mailto:support@notifyr.app"
            className="inline-block bg-[#FFB800] text-[#0A1931] px-7 py-3.5 rounded-2xl font-bold hover:bg-[#e6a600] transition-all"
          >
            Email support@notifyr.app
          </a>
        </div>
      </section>
    </div>
  );
}
