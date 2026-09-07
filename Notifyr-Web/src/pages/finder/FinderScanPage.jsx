import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ItemLandingCard from "@/containers/finder/ItemLandingCard";
import ItemVerifyForm from "@/containers/finder/ItemVerifyForm";
import ItemMessageForm from "@/containers/finder/ItemMessageForm";
import ItemErrorState from "@/containers/finder/ItemErrorState";

export default function FinderScanPage() {
  const { qrId } = useParams();

  // State machine: loading -> landing -> verify -> message -> sent
  // (or any of: invalid / dnd / network / tooManyAttempts / rateLimit / blocked)
  const [step, setStep] = useState("loading");
  const [item, setItem] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  const fetchItem = async () => {
    setStep("loading");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/public/items/${qrId}`,
      );
      const data = await res.json();

      if (!res.ok) {
        // Our backend's NOT_FOUND covers "code doesn't exist" — map it to our "invalid" state
        setStep(res.status === 404 ? "invalid" : "network");
        return;
      }

      setItem(data);

      // Per the spec: dnd stops the flow entirely at landing, no further screens.
      // 'lost' and 'active' both continue to the same next step.
      setStep(data.status === "dnd" ? "dnd" : "landing");
    } catch (err) {
      console.error("Fetch item error:", err);
      setStep("network");
    }
  };

  useEffect(() => {
    if (qrId) fetchItem();
  }, [qrId]);

  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#64748B]">
        Loading...
      </div>
    );
  }

  if (step === "landing" && item) {
    return (
      <ItemLandingCard
        category={item.category}
        nickname={item.nickname}
        itemPhotoUrl={item.itemPhotoUrl}
        status={item.status}
        onContinue={() => setStep("verify")}
      />
    );
  }

  if (step === "verify") {
    return (
      <ItemVerifyForm
        qrId={qrId}
        onBack={() => setStep("landing")}
        onVerified={(token) => {
          setSessionToken(token);
          setStep("message");
        }}
        onTooManyAttempts={() => setStep("tooManyAttempts")}
        onNetworkError={() => setStep("network")}
      />
    );
  }

  if (step === "message" && item) {
    return (
      <ItemMessageForm
        qrId={qrId}
        sessionToken={sessionToken}
        onBack={() => setStep("verify")}
        category={item.category}
        nickname={item.nickname}
        itemPhotoUrl={item.itemPhotoUrl}
        status={item.status}
        onSent={() => setStep("sent")}
        onRateLimited={() => setStep("rateLimit")}
        onBlocked={() => setStep("blocked")}
        onNetworkError={() => setStep("network")}
      />
    );
  }

  // Every remaining step (invalid, dnd, tooManyAttempts, rateLimit, blocked, network, sent)
  // renders through the same error/status component.
  return (
    <ItemErrorState
      type={step}
      onRetry={fetchItem}
      onClose={() => (step === "sent" ? window.close() : fetchItem())}
    />
  );
}
