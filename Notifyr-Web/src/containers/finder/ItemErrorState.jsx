import React from "react";
import Card from "@/components/ui/Card";
import PrivacyNote from "../../components/finder/PrivacyNote";
import StatusIcon from "../../components/finder/StatusIcon";
import StatusMessageBox from "../../components/finder/StatusMessageBox";
import StatusActions from "../../components/finder/StatusActions";
import { statusConfigs } from "../../components/finder/statusConfigs";

export default function ItemErrorState({ type, onRetry, onClose }) {
  const config = statusConfigs[type] || statusConfigs.network;
  const isSuccess = type === "sent";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center bg-white border border-border rounded-2xl shadow-sm p-6">
        <StatusIcon icon={config.icon} gradient={config.iconColor} />

        <h1 className="text-2xl font-semibold text-foreground mb-3">
          {config.title}
        </h1>

        <StatusMessageBox
          bgColor={config.bgColor}
          borderColor={config.borderColor}
          textColor={config.textColor}
          message={config.message}
        />

        <StatusActions
          showRetry={config.showRetry}
          onRetry={onRetry}
          onClose={onClose}
          isSuccess={isSuccess}
        />

        {isSuccess && (
          <div className="mt-6 pt-5 border-t border-border">
            <PrivacyNote />
          </div>
        )}
      </Card>
    </div>
  );
}
