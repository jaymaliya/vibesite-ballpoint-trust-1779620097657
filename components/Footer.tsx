"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  };

  const quickLinkStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 500,
    fontSize: "15px",
    color: "#b09a82",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    textAlign: "left",
    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
    display: "block",
  };

  return (
    <footer
      id="contact"
      style={{
        background: "#1a1a1a",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <svg
                width="32"
                height="32"
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
                <path d="M8 20L9.5 17.5L10.5 19.5L8 20Z" fill="#1a1a1a" />
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
                  color: "#faf7f2",
                  letterSpacing: "0.04em",
                }}
              >
                Ballpoint Trust
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#b09a82",
                lineHeight: 1.7,
                marginBottom: "16px",
                maxWidth: "260px",
              }}
            >
              Write more. Spend less. Always.
              <br />
              Quality ballpoint pens from ₹2 — Made in India.
            </p>

            {/* Trust pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Made in India", "From ₹2/pen", "Free Shipping ₹199+"].map(
                (label) => (
                  <span
                    key={label}
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 600,
                      fontSize: "11px",
                      color: "#c97e4a",
                      background: "rgba(201,126,74,0.12)",
                      borderRadius: "9999px",
                      padding: "4px 10px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Quick links column */}
          <div>
            <h3
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "18px",
                letterSpacing: "0.06em",
                color: "#faf7f2",
                marginBottom: "20px",
              }}
            >
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <button
                style={quickLinkStyle}
                onClick={() => router.push("/")}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#c97e4a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#b09a82")
                }
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline =
                    "2px solid #c97e4a";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Home
              </button>
              <button
                style={{ ...quickLinkStyle, marginTop: "8px" }}
                onClick={() => router.push("/shop")}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#c97e4a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#b09a82")
                }
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline =
                    "2px solid #c97e4a";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Shop All Pens
              </button>
              <button
                style={{ ...quickLinkStyle, marginTop: "8px" }}
                onClick={() => router.push("/checkout")}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#c97e4a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#b09a82")
                }
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline =
                    "2px solid #c97e4a";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Checkout
              </button>
              <a
                href="mailto:maliyajay77@gmail.com"
                style={{
                  ...quickLinkStyle,
                  marginTop: "8px",
                  textDecoration: "none",
                  display: "block",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#c97e4a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#b09a82")
                }
              >
                Contact Us
              </a>
            </nav>
          </div>

          {/* Contact info column */}
          <div>
            <h3
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "18px",
                letterSpacing: "0.06em",
                color: "#faf7f2",
                marginBottom: "20px",
              }}
            >
              Get in Touch
            </h3>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "14px",
                color: "#b09a82",
                lineHeight: 1.7,
                marginBottom: "12px",
              }}
            >
              Questions about orders, bulk pricing, or custom pens?
            </p>
            <a
              href="mailto:maliyajay77@gmail.com"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: "#c97e4a",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#faf7f2")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#c97e4a")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              maliyajay77@gmail.com
            </a>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "12px" }}>
              {/* Instagram */}
              <a
                href="/"
                aria-label="Ballpoint Trust on Instagram"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(201,126,74,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#b09a82",
                  textDecoration: "none",
                  transition: "background 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(201,126,74,0.25)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#c97e4a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(201,126,74,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#b09a82";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="/"
                aria-label="Ballpoint Trust on Twitter"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(201,126,74,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#b09a82",
                  textDecoration: "none",
                  transition: "background 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(201,126,74,0.25)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#c97e4a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(201,126,74,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#b09a82";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/91?text=Hi%2C%20I%20want%20to%20order%20pens%20from%20Ballpoint%20Trust"
                aria-label="Contact Ballpoint Trust on WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(201,126,74,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#b09a82",
                  textDecoration: "none",
                  transition: "background 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(201,126,74,0.25)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#c97e4a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(201,126,74,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#b09a82";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Newsletter column */}
          <div>
            <h3
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "18px",
                letterSpacing: "0.06em",
                color: "#faf7f2",
                marginBottom: "12px",
              }}
            >
              Stay Updated
            </h3>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "14px",
                color: "#b09a82",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}
            >
              Get pen deals, bundle offers, and restocks delivered to your inbox.
            </p>

            {subscribed ? (
              <div
                style={{
                  background: "rgba(201,126,74,0.12)",
                  border: "1px solid rgba(201,126,74,0.3)",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c97e4a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "14px",
                    color: "#c97e4a",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  You&apos;re subscribed!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="your@email.com"
                    aria-label="Email address for newsletter"
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "14px",
                      color: "#faf7f2",
                      background: "rgba(255,255,255,0.07)",
                      border: emailError
                        ? "1.5px solid #c97e4a"
                        : "1.5px solid rgba(176,154,130,0.3)",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      outline: "none",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLInputElement).style.border =
                        "1.5px solid #c97e4a";
                    }}
                    onBlur={(e) => {
                      if (!emailError) {
                        (e.currentTarget as HTMLInputElement).style.border =
                          "1.5px solid rgba(176,154,130,0.3)";
                      }
                    }}
                  />
                  {emailError && (
                    <p
                      role="alert"
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: "12px",
                        color: "#c97e4a",
                        margin: 0,
                      }}
                    >
                      {emailError}
                    </p>
                  )}
                  <button
                    type="submit"
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#faf7f2",
                      background: "#c97e4a",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px 20px",
                      cursor: "pointer",
                      transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)")
                    }
                    onMouseDown={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(0.98)")
                    }
                    onMouseUp={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)")
                    }
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "2px solid #faf7f2";
                      (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline = "none";
                    }}
                  >
                    Subscribe — It&apos;s Free
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(176,154,130,0.15)",
            marginBottom: "32px",
          }}
          role="separator"
          aria-hidden="true"
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "13px",
              color: "#6b5b4a",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Ballpoint Trust. All rights reserved.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "13px",
                color: "#6b5b4a",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Ships within 2–4 business days
            </span>
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "13px",
                color: "#6b5b4a",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              100% Made in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}