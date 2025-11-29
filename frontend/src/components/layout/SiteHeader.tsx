import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Menu, MenuItem } from "@/lib/menus";

type MenuLink = {
  label: string;
  href: string;
  icon?: string | null;
  targetBlank?: boolean;
  children?: MenuLink[];
};

function mapMenuItemToLink(item: MenuItem): MenuLink {
  return {
    label: item.label,
    href: item.url,
    icon: item.icon,
    targetBlank: item.opens_in_new_tab,
    children: (item.children ?? []).map(mapMenuItemToLink),
  };
}

function linksBySlot(menu: Menu | null | undefined, slot: string): MenuLink[] {
  if (!menu || !menu.items) return [];

  return (menu.items ?? [])
    .filter((item) => (item.slot ?? "primary") === slot)
    .map(mapMenuItemToLink);
}

function navLinks(menu: Menu | null | undefined): MenuLink[] {
  return linksBySlot(menu, "primary");
}

type SocialIconCode = "f" | "ig" | "in" | "yt";

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

function WhatsappIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 19.2 5.4 16A7 7 0 1 1 12 19a7 7 0 0 1-3.4-.9l-2.1.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6 13.7c-.2-.1-1.2-.6-1.3-.7-.2-.1-.3-.1-.5.1-.1.2-.6.7-.7.8-.1.1-.3.1-.5 0-.2-.1-.8-.3-1.6-1-.6-.5-1-1.2-1.1-1.3-.1-.2 0-.3.1-.4l.3-.4.2-.4c.1-.2 0-.3 0-.4l-.7-1.7c-.2-.4-.3-.4-.4-.4l-.3-.1h-.4c-.1 0-.4 0-.6.3-.2.2-.8.8-.8 1.9 0 1 .8 2 1 2.3.1.2 1.6 2.5 3.9 3.4.5.2.8.3 1 .4.4.1.7.1 1 .1.3 0 .9-.2 1.1-.6.1-.4.4-.7.5-.8.1-.1.1-.3 0-.3-.1-.1-.4-.2-.6-.3Z"
        fill="currentColor"
      />
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

function LiveDemoArrow() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

type HeaderProps = {
  menu?: Menu | null;
};

export default function SiteHeader({ menu }: HeaderProps) {
  const topPrimaryLinks = linksBySlot(menu, "top_primary");
  const topSupportLinks = linksBySlot(menu, "top_secondary");
  const socialLinks = linksBySlot(menu, "social");
  const primaryNavLinks = navLinks(menu);

  return (
    <header className="sticky top-0 z-20">
      <div className="bg-primary text-primary-foreground">
        <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-2 text-sm">
          <nav className="flex flex-wrap items-center gap-3" aria-label="Secondary">
            {topPrimaryLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-semibold hover:underline" {...linkTarget(link)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-wrap items-center gap-3" aria-label="Support">
            {topSupportLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-semibold hover:underline" {...linkTarget(link)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2" aria-label="Social media">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
                target={link.targetBlank ? "_blank" : undefined}
                rel={link.targetBlank ? "noreferrer" : undefined}
              >
                <SocialGlyph code={(link.icon ?? "f") as SocialIconCode} />
                <span className="sr-only">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
        <div className="container-shell flex flex-wrap items-center gap-4 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="rounded-xl bg-gradient-to-r from-primary to-cyan-400 px-3 py-2 text-sm font-black text-primary-foreground shadow-md">
              KJT
            </span>
            <div className="leading-tight">
              <div className="text-base font-bold text-foreground">Kids Jump Tech</div>
              <div className="text-xs text-muted-foreground">Interactive equipment</div>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-foreground/90" aria-label="Primary">
            {primaryNavLinks.map((link) => {
              const hasChildren = (link.children?.length ?? 0) > 0;

              if (!hasChildren) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-md px-2 py-1 hover:text-primary"
                    {...linkTarget(link)}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <div key={link.label} className="group relative">
                  <Link
                    href={link.href}
                    className="rounded-md px-2 py-1 hover:text-primary"
                    {...linkTarget(link)}
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {link.label}
                  </Link>
                  <div className="absolute left-0 top-full z-30 mt-2 hidden min-w-[220px] rounded-lg border border-border bg-card p-2 shadow-xl group-hover:block group-focus-within:block">
                    {(link.children ?? []).map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/90 hover:bg-muted"
                        {...linkTarget(child)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-2 text-sm font-semibold text-foreground hover:border-primary"
                href="tel:+18779010110"
              >
                <PhoneIcon />
                <span>(877) 901-0110</span>
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-2 text-sm font-semibold text-foreground hover:border-primary"
                href="https://wa.me/15613828555"
                target="_blank"
                rel="noreferrer"
              >
                <WhatsappIcon />
                <span>WhatsApp</span>
              </Link>
            </div>
            <Button asChild className="shadow-lg" variant="default">
              <Link href="mailto:info@kidsjumptech.com?subject=Live%20demo%20request" className="inline-flex items-center gap-2">
                Live Demo
                <LiveDemoArrow />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function linkTarget(link: MenuLink) {
  return link.targetBlank
    ? {
        target: "_blank" as const,
        rel: "noreferrer",
      }
    : {};
}
