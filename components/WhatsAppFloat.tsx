import { MessageCircle } from "lucide-react";
import { ICON_STROKE } from "./Icon";

/** Small floating WhatsApp click-to-chat button, shown on mobile only. */
export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <aside aria-label="Quick contact" className="md:hidden">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Pytron Digital on WhatsApp (opens in a new tab)"
      className="fixed right-4 bottom-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#167a41] text-white shadow-[0_8px_24px_-6px_rgb(0_0_0/0.35)] transition-transform hover:scale-105 md:hidden"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={ICON_STROKE} aria-hidden="true" />
    </a>
    </aside>
  );
}
