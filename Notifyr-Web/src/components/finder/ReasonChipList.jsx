import React from "react";
import ReasonChip from "./ReasonChip";

// Generic across every category now that vehicles are out of scope — same
// "Found This / Left Behind / Damaged" set the original spec defined for
// non-vehicle items.
export const presetReasons = [
  { id: "found_item", label: "Found This Item" },
  { id: "left_behind", label: "Left Behind" },
  { id: "damaged", label: "Item Looks Damaged" },
];

export default function ReasonChipList({ selected, onSelect }) {
  return (
    <div className="space-y-4">
      {presetReasons.map((reason) => (
        <ReasonChip
          key={reason.id}
          label={reason.label}
          selected={selected === reason.id}
          onClick={() => onSelect(reason.id)}
        />
      ))}
    </div>
  );
}
