"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (prevTotalRef.current !== totalItems) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 400);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinkStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 600,
    fontSize: "15px",
    color: "#1a1a1a",
    letterSpacing: "0.02em",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
    position: "relative",
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "72px",
          background: "#faf7f2",
          boxShadow: scrolled
            ? "0 2px 16px rgba(26,26,26,0.10)"
            : "0 1px 4px rgba(26,26,26,0.06)",
          transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => { setMenuOpen(false); router.push("/"); }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
            aria-label="Ballpoint Trust — go to homepage"
          >
            {/* Pen icon SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="28" height="28" rx="8" fill="#c97e4a" />
              <path
                d="M8 20L10.5 14L18 6.5L21.5 10L14 17.5L8 20Z"
                fill="#faf7f2"
                stroke="#faf7f2"
                strokeWidth="0.5"
              />
              <path
                d="M8 20L9.5 17.5L10.5 19.5L8 20Z"
                fill="#1a1a1a"
              />
              <path
                d="M18 6.5L21.5 10L20 11.5L16.5 8L18 6.5Z"
                fill="#b09a82"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontWeight: 700,
                fontSize: "22px",
                color: "#1a1a1a",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              Ballpoint Trust
            </span>
          </button>

          {/* Desktop nav links */}
          <nav
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="hidden-mobile"
          >
            <button
              style={navLinkStyle}
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#c97e4a";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,126,74,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              Shop
            </button>
            <button
              style={navLinkStyle}
              onClick={() => scrollToSection("bundles")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#c97e4a";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,126,74,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              Bundles
            </button>
            <button
              style={navLinkStyle}
              onClick={() => scrollToSection("about")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#c97e4a";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,126,74,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              Our Story
            </button>
            <button
              style={navLinkStyle}
              onClick={() => scrollToSection("contact")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#c97e4a";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,126,74,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              Contact
            </button>
          </nav>

          {/* Right side: Cart + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Cart button */}
            <button
              onClick={() => router.push("/checkout")}
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,126,74,0.10)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #c97e4a";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  aria-live="polite"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    minWidth: "16px",
                    height: "16px",
                    borderRadius: "9999px",
                    background: "#c97e4a",
                    color: "#faf7f2",
                    fontSize: "10px",
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                    transform: badgePulse ? "scale(1.35)" : "scale(1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="show-mobile"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,126,74,0.10)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #c97e4a";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {menuOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: "fixed",
          top: "72px",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#faf7f2",
          zIndex: 49,
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
          gap: "8px",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
        className="mobile-menu-overlay"
      >
        <button
          onClick={() => { setMenuOpen(false); router.push("/shop"); }}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "32px",
            letterSpacing: "0.04em",
            color: "#1a1a1a",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "12px 0",
            borderBottom: "1px solid rgba(176,154,130,0.3)",
            transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#c97e4a")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a")}
        >
          Shop
        </button>
        <button
          onClick={() => scrollToSection("bundles")}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "32px",
            letterSpacing: "0.04em",
            color: "#1a1a1a",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "12px 0",
            borderBottom: "1px solid rgba(176,154,130,0.3)",
            transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#c97e4a")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a")}
        >
          Bundles
        </button>
        <button
          onClick={() => scrollToSection("about")}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "32px",
            letterSpacing: "0.04em",
            color: "#1a1a1a",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "12px 0",
            borderBottom: "1px solid rgba(176,154,130,0.3)",
            transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#c97e4a")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a")}
        >
          Our Story
        </button>
        <button
          onClick={() => scrollToSection("contact")}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "32px",
            letterSpacing: "0.04em",
            color: "#1a1a1a",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "12px 0",
            borderBottom: "1px solid rgba(176,154,130,0.3)",
            transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#c97e4a")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a")}
        >
          Contact
        </button>

        <div style={{ marginTop: "auto", paddingTop: "24px" }}>
          <button
            onClick={() => router.push("/checkout")}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "#c97e4a",
              color: "#faf7f2",
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
            onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
            onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            View Cart
            {totalItems > 0 && (
              <span
                style={{
                  background: "#faf7f2",
                  color: "#c97e4a",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "2px 7px",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Responsive CSS via globals injection note: place these in globals.css */}
      {/* We use className hooks below; matching styles must be in globals.css */}
    </>
  );
}