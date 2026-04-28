import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";
import { FaFacebook, FaYoutube, FaInstagram, FaTwitch } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socials = [
  { id: "fb", icon: FaFacebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
  { id: "yt", icon: FaYoutube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
  { id: "ig", icon: FaInstagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { id: "tw", icon: FaTwitch, href: SOCIAL_LINKS.twitch, label: "Twitch" },
  { id: "x", icon: FaXTwitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="lwt-footer">
      <div className="lwt-footer-meta">
        <b>LifeWithTone</b> — © {year}. Words & pictures by Tone.
        <Link
          href="/admin/login"
          className="lwt-admin-dot"
          aria-label="Admin"
          title="Admin"
          data-cursor-label="Admin"
        />
      </div>
      <div className="lwt-socials">
        {socials.map((s) => (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="lwt-social"
            aria-label={s.label}
            data-cursor-label={s.label}
          >
            <s.icon size={16} />
          </a>
        ))}
      </div>
    </footer>
  );
}
