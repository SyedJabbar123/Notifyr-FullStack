import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";
import { ArrowLeft, CameraOff, AlertTriangle } from "lucide-react";
import logo from "@/assets/logo.png";

// Accepts either a full URL pointing at this app's own /t/:qrId finder route,
// or a bare "QR_xxxx" string (in case a tag is ever printed with just the
// raw ID rather than a full URL). Anything else is treated as "not a
// Notifyr tag" rather than guessed at.
function resolveScannedValue(rawText) {
  const text = (rawText || "").trim();

  try {
    const url = new URL(text);
    const internalMatch = url.pathname.match(/^\/t\/([^/]+)\/?$/);

    if (url.origin === window.location.origin && internalMatch) {
      return { type: "internal", path: `/t/${internalMatch[1]}` };
    }

    // Absolute URL, different origin (e.g. staging vs prod deploys of this
    // same app) — still a real link, just needs a full navigation instead
    // of client-side routing.
    if (internalMatch) {
      return { type: "external", url: text };
    }

    return { type: "unknown" };
  } catch {
    // Not a valid absolute URL — check for a bare QR id.
    if (/^QR_[a-zA-Z0-9]+$/.test(text)) {
      return { type: "internal", path: `/t/${text}` };
    }
    return { type: "unknown" };
  }
}

export default function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  // 'starting' | 'scanning' | 'noCamera' | 'denied' | 'invalid'
  const [status, setStatus] = useState("starting");

  const startScanner = async () => {
    setStatus("starting");

    // Camera access requires a secure context — HTTPS, or the special-cased
    // "localhost" origin. On a phone opening this over a LAN IP
    // (http://192.168.x.x:5173) neither applies, so navigator.mediaDevices
    // doesn't exist at all and the browser never shows a permission prompt.
    if (!window.isSecureContext || !navigator.mediaDevices) {
      setStatus("insecure");
      return;
    }

    let hasCamera;
    try {
      hasCamera = await QrScanner.hasCamera();
    } catch (err) {
      console.error("Camera check failed:", err);
      setStatus("denied");
      return;
    }

    if (!hasCamera) {
      setStatus("noCamera");
      return;
    }

    if (!scannerRef.current && videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data),
        {
          preferredCamera: "environment",
          highlightScanRegion: false,
          highlightCodeOutline: false,
          maxScansPerSecond: 5,
        }
      );
    }

    try {
      await scannerRef.current.start();
      setStatus("scanning");
    } catch (err) {
      console.error("Camera start failed:", err);
      setStatus("denied");
    }
  };

  const handleScan = (rawText) => {
    const resolved = resolveScannedValue(rawText);

    if (resolved.type === "unknown") {
      // Pause rather than stop — keeps the camera stream alive so "Try
      // Again" is instant instead of re-requesting permission.
      scannerRef.current?.pause();
      setStatus("invalid");
      return;
    }

    scannerRef.current?.stop();

    if (resolved.type === "internal") {
      navigate(resolved.path);
    } else {
      window.location.href = resolved.url;
    }
  };

  const handleRetry = async () => {
    if (scannerRef.current) {
      await scannerRef.current.start();
      setStatus("scanning");
    } else {
      startScanner();
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0A1931] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 z-10">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 text-white/80 hover:text-white transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Scan a Notifyr Tag
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Point your camera at the QR code on the item
        </p>
      </div>

      {/* Scan frame — box-shadow spread creates the dimmed mask with a
          clear cut-out, so it always covers exactly the viewport with no
          manual width/height measurement needed. */}
      {status === "scanning" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="relative w-64 h-64 rounded-3xl"
            style={{ boxShadow: "0 0 0 9999px rgba(10, 25, 49, 0.8)" }}
          >
            <span className="absolute -top-1 -left-1 w-9 h-9 border-t-4 border-l-4 border-[#FFB800] rounded-tl-2xl" />
            <span className="absolute -top-1 -right-1 w-9 h-9 border-t-4 border-r-4 border-[#FFB800] rounded-tr-2xl" />
            <span className="absolute -bottom-1 -left-1 w-9 h-9 border-b-4 border-l-4 border-[#FFB800] rounded-bl-2xl" />
            <span className="absolute -bottom-1 -right-1 w-9 h-9 border-b-4 border-r-4 border-[#FFB800] rounded-br-2xl" />
          </div>
        </div>
      )}

      {/* Full-screen states that replace the camera view entirely — never
          a text input, only camera or a retry action. */}
      {status === "starting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <img src={logo} alt="" className="w-12 h-12 opacity-70 animate-pulse" />
          <p className="text-white/70 text-sm">Starting camera...</p>
        </div>
      )}

      {status === "insecure" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <CameraOff className="w-10 h-10 text-white/70" />
          <div>
            <p className="text-white font-bold">Secure connection needed</p>
            <p className="text-white/60 text-sm mt-1">
              Camera access only works over HTTPS (or on the same machine via
              localhost). Open this page over a secure connection to scan.
            </p>
          </div>
        </div>
      )}

      {status === "denied" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <CameraOff className="w-10 h-10 text-white/70" />
          <div>
            <p className="text-white font-bold">Camera access needed</p>
            <p className="text-white/60 text-sm mt-1">
              Enable camera permission for this site in your browser settings,
              then try again.
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-[#FFB800] text-[#0A1931] px-6 py-3 rounded-xl font-bold mt-2"
          >
            Try Again
          </button>
        </div>
      )}

      {status === "noCamera" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <CameraOff className="w-10 h-10 text-white/70" />
          <p className="text-white font-bold">No camera found</p>
          <p className="text-white/60 text-sm">
            This device doesn't have a camera available for scanning.
          </p>
        </div>
      )}

      {status === "invalid" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center bg-[#0A1931]/90">
          <AlertTriangle className="w-10 h-10 text-[#FFB800]" />
          <div>
            <p className="text-white font-bold">Not a Notifyr tag</p>
            <p className="text-white/60 text-sm mt-1">
              That QR code doesn't match a registered Notifyr item.
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-[#FFB800] text-[#0A1931] px-6 py-3 rounded-xl font-bold mt-2"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
