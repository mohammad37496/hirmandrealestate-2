import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FileKey, MessageCircle, Phone } from "lucide-react";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { CallMenu } from "./call-menu";
import { Footer } from "./footer";
import { MusicPlayer } from "./music-player";
import { Header } from "./header";
import { scrollToId } from "./scroll";
import { VisitorTracker } from "./visitor-tracker";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { SiteUtilities } from "./site-utilities";

/**
 * Shared site chrome — header, quick actions, footer, helpers.
 * `skipTo` lets inner pages point the skip link at their own <main id>;
 * without it a user skipping to "#top" lands before the content.
 */
export function SiteChrome({
  children,
  className,
  skipTo,
}: {
  children: ReactNode;
  className?: string;
  /** DOM id of the page's <main>, e.g. "properties-main". */
  skipTo?: string;
}) {
  return (
    <>
      <a className="skip-link" href={`#${skipTo ?? "top"}`} onClick={(event) => scrollToId(event, skipTo ?? "top")}>
        رفتن به محتوا
      </a>
      <Header />
      <VisitorTracker />
      <div className={cn("page", className)}>{children}</div>
      <Footer />
      <div className="quick-actions" aria-label="اقدام سریع">
        <Link to="/properties" className="quick-action">
          <FileKey size={17} />
          <span>فایل‌ها</span>
        </Link>
        <Link to="/" hash="inquiry" className="quick-action quick-action-primary" onClick={() => trackAnalyticsEvent("inquiry_click")}>
          <MessageCircle size={17} />
          <span>درخواست ملک</span>
        </Link>
        <a
          href={SITE.whatsappDirect}
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action"
          onClick={() => trackAnalyticsEvent("whatsapp_click")}
        >
          <MessageCircle size={17} />
          <span>واتساپ</span>
        </a>
        <a
          href={`tel:${SITE.phone.mobile}`}
          className="quick-action"
          onClick={() => trackAnalyticsEvent("call_click")}
        >
          <Phone size={17} />
          <span>تماس</span>
        </a>
      </div>
      <SiteUtilities />
      <CallMenu className="floating-call-menu" buttonClassName="floating-call" label="تماس" />
      <MusicPlayer />
      <Toaster
        dir="rtl"
        position="top-center"
        theme="light"
        offset={88}
        visibleToasts={2}
        toastOptions={{ className: "hirmand-toast", duration: 2400 }}
      />
    </>
  );
}
