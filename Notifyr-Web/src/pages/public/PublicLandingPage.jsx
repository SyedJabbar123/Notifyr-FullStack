import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tag, ScanLine, MessageCircle, CheckCircle2,
  Package, Boxes, Building2,
  ChevronDown, Mail,
  Play, Pause, ChevronLeft, ChevronRight, Bell,
  ArrowUp, Lock, BellOff, Zap // Added for the features section
} from "lucide-react";

import Navbar from "@/components/public/Navbar";
import Button from "@/components/ui/Button";
import ItemSummaryCard from "@/components/finder/ItemSummaryCard";
import PinInput from "@/components/finder/PinInput";
import ReasonChipList from "@/components/finder/ReasonChipList";
import FreeTextNote from "@/components/finder/FreeTextNote";
import LocationToggle from "@/components/finder/LocationToggle";
import PrivacyNote from "@/components/finder/PrivacyNote";

// --- DATA ARRAYS ---
const STEPS = [
  {
    icon: Tag,
    title: "Attach a tag",
    description: "Get a durable Notifyr QR tag and stick it to your laptop, bag, bottle, or keys.",
  },
  {
    icon: ScanLine,
    title: "Register it",
    description: "Open the Notifyr app, scan the tag once, and link it to your item in seconds.",
  },
  {
    icon: MessageCircle,
    title: "Someone finds it",
    description: "If it's ever lost, whoever finds it scans the tag with any phone camera — no app required on their end.",
  },
  {
    icon: CheckCircle2,
    title: "Get an anonymous message",
    description: "They send you a message through Notifyr. Your phone number and email stay private the entire time.",
  },
];

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

const FAQS = [
  {
    question: "How does the finder message me without seeing my number or email?",
    answer: "When someone scans your tag, they get a private in-app messaging thread routed through Notifyr's servers. Your phone number and email are never shown to them, in either direction.",
  },
  {
    question: "What does Global Do Not Disturb do?",
    answer: "Turning on Global DND pauses scan notifications across every item you own at once — useful during exams, meetings, or travel. You can turn it back on anytime from Settings.",
  },
  {
    question: "Can I block someone who's messaging me?",
    answer: "Yes. Open any message from that sender and choose \"Block Sender.\" They won't be able to send you further messages through that tag.",
  },
  {
    question: "What happens to my tags if I delete my account?",
    answer: "Deleting your account permanently removes your items and messages, and frees up any linked QR tags so they can be registered to someone else in the future.",
  },
  {
    question: "My tag is damaged or lost. What do I do?",
    answer: "Request a replacement from the Get Tags page. Once you register the new tag to the same item in the app, the old tag's link is automatically cleared.",
  },
];

const DEMO_ITEM = {
  category: "bottle",
  nickname: "Hydro Flask",
  itemPhotoUrl: null,
  status: "lost",
};

const DEMO_PIN = "2434";
const DEMO_MESSAGE = "Hi, I found your bottle near the library entrance!";


// --- HELPER COMPONENTS ---
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

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#F0F4F8] py-5">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-bold text-[#0A1931] pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="text-sm text-[#64748B] leading-relaxed mt-3 pr-8">{answer}</p>}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function UnifiedLandingPage() {
  const navigate = useNavigate();
  const mailtoHref = "mailto:support@notifyr.app?subject=" + encodeURIComponent("Requesting Notifyr tags");

  // Demo State
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timeoutRef = useRef(null);
  const typedPin = useTypewriter(DEMO_PIN, index === 1, 220);
  const typedMessage = useTypewriter(DEMO_MESSAGE, index === 3, 35);

  // --- SCROLL TO TOP STATE ---
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const SCENES = [
    {
      caption: "A student finds a lost item and scans its Notifyr tag.",
      duration: 3200,
      render: () => (
        <div className="p-5 pt-8">
          <ItemSummaryCard {...DEMO_ITEM} />
          <div className="mt-6"><Button variant="primary" size="lg" fullWidth>Continue</Button></div>
        </div>
      ),
    },
    {
      caption: "They enter the PIN printed on the tag to confirm it's genuine.",
      duration: 3400,
      render: () => (
        <div className="p-5 pt-10">
          <p className="text-center text-sm text-[#64748B] mb-6">Enter the 4-digit code from the tag</p>
          <PinInput value={typedPin} onChange={() => {}} />
          <Button variant="primary" size="lg" fullWidth>Verify</Button>
        </div>
      ),
    },
    {
      caption: "They choose what happened to the item.",
      duration: 3000,
      render: () => (
        <div className="p-5 pt-8">
          <p className="text-sm font-semibold text-[#0B1C2D] mb-4">What's going on?</p>
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
          <Button variant="primary" size="lg" fullWidth>Send Message</Button>
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
          <h3 className="text-lg font-bold text-[#0B1C2D] mb-2">Message Sent</h3>
          <p className="text-sm text-[#64748B] mb-6">The owner has been notified. They may reach out if needed.</p>
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
            <p className="text-xs font-bold text-[#0B1C2D] uppercase tracking-wide">New Notification</p>
          </div>
          <div className="bg-white border-2 border-[#0A1931] rounded-2xl p-4 shadow-sm border-l-4 border-l-[#FFB800]">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] font-extrabold text-[#FFB800] tracking-wide">FOUND YOUR ITEM!</p>
              <p className="text-[10px] text-[#9AA5B5]">Just now</p>
            </div>
            <p className="text-sm font-bold text-[#0B1C2D] mb-1">{DEMO_ITEM.nickname}</p>
            <p className="text-xs text-[#64748B] leading-relaxed">{DEMO_MESSAGE}</p>
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
  }, [index, playing]);

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* --- RE-ADDED HERO SECTION --- */}
      <header className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 pr-8 mb-16 md:mb-0">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            Smart Campus Pilot
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-[#0A1931] leading-tight mb-6 tracking-tight">
            Lose something? <br />
            <span className="text-[#FFB800]">Get it back securely.</span>
          </h1>
          <p className="text-lg text-[#64748B] mb-8 leading-relaxed max-w-lg">
            Attach a smart QR tag to your keys, bags, or workstation. When someone finds your lost item, they scan the tag to message you anonymously—without ever seeing your personal details.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate("/scan")}
              className="bg-[#FFB800] text-[#0A1931] px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#e6a600] transition-all"
            >
              Scan to inform
            </button>
            <button 
              onClick={scrollToDemo}
              className="bg-white text-[#0A1931] border-2 border-[#F0F4F8] px-8 py-3.5 rounded-2xl font-bold shadow-sm hover:border-[#0A1931] transition-all"
            >
              Watch Demo
            </button>
          </div>
        </div>
        
        {/* Hero Graphic Match */}
        <div className="md:w-1/2 w-full relative flex justify-center md:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-full bg-[#F1F5F9] rounded-[2rem] transform rotate-3 z-0"></div>
          <div className="relative w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-[#F0F4F8] flex flex-col items-center z-10">
            <div className="w-full h-32 bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-2xl mb-6 flex items-center justify-center">
              <div className="w-14 h-14 bg-[#0A1931] rounded-xl flex items-center justify-center">
                <ScanLine className="w-7 h-7 text-[#FFB800]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#0A1931] mb-1">Item Found: HP ZBook</h3>
            <p className="text-sm text-[#64748B] mb-6">Found at University Auditorium</p>
            <div className="w-full bg-[#F8FAFC] p-4 rounded-xl border border-[#F0F4F8] mb-4">
              <p className="text-sm text-[#64748B] italic">"Hi, I found your laptop near the front row..."</p>
            </div>
            <button className="w-full bg-[#64748B] text-white py-4 rounded-xl font-bold cursor-not-allowed">
              Message Sent
            </button>
          </div>
        </div>
      </header>

      {/* --- RE-ADDED FEATURES SECTION --- */}
      <section className="w-full bg-[#0A1931] py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#132647] p-8 rounded-3xl border border-[#1E365D]">
            <div className="w-12 h-12 bg-[#FFB800] rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-[#0A1931]" strokeWidth={2} />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Total Anonymity</h4>
            <p className="text-[#9AA5B5] text-sm leading-relaxed">
              Communicate with finders without exposing your phone number or email address.
            </p>
          </div>
          <div className="bg-[#132647] p-8 rounded-3xl border border-[#1E365D]">
            <div className="w-12 h-12 bg-[#FFB800] rounded-xl flex items-center justify-center mb-6">
              <BellOff className="w-6 h-6 text-[#0A1931]" strokeWidth={2} />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Global DND</h4>
            <p className="text-[#9AA5B5] text-sm leading-relaxed">
              Heading into an exam or meeting? Pause all incoming finder notifications with a single tap.
            </p>
          </div>
          <div className="bg-[#132647] p-8 rounded-3xl border border-[#1E365D]">
            <div className="w-12 h-12 bg-[#FFB800] rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-[#0A1931]" strokeWidth={2} />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Instant Alerts</h4>
            <p className="text-[#9AA5B5] text-sm leading-relaxed">
              Get push notifications the exact second someone scans your lost item's QR tag.
            </p>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-8 pt-24 pb-24 border-b border-[#F0F4F8]">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-4">
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1931] tracking-tight leading-tight">
            From lost to found, <br />
            <span className="text-[#FFB800]">in four steps.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="bg-white border border-[#F0F4F8] rounded-3xl p-8 shadow-sm relative">
                <span className="absolute top-6 right-8 text-5xl font-black text-[#F1F5F9]">{idx + 1}</span>
                <div className="w-12 h-12 rounded-2xl bg-[#0A1931] flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#FFB800]" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#0A1931] mb-2">{step.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- LIVE DEMO --- */}
      <section id="demo-section" className="max-w-5xl mx-auto px-8 py-24 border-b border-[#F0F4F8]">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-4">
            Live Demo
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1931] tracking-tight leading-tight">
            See it <span className="text-[#FFB800]">in action.</span>
          </h2>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-sm bg-[#0A1931] rounded-[2.5rem] p-3 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden min-h-[520px] relative">
              <div className="flex justify-center pt-3">
                <div className="w-24 h-5 bg-[#0A1931] rounded-full" />
              </div>
              {SCENES[index].render()}
            </div>
          </div>

          <p className="text-center text-[#64748B] text-sm mt-6 max-w-sm min-h-[40px]">{SCENES[index].caption}</p>

          <div className="flex items-center gap-4 mt-4">
            <button onClick={() => goTo(index - 1)} className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0A1931] transition"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPlaying((p) => !p)} className="w-11 h-11 rounded-full bg-[#0A1931] flex items-center justify-center text-white hover:bg-[#132647] transition">
              {playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
            </button>
            <button onClick={() => goTo(index + 1)} className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0A1931] transition"><ChevronRight className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-2 mt-5">
            {SCENES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#FFB800]" : "w-1.5 bg-[#E2E8F0]"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* --- GET TAGS --- */}
      <section id="pricing" className="max-w-5xl mx-auto px-8 py-24 border-b border-[#F0F4F8]">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-4">
            Smart Campus Pilot
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1931] tracking-tight leading-tight mb-4">
            Get Your <span className="text-[#FFB800]">Notifyr Tags</span>
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto">
            Tags are free for verified students and staff. Pick the pack that fits what you're protecting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKS.map((pack) => {
            const Icon = pack.icon;
            return (
              <div key={pack.name} className={`rounded-3xl p-8 border ${pack.highlighted ? "bg-[#0A1931] border-[#0A1931]" : "bg-white border-[#F0F4F8] shadow-sm"}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${pack.highlighted ? "bg-[#FFB800]" : "bg-[#F1F5F9]"}`}>
                  <Icon className={`w-6 h-6 ${pack.highlighted ? "text-[#0A1931]" : "text-[#0A1931]"}`} strokeWidth={2} />
                </div>
                <h3 className={`text-xl font-bold mb-1 ${pack.highlighted ? "text-white" : "text-[#0A1931]"}`}>{pack.name}</h3>
                <p className={`text-sm font-semibold mb-4 ${pack.highlighted ? "text-[#FFB800]" : "text-[#64748B]"}`}>{pack.count}</p>
                <p className={`text-sm leading-relaxed mb-6 ${pack.highlighted ? "text-[#9AA5B5]" : "text-[#64748B]"}`}>{pack.description}</p>
                <a href={mailtoHref} className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${pack.highlighted ? "bg-[#FFB800] text-[#0A1931] hover:bg-[#e6a600]" : "bg-[#0A1931] text-white hover:bg-[#132647]"}`}>
                  Request Tags
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- FAQ & SUPPORT --- */}
      <section id="support" className="max-w-3xl mx-auto px-8 py-24">
        <div className="text-center mb-14">
          <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mb-4">
            Support
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1931] tracking-tight leading-tight">
            How can we <span className="text-[#FFB800]">help?</span>
          </h2>
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
          <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
          <p className="text-[#9AA5B5] text-sm mb-6 max-w-sm mx-auto">
            Reach out and we'll get back to you within one business day.
          </p>
          <a href="mailto:support@notifyr.app" className="inline-block bg-[#FFB800] text-[#0A1931] px-7 py-3.5 rounded-2xl font-bold hover:bg-[#e6a600] transition-all">
            Email support@notifyr.app
          </a>
        </div>
        
      </section>
      {/* --- FLOATING SCROLL TO TOP BUTTON --- */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-[#0A1931] text-white rounded-2xl shadow-xl hover:bg-[#132647] hover:-translate-y-1 transition-all duration-300 ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 text-[#FFB800]" strokeWidth={2.5} />
      </button>
    </div>
  );
}