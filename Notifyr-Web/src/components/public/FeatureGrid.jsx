import React from 'react';

const FEATURES = [
  {
    icon: '🔒',
    title: 'Total Anonymity',
    description: 'Communicate with finders without exposing your phone number or email address.',
  },
  {
    icon: '🔕',
    title: 'Global DND',
    description: 'Heading into an exam or meeting? Pause all incoming finder notifications with a single tap.',
  },
  {
    icon: '⚡',
    title: 'Instant Alerts',
    description: "Get push notifications the exact second someone scans your lost item's QR tag.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="bg-[#0A1931] py-24 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((feat, idx) => (
          <div key={idx} className="bg-[#132647] border border-[#1E3A6E] p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFB800] flex items-center justify-center text-xl shadow-md">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{feat.title}</h3>
            <p className="text-sm text-[#9AA5B5] leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}