import { SOCIAL_LINKS } from "@/lib/constants";
import { FaFacebook, FaYoutube, FaInstagram, FaTwitch } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socials = [
  { icon: FaFacebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
  { icon: FaYoutube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
  { icon: FaInstagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: FaTwitch, href: SOCIAL_LINKS.twitch, label: "Twitch" },
  { icon: FaXTwitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-text-muted hover:text-accent transition-colors"
            >
              <s.icon size={22} />
            </a>
          ))}
        </div>
        <p className="text-center text-text-muted text-xs mt-4">
          &copy; {new Date().getFullYear()} LifeWithTone
        </p>
      </div>
    </footer>
  );
}
