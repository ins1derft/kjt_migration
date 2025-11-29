import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Menu, MenuItem } from "@/lib/menus";

type MenuLink = {
  label: string;
  href: string;
  icon?: string | null;
  targetBlank?: boolean;
};

type FooterColumn = {
  label: string;
  links: MenuLink[];
};

type SocialIconCode = "f" | "ig" | "in" | "yt";

function mapMenuItemToLink(item: MenuItem): MenuLink {
  return {
    label: item.label,
    href: item.url,
    icon: item.icon,
    targetBlank: item.opens_in_new_tab,
  };
}

function footerColumns(menu: Menu | null | undefined): FooterColumn[] {
  if (!menu || !menu.items) return [];

  const columns = (menu.items ?? [])
    .filter((item) => (item.slot ?? "footer") !== "social")
    .map((item) => {
      const children = item.children ?? [];

      if (children.length > 0) {
        return {
          label: item.label,
          links: children.map(mapMenuItemToLink),
        };
      }

      return {
        label: item.label,
        links: [mapMenuItemToLink(item)],
      };
    });

  return columns;
}

function socialLinks(menu: Menu | null | undefined): MenuLink[] {
  if (!menu) return [];
  const social = (menu.items ?? []).filter((item) => (item.slot ?? "primary") === "social");
  return social.map(mapMenuItemToLink);
}

function LocationIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12.8a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M18.7 10.3c0 4.2-4.6 8.4-6 9.5a.9.9 0 0 1-1.4 0c-1.4-1.1-6-5.3-6-9.5a6.7 6.7 0 1 1 13.4 0Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6.5c0-.8.7-1.5 1.5-1.5h13c.8 0 1.5.7 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="m5 8 7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M8.4 3.2 6.2 5.7c-.3.4-.4 1-.2 1.5.9 2.3 2.4 4.4 4.3 6.3 1.9 1.9 4 3.4 6.3 4.3.5.2 1.1.1 1.5-.2l2.5-2.2a1 1 0 0 0 .1-1.4l-1.8-2.2a1 1 0 0 0-1.2-.3l-2.1.9a1 1 0 0 1-1-.1l-.6-.5a13 13 0 0 1-3.2-3.2l-.5-.6a1 1 0 0 1-.1-1l.9-2.1a1 1 0 0 0-.3-1.2L9.8 3.1a1 1 0 0 0-1.4.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SocialGlyph({ code }: { code: SocialIconCode }) {
  if (code === "ig") {
    return (
      <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="4.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (code === "in") {
    return (
      <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M6.2 9.3V17m0-9.7a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4.4 9.4V12.7c0-.9.7-1.6 1.6-1.6v0c.9 0 1.6.7 1.6 1.6V17m-6 .3H18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (code === "yt") {
    return (
      <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M20.5 8.1a2.5 2.5 0 0 0-1.8-1.8C17.3 6 12 6 12 6s-5.3 0-6.7.3A2.5 2.5 0 0 0 3.5 8.1 26 26 0 0 0 3.2 12a26 26 0 0 0 .3 3.9 2.5 2.5 0 0 0 1.8 1.8C6.7 18 12 18 12 18s5.3 0 6.7-.3a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 20.8 12a26 26 0 0 0-.3-3.9Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="m10.5 9.5 4 2.5-4 2.5v-5Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 6.5c-.6.3-1.3.5-2 .6a3.5 3.5 0 0 0-6 2.4v.8A8.8 8.8 0 0 1 4.2 6s-3 6 3.6 8.8a9 9 0 0 1-5 1.4c6.6 3.7 14.6 0 14.6-8.4 0-.2 0-.4-.1-.6A3.6 3.6 0 0 0 21 6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

type FooterProps = {
  menu?: Menu | null;
};

export default function SiteFooter({ menu }: FooterProps) {
  const columns = footerColumns(menu);
  const socials = socialLinks(menu);

  return (
    <footer className="mt-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50" id="contact">
      <div className="section-shell grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Badge variant="secondary" className="bg-white/10 text-slate-100">
            About Us
          </Badge>
          <p className="leading-relaxed text-slate-200">
            Kids Jump Tech builds interactive equipment that turns any room into an active learning space. We deliver
            turn-key systems, continual game updates, and remote support so your team can focus on the experience.
          </p>
        </div>

        <div className="space-y-3">
          <Badge variant="secondary" className="bg-white/10 text-slate-100">
            Contact Us
          </Badge>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 text-slate-200">
              <LocationIcon />
              <span>150 NW 176th st., unit E, Miami, FL, 33169</span>
            </li>
            <li className="flex items-center gap-2 text-slate-200">
              <PhoneIcon />
              <Link href="tel:+18779010110" className="font-semibold text-white hover:underline">
                (877) 901-0110
              </Link>
              <span className="text-xs text-slate-400">Toll free</span>
            </li>
            <li className="flex items-center gap-2 text-slate-200">
              <PhoneIcon />
              <Link href="https://wa.me/15613828555" target="_blank" rel="noreferrer" className="font-semibold text-white hover:underline">
                +1 (561) 382-8555
              </Link>
              <span className="text-xs text-slate-400">WhatsApp</span>
            </li>
            <li className="flex items-center gap-2 text-slate-200">
              <MailIcon />
              <Link href="mailto:info@kidsjumptech.com" className="font-semibold text-white hover:underline">
                info@kidsjumptech.com
              </Link>
            </li>
            <li className="flex items-center gap-2 text-slate-200">
              <ClockIcon />
              <span>Mon – Sat: 8 AM – 7 PM</span>
            </li>
          </ul>
        </div>

        {columns.map((column) => (
          <div key={column.label} className="space-y-3">
            <Badge variant="secondary" className="bg-white/10 text-slate-100">
              {column.label}
            </Badge>
            <div className="grid gap-2 text-slate-200">
              {column.links.map((link) => (
                <Link
                  key={`${column.label}-${link.label}`}
                  href={link.href}
                  className="font-semibold hover:text-white"
                  target={link.targetBlank ? "_blank" : undefined}
                  rel={link.targetBlank ? "noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {socials.length > 0 && (
          <div className="space-y-3">
            <Badge variant="secondary" className="bg-white/10 text-slate-100">
              Connect
            </Badge>
            <div className="flex items-center gap-2">
              {socials.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  target={link.targetBlank ? "_blank" : undefined}
                  rel={link.targetBlank ? "noreferrer" : undefined}
                >
                  <SocialGlyph code={(link.icon ?? "f") as SocialIconCode} />
                  <span className="sr-only">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container-shell flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <span>Copyright © 2025 KIDSjumpTECH. All rights reserved.</span>
        <span className="text-xs text-slate-400">Built for the demo stack · Nginx → Next.js + Laravel</span>
      </div>
    </footer>
  );
}
