import React from "react";
import BrandHeader from "../../components/finder/BrandHeader";
import ItemSummaryCard from "../../components/finder/ItemSummaryCard";
import Button from "../../components/ui/Button";

export default function ItemLandingCard({
  category,
  nickname,
  itemPhotoUrl,
  status,
  onContinue,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-white flex flex-col">
      <BrandHeader />

      {/* <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto px-6 pb-16"> */}
      <div className="flex-1 flex flex-col max-w-md w-full mx-auto px-6 pt-4 pb-10">
        <ItemSummaryCard
          category={category}
          nickname={nickname}
          itemPhotoUrl={itemPhotoUrl}
          status={status}
        />

        <p className="text-center text-[#64748B] text-sm leading-relaxed mt-6 mb-8 px-2">
          This item is registered with{" "}
          <span className="font-medium text-[#0B1C2D]">Notifyr</span>. Send the
          owner a private, anonymous message — no account needed.
        </p>

        <Button variant="primary" size="lg" fullWidth onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
