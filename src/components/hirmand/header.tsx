import { useEffect, useState, type MouseEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Palette, X } from "lucide-react";
import { NAV, SITE, TEAM } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CallMenu } from "./call-menu";
import { BrandLogo } from "./logo";
import { scrollToId } from "./scroll";

type ThemeMode = "nocturne" | "ivory" | "forest";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("nocturne");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("hirmand-theme");
    const next: ThemeMode =
      saved === "ivory" || saved === "forest" || saved === "nocturne" ? saved : "nocturne";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("hirmand-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const cycleTheme = () => {
    setTheme((current) =>
      current === "nocturne" ? "ivory" : current === "ivory" ? "forest" : "nocturne",
    );
  };

  const themeLabel =
    theme === "nocturne" ? "تم شبانه" : theme === "ivory" ? "تم روشن" : "تم جنگلی";

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
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ) : (
              <Link key={item.id} to="/" hash={item.hash} onClick={(event) => goHash(event, item.hash)}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-switcher"
            onClick={cycleTheme}
            aria-label={"تغییر تم؛ " + themeLabel}
            title={"تغییر تم؛ " + themeLabel}
          >
            <Palette size={18} strokeWidth={1.8} aria-hidden="true" />
            <span className="theme-switcher-label">{themeLabel}</span>
          </button>

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
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={cn("mobile-menu", menuOpen && "is-open")} aria-hidden={!menuOpen} inert={!menuOpen}>
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
        <button type="button" className="theme-switcher mobile-theme-switcher" onClick={cycleTheme}>
          <Palette size={17} strokeWidth={1.8} />
          <span>{themeLabel}</span>
          <small>تغییر</small>
        </button>
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