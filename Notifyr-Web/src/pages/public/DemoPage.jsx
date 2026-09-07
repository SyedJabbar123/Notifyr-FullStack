import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ScanLine,
  CheckCircle2,
  Bell,
} from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Button from "@/components/ui/Button";
import ItemSummaryCard from "@/components/finder/ItemSummaryCard";
import PinInput from "@/components/finder/PinInput";
import ReasonChipList from "@/components/finder/ReasonChipList";
import FreeTextNote from "@/components/finder/FreeTextNote";
import LocationToggle from "@/components/finder/LocationToggle";
import PrivacyNote from "@/components/finder/PrivacyNote";

const DEMO_ITEM = {
  category: "bottle",
  nickname: "Hydro Flask",
  itemPhotoUrl: null,
  status: "lost",
};

const DEMO_PIN = "2434";
const DEMO_MESSAGE = "Hi, I found your bottle near the library entrance!";

// Reveals `text` one character at a time while `active` is true, and resets
// whenever the scene becomes inactive — gives the message/PIN scenes a
// "live" typing feel instead of static pre-filled text.
function useTypewriter(text, active, speed = 40) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!active) {
      setShown("");
      return;
    }
    let i = 0;
    setShown("");
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, text, speed]);

  return shown;
}

export default function DemoPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timeoutRef = useRef(null);

  const typedPin = useTypewriter(DEMO_PIN, index === 1, 220);
  const typedMessage = useTypewriter(DEMO_MESSAGE, index === 3, 35);

  const SCENES = [
    {
      caption: "A student finds a lost item and scans its Notifyr tag.",
      duration: 3200,
      render: () => (
        <div className="p-5 pt-8">
          <ItemSummaryCard {...DEMO_ITEM} />
          <div className="mt-6">
            <Button variant="primary" size="lg" fullWidth>
              Continue
            </Button>
          </div>
        </div>
      ),
    },
    {
      caption: "They enter the PIN printed on the tag to confirm it's genuine.",
      duration: 3400,
      render: () => (
        <div className="p-5 pt-10">
          <p className="text-center text-sm text-[#64748B] mb-6">
            Enter the 4-digit code from the tag
          </p>
          <PinInput value={typedPin} onChange={() => {}} />
          <Button variant="primary" size="lg" fullWidth>
            Verify
          </Button>
        </div>
      ),
    },
    {
      caption: "They choose what happened to the item.",
      duration: 3000,
      render: () => (
        <div className="p-5 pt-8">
          <p className="text-sm font-semibold text-[#0B1C2D] mb-4">
            What's going on?
          </p>
          <ReasonChipList selected="found_item" onSelect={() => {}} />
        </div>
      ),
    },
    {
      caption: "...and add an optional note or their location.",
      duration: 4200,
      render: () => (
        <div className="p-5 pt-8 space-y-4">
          <FreeTextNote value={typedMessage} onChange={() => {}} />
          <LocationToggle enabled onToggle={() => {}} />
          <Button variant="primary" size="lg" fullWidth>
            Send Message
          </Button>
        </div>
      ),
    },
    {
      caption: "Message sent — instantly and anonymously.",
      duration: 3200,
      render: () => (
        <div className="p-5 pt-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-md mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-[#0B1C2D] mb-2">
            Message Sent
          </h3>
          <p className="text-sm text-[#64748B] mb-6">
            The owner has been notified. They may reach out if needed.
          </p>
          <PrivacyNote />
        </div>
      ),
    },
    {
      caption: "The owner gets notified immediately and can reply from the app.",
      duration: 3400,
      render: () => (
        <div className="p-5 pt-10">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-4 h-4 text-[#FFB800]" />
            <p className="text-xs font-bold text-[#0B1C2D] uppercase tracking-wide">
              New Notification
            </p>
          </div>
          <div className="bg-white border-2 border-[#0A1931] rounded-2xl p-4 shadow-sm border-l-4 border-l-[#FFB800]">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] font-extrabold text-[#FFB800] tracking-wide">
                FOUND YOUR ITEM!
              </p>
              <p className="text-[10px] text-[#9AA5B5]">Just now</p>
            </div>
            <p className="text-sm font-bold text-[#0B1C2D] mb-1">
              {DEMO_ITEM.nickname}
            </p>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {DEMO_MESSAGE}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const total = SCENES.length;

  const goTo = (i) => setIndex(((i % total) + total) % total);

  useEffect(() => {
    if (!playing) return undefined;
    timeoutRef.current = setTimeout(() => {
      goTo(index + 1);
    }, SCENES[index].duration);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-5xl mx-auto px-8 pt-8 pb-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-4">
            Live Demo
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#0A1931] tracking-tight leading-tight">
            See it <span className="text-[#FFB800]">in action.</span>
          </h1>
        </div>

        <div className="flex flex-col items-center">
          {/* Phone frame */}
          <div className="w-full max-w-sm bg-[#0A1931] rounded-[2.5rem] p-3 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden min-h-[520px] relative">
              <div className="flex justify-center pt-3">
                <div className="w-24 h-5 bg-[#0A1931] rounded-full" />
              </div>
              {SCENES[index].render()}
            </div>
          </div>

          {/* Caption */}
          <p className="text-center text-[#64748B] text-sm mt-6 max-w-sm min-h-[40px]">
            {SCENES[index].caption}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => goTo(index - 1)}
              className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0A1931] transition"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-11 h-11 rounded-full bg-[#0A1931] flex items-center justify-center text-white hover:bg-[#132647] transition"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="w-4 h-4" fill="currentColor" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
              )}
            </button>

            <button
              onClick={() => goTo(index + 1)}
              className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0A1931] transition"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2 mt-5">
            {SCENES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-[#FFB800]" : "w-1.5 bg-[#E2E8F0]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-20 bg-[#0A1931] rounded-3xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFB800] flex items-center justify-center mx-auto mb-5">
            <ScanLine className="w-6 h-6 text-[#0A1931]" strokeWidth={2} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Try it yourself
          </h2>
          <p className="text-[#9AA5B5] mb-8 max-w-md mx-auto">
            Scan a real Notifyr tag with your own camera, or get tags for
            your own belongings.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/scan")}
              className="bg-[#FFB800] text-[#0A1931] px-7 py-3.5 rounded-2xl font-bold hover:bg-[#e6a600] transition-all"
            >
              Scan a Tag
            </button>
            <button
              onClick={() => navigate("/get-tags")}
              className="border-2 border-[#2A3F5F] text-white px-7 py-3.5 rounded-2xl font-bold hover:border-white transition-all"
            >
              Get Tags
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
