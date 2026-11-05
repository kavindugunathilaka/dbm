import { site, whatsappLink } from "@/lib/site";

// Thumb-zone actions, mobile only. Sits above the iOS home indicator.
export function MobileActionBar() {
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-bold";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="flex h-16">
        <a href={`tel:${site.phones[0].e164}`} className={item}>
          <PhoneIcon /> Call
        </a>
        <a href={whatsappLink()} className={`${item} text-[#128c4a]`} target="_blank" rel="noopener">
          <ChatIcon /> WhatsApp
        </a>
        <a href="/#contact" className={`${item} m-1.5 rounded-xl bg-brand text-white`}>
          <FormIcon /> Get Quote
        </a>
      </div>
    </nav>
  );
}

const iconProps = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}
function FormIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </svg>
  );
}
