import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpLeft, MapPin, PhoneCall } from "lucide-react";
import { SITE } from "@/lib/site";
import { BrandLogo } from "./logo";
import { scrollToId } from "./scroll";
import { EitaaIcon, InstagramIcon, TelegramIcon, WhatsAppIcon } from "./social-icons";
import type { MouseEvent } from "react";

export function Footer() {
  const onHome = useRouterState({ select: (s) => s.location.pathname === "/" });
  const year = new Date().getFullYear();

  const socials = [
    { href: SITE.instagram, label: "اینستاگرام هیرمند", Icon: InstagramIcon },
    { href: SITE.telegram, label: "تلگرام هیرمند", Icon: TelegramIcon },
    { href: SITE.eitaa, label: "ایتا هیرمند", Icon: EitaaIcon },
    { href: SITE.whatsappDirect, label: "واتساپ هیرمند", Icon: WhatsAppIcon },
  ] as const;

  const handleHomeHash = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (onHome) scrollToId(event, id);
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <BrandLogo size="footer" />
          <span className="footer-index">HIRMAND / ISFAHAN</span>
          <h3>{SITE.nameFa}</h3>
          <p className="footer-managed">{SITE.managedBy}</p>
          <p>{SITE.tagline}</p>
        </div>

        <div className="footer-column">
          <span className="footer-label">دسترسی سریع</span>
          <nav className="footer-links" aria-label="لینک‌های فوتر">
            <Link to="/properties">همه فایل‌ها</Link>
            <Link to="/" hash="about" onClick={(event) => handleHomeHash(event, "about")}>درباره ما</Link>
            <Link to="/" hash="services" onClick={(event) => handleHomeHash(event, "services")}>خدمات</Link>
            <Link to="/" hash="tools" onClick={(event) => handleHomeHash(event, "tools")}>ابزار مالی</Link>
            <Link to="/tracking">باشگاه همکاران</Link>
            <Link to="/favorites">نشان‌شده‌ها</Link>
          </nav>
        </div>

        <div className="footer-column footer-contact">
          <span className="footer-label">ارتباط با هیرمند</span>
          <a href={"tel:" + SITE.phone.office}>
            <PhoneCall size={16} />
            <span dir="ltr">{SITE.phone.officeDisplay}</span>
          </a>
          <span>
            <MapPin size={16} />
            <span>{SITE.address}</span>
          </span>
          <div className="footer-socials" aria-label="شبکه‌های اجتماعی">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                className="footer-social-chip"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} {SITE.nameFa} — تمامی حقوق محفوظ است</span>
        <Link to="/" hash="top" onClick={(event) => handleHomeHash(event, "top")} className="footer-back-top">
          بازگشت به بالا
          <ArrowUpLeft size={16} />
        </Link>
      </div>
    </footer>
  );
}