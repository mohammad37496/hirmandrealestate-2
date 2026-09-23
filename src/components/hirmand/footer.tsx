import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpLeft, MapPin, PhoneCall, Sparkles } from "lucide-react";
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
      <div className="footer-shell">
        <div className="footer-hero">
          <div className="footer-brand-block">
            <div className="footer-brand-mark-row">
              <div className="footer-brand-mark">
                <BrandLogo size="footer" />
              </div>
              <span className="footer-status">فعال در اصفهان</span>
            </div>

            <span className="footer-index">HIRMAND / ISFAHAN</span>
            <h3>{SITE.nameFa}</h3>
            <p className="footer-managed">{SITE.managedBy}</p>
            <p className="footer-brand-lede">{SITE.tagline}</p>

            <div className="footer-brand-points" aria-label="ویژگی‌های هیرمند">
              <span>مشاوره مستقیم</span>
              <span>فایل‌های منتخب</span>
              <span>مسیر تصمیم‌گیری روشن</span>
            </div>
          </div>

          <div className="footer-cta-card">
            <div className="footer-cta-icon" aria-hidden="true">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="footer-cta-eyebrow">قدم بعدی را ساده‌تر کنید</span>
              <strong>فایل مناسب را پیدا کنید یا مستقیم با مشاور هیرمند در تماس باشید.</strong>
            </div>
            <div className="footer-cta-actions">
              <Link to="/properties" className="footer-cta-primary">
                مشاهده فایل‌های فعال
              </Link>
              <a className="footer-cta-phone" href={"tel:" + SITE.phone.office} aria-label="تماس با هیرمند">
                <PhoneCall size={18} />
                <span dir="ltr">{SITE.phone.officeDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-main-grid">
          <div className="footer-column">
            <span className="footer-label">دسترسی سریع</span>
            <nav className="footer-links footer-links-rich" aria-label="لینک‌های فوتر">
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

            <a className="footer-contact-card" href={"tel:" + SITE.phone.office}>
              <span className="footer-contact-icon"><PhoneCall size={16} /></span>
              <span>
                <small>تلفن دفتر</small>
                <strong dir="ltr">{SITE.phone.officeDisplay}</strong>
              </span>
            </a>

            <div className="footer-contact-card footer-contact-static">
              <span className="footer-contact-icon"><MapPin size={16} /></span>
              <span>
                <small>نشانی</small>
                <strong>{SITE.address}</strong>
              </span>
            </div>

            <div className="footer-social-row">
              <span className="footer-social-caption">شبکه‌های اجتماعی</span>
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
        </div>

        <div className="footer-bottom">
          <span>© {year} {SITE.nameFa} — تمامی حقوق محفوظ است</span>
          <div className="footer-bottom-meta">
            <span>اصفهان · مشاوره تخصصی ملک</span>
            <Link to="/" hash="top" onClick={(event) => handleHomeHash(event, "top")} className="footer-back-top">
              بازگشت به بالا
              <ArrowUpLeft size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
