import React from "react";
import Button from "../ui/Button";

export default function StatusActions({
  showRetry,
  onRetry,
  onClose,
  isSuccess,
}) {
  return (
    <div className="space-y-3">
      {showRetry && onRetry && (
        <Button variant="primary" size="lg" fullWidth onClick={onRetry}>
          Try Again
        </Button>
      )}
      {onClose && (
        <Button variant="primary" size="lg" fullWidth onClick={onClose}>
          {isSuccess ? "Done" : "Go Back"}
        </Button>
      )}
      {isSuccess && (
        <p className="text-sm text-[#94A3B8] mt-4">
          You can safely close this page now.
        </p>
      )}
    </div>
  );
}
