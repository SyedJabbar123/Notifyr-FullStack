import React from "react";

export default function StatusIcon({ icon: Icon, gradient }) {
  return (
    <div className="mb-6">
      <div
        className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${gradient} rounded-full shadow-md`}
      >
        <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
      </div>
    </div>
  );
}
