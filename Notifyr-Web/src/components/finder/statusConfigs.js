import {
  AlertCircle,
  XCircle,
  Moon,
  AlertTriangle,
  Wifi,
  CheckCircle2,
} from "lucide-react";

// Maps directly to our backend's actual error codes / states — no vehicle
// wording, no plate numbers, generic across every item category.
export const statusConfigs = {
  invalid: {
    icon: XCircle,
    iconColor: "from-red-500 to-rose-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    title: "Code Not Recognized",
    message:
      "This QR code isn't registered with Notifyr. Only authentic tags issued through the pilot are valid.",
    showRetry: false,
  },
  dnd: {
    icon: Moon,
    iconColor: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    title: "Owner Currently Unavailable",
    message:
      "The owner isn't accepting messages right now. Please try again later.",
    showRetry: false,
  },
  tooManyAttempts: {
    icon: AlertTriangle,
    iconColor: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    title: "Too Many Attempts",
    message:
      "You've entered the wrong code too many times. Please wait a while before trying again.",
    showRetry: false,
  },
  rateLimit: {
    icon: AlertTriangle,
    iconColor: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    title: "Message Already Sent",
    message:
      "You've already messaged about this item recently. Please wait before sending another.",
    showRetry: false,
  },
  blocked: {
    icon: XCircle,
    iconColor: "from-slate-400 to-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-700",
    title: "Message Not Delivered",
    message: "Your message couldn't be delivered. Please try again later.",
    showRetry: false,
  },
  network: {
    icon: Wifi,
    iconColor: "from-slate-400 to-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-700",
    title: "Connection Error",
    message: "Unable to reach the server. Check your connection and try again.",
    showRetry: true,
  },
  sent: {
    icon: CheckCircle2,
    iconColor: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    title: "Message Sent",
    message: "The owner has been notified. They may reach out if needed.",
    showRetry: false,
  },
};
