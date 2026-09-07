import React from "react";
import CategoryIcon from "./CategoryIcon";
import StatusBadge from "./StatusBadge";

export default function ItemSummaryCard({
  category,
  nickname,
  itemPhotoUrl,
  status,
}) {
  return (
    <div className="bg-white border-2 border-[#0B1C2D] rounded-3xl shadow-md p-5">
      <div className="flex items-start gap-4">
        {itemPhotoUrl ? (
          <img
            src={itemPhotoUrl}
            alt={nickname}
            className="w-18 h-18 rounded-2xl object-cover border border-[#CBD5E1] flex-shrink-0"
          />
        ) : (
          <div className="w-18 h-18 rounded-2xl bg-[#FEF7E0] flex items-center justify-center flex-shrink-0">
            <CategoryIcon
              category={category}
              className="w-8 h-8 text-[#C9971C]"
            />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#0B1C2D]">{nickname}</h3>

          <p className="mt-1 text-sm capitalize tracking-wide text-[#64748B]">
            {category}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Lost Message */}
      {status === "lost" && (
        <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
          <p className="text-sm text-[#9A3412]">
            Reported lost — please help reunite it with its owner.
          </p>
        </div>
      )}
    </div>
  );
}
