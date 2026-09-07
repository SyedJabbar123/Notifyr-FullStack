import React from "react";

export default function StatusMessageBox({
  bgColor,
  borderColor,
  textColor,
  message,
}) {
  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-4 mb-6`}>
      <p className={`${textColor} text-sm leading-relaxed`}>{message}</p>
    </div>
  );
}
