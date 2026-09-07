import React, { useState } from "react";
import PinInput from "../../components/finder/PinInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BackButton from "@/components/ui/BackButton";

export default function ItemVerifyForm({
  qrId,
  onBack,
  onVerified,
  onTooManyAttempts,
  onNetworkError,
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/public/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qrId, input: input.trim() }),
        },
      );

      if (res.status === 429) {
        onTooManyAttempts();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Something went wrong");
        return;
      }

      if (!data.verified) {
        setError(
          `Incorrect code. ${data.attemptsRemaining} attempt(s) remaining.`,
        );
        return;
      }

      onVerified(data.sessionToken);
    } catch (err) {
      console.error("Verify error:", err);
      onNetworkError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-white border border-border rounded-2xl shadow-sm p-6">
        <BackButton onClick={onBack} />
        <h1 className="text-xl font-semibold text-[#0B1C2D] mb-2">
          Confirm You Found This
        </h1>
        <p className="text-sm text-[#64748B] mb-6">
          Enter the code printed on the tag to continue.
        </p>

        <PinInput value={input} onChange={setInput} error={error} />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleVerify}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? "Checking..." : "Verify"}
        </Button>
      </Card>
    </div>
  );
}
