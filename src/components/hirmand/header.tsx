import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { NAV, SITE, TEAM } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CallMenu } from "./call-menu";
import { BrandLogo } from "./logo";
import { scrollToId } from "./scroll";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuWasOpen = useRef(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locationHash = useRouterState({ select: (s) => s.location.hash });
  const onHome = pathname === "/";
  // Active state for in-page section links (e.g. /#services) so the desktop
  // nav reflects where the visitor actually is on the homepage.
  const hashActive = typeof locationHash === "string" ? locationHash : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The refined theme ships a single polished "day" palette; retire the
  // legacy multi-theme attribute so the unified token set always wins.
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.removeItem("hirmand-theme");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  // Close the mobile menu with Escape, like any other disclosure — and return
  // focus to the toggle so keyboard users are not dropped at <body>.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Restore focus to the toggle only after a real close (keyboard users who
  // dismissed with Escape are not dropped at <body>). The was-open guard stops
  // the first mount from yanking focus into the hidden mobile menu button.
  useEffect(() => {
    if (menuOpen) {
      menuWasOpen.current = true;
      return;
    }
    if (!menuWasOpen.current) return;
    menuWasOpen.current = false;
    if (document.activeElement === document.body) {
      menuToggleRef.current?.focus();
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  function goHash(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (onHome) {
      scrollToId(event, id, closeMenu);
      return;
    }
    closeMenu();
  }

  return (
    <header className={cn("site-nav", (scrolled || !onHome) && "is-scrolled")}>
      <div className="site-nav-inner">
        <Link to="/" hash="top" className="nav-brand" onClick={(event) => goHash(event, "top")}>
          <BrandLogo size="nav" />
          <span>
            <strong>{SITE.shortName}</strong>
            <small>{SITE.managedBy}</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="بخش‌های صفحه">
          {NAV.map((item) =>
            item.to === "/properties" ? (
              <Link
                key={item.id}
                to="/properties"
                className={cn(pathname === "/properties" && "is-current")}
                aria-current={pathname === "/properties" ? "page" : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.id}
                to="/"
                hash={item.hash}
                className={cn(onHome && hashActive === item.hash && "is-current")}
                onClick={(event) => goHash(event, item.hash)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="nav-actions">
          <Link
            to="/"
            hash="inquiry"
            className="header-inquiry"
            onClick={(event) => {
              if (onHome) scrollToId(event, "inquiry", closeMenu);
              else closeMenu();
            }}
          >
            درخواست ملک
          </Link>

          <CallMenu className="nav-call-menu" buttonClassName="nav-call" align="end" />

          <button
            ref={menuToggleRef}
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={cn("mobile-menu", menuOpen && "is-open")}
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {NAV.map((item) =>
          item.to === "/properties" ? (
            <Link key={item.id} to="/properties" onClick={closeMenu}>
              {item.label}
            </Link>
          ) : (
            <Link key={item.id} to="/" hash={item.hash} onClick={(event) => goHash(event, item.hash)}>
              {item.label}
            </Link>
          ),
        )}
        <Link
          to="/"
          hash="inquiry"
          className="mobile-call mobile-request"
          onClick={(event) => {
            if (onHome) scrollToId(event, "inquiry", closeMenu);
            else closeMenu();
          }}
        >
          درخواست ملک
        </Link>
        <div className="mobile-call-list">
          {TEAM.map((person) => (
            <a
              key={person.id}
              className="mobile-call"
              href={"tel:" + person.phone}
              onClick={closeMenu}
            >
              تماس با {person.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}