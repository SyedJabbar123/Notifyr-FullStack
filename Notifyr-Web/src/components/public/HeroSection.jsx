import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-8 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-block bg-[#F1F5F9] text-[#0A1931] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
          Smart Campus Pilot
        </div>
        
        <h1 className="text-5xl lg:text-6xl font-black text-[#0A1931] tracking-tight leading-[1.1]">
          Lose something? <br />
          <span className="text-[#FFB800]">Get it back securely.</span>
        </h1>

        <p className="text-lg text-[#64748B] font-medium max-w-xl leading-relaxed">
          Attach a smart QR tag to your keys, bags, or workstation. When someone finds your lost item, they scan the tag to message you anonymously—without ever seeing your personal details.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={() => navigate('/scan')}
            className="bg-[#FFB800] text-[#0A1931] px-7 py-4 rounded-2xl font-bold shadow-lg shadow-[#FFB800]/20 hover:bg-[#e6a600] transition-all"
          >
            Scan to inform
          </button>
          
          <button
            onClick={() => navigate('/demo')}
            className="border-2 border-[#E2E8F0] text-[#0A1931] px-7 py-4 rounded-2xl font-bold hover:border-[#0A1931] transition-all"
          >
            Watch Demo
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 flex justify-center">
        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-[#F0F4F8] w-full max-w-md relative">
          <div className="bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 flex flex-col items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0A1931] flex items-center justify-center shadow-lg shadow-[#0A1931]/20">
              <ScanLine className="w-8 h-8 text-[#FFB800]" strokeWidth={2} />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-[#0A1931]">Item Found: HP ZBook</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Found at University Auditorium</p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#64748B] italic mb-4">
            "Hi, I found your laptop near the front row..."
          </div>

          <div className="bg-[#64748B] text-white py-3.5 rounded-xl font-bold text-center text-sm shadow">
            Message Sent
          </div>
        </div>
      </div>
    </section>
  );
}