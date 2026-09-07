import React, { useState } from "react";
import ReasonChipList from "../../components/finder/ReasonChipList";
import FreeTextNote from "../../components/finder/FreeTextNote";
import LocationToggle from "../../components/finder/LocationToggle";
import PrivacyNote from "../../components/finder/PrivacyNote";
import { getOneTimeLocation } from "../../hooks/useGeolocation";
import BackButton from "../../components/ui/BackButton";
import ItemSummaryCard from "../../components/finder/ItemSummaryCard";

export default function ItemMessageForm({
  qrId,
  sessionToken,
  onBack,
  category,
  nickname,
  itemPhotoUrl,
  status,
  onSent,
  onRateLimited,
  onBlocked,
  onNetworkError,
}) {
  const [selectedReason, setSelectedReason] = useState(null);
  const [freeText, setFreeText] = useState("");
  const [shareLocation, setShareLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canSend = selectedReason && !isLoading;

  const handleSend = async () => {
    if (!canSend) return;
    setIsLoading(true);

    try {
      const location = shareLocation ? await getOneTimeLocation() : null;

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/public/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qrId,
            sessionToken,
            presetType: selectedReason,
            freeText: freeText.trim() || undefined,
            location: location || undefined,
          }),
        },
      );

      const data = await res.json();

      if (res.status === 429) return onRateLimited();
      if (res.status === 422) return onBlocked();
      if (!res.ok) {
        console.error("Send failed:", data.error);
        return onNetworkError();
      }

      onSent();
    } catch (err) {
      console.error("Send error:", err);
      onNetworkError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="max-w-xl mx-auto px-6 pt-8 pb-5">
        <BackButton onClick={onBack} />
      </header>
      <div className="max-w-xl mx-auto px-6 mb-8">
        <ItemSummaryCard
          category={category}
          nickname={nickname}
          itemPhotoUrl={itemPhotoUrl}
          status={status}
        />
      </div>

      <div className="max-w-xl mx-auto px-2 pb-10">
        <h2 className="text-[#0B1C2D] font-semibold pl-2.5 mb-4">
          Why are you contacting the owner?
        </h2>
        <ReasonChipList
          selected={selectedReason}
          onSelect={setSelectedReason}
        />

        <div className="mt-6">
          <h2 className="text-[#0B1C2D] font-semibold pl-2.5 mb-3">
            Add a note (optional)
          </h2>
          <FreeTextNote value={freeText} onChange={setFreeText} />
        </div>

        <div className="mt-4">
          <LocationToggle
            enabled={shareLocation}
            onToggle={() => setShareLocation((v) => !v)}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className="mt-6 w-full h-14 rounded-2xl font-semibold bg-[#0B1C2D] text-white hover:bg-[#112A46] transition disabled:opacity-40"
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>

        <PrivacyNote />
      </div>
    </div>
  );
}
