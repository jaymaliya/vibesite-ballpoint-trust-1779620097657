"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700&display=swap');`;

const products = [
  { id: 1, name: "Classic Blue Ballpen", ink: "Blue Ink", inkColor: "#1a56db", price: 2, pack: 10, packPrice: 18, img: "/product-1.jpg", desc: "Smooth everyday writing for students" },
  { id: 2, name: "SmoothGlide Black Pen", ink: "Black Ink", inkColor: "#1a1a1a", price: 3, pack: 10, packPrice: 25, img: "/product-1.jpg", desc: "Bold strokes, consistent ink flow" },
  { id: 3, name: "Red Ink Ballpen", ink: "Red Ink", inkColor: "#e02020", price: 2, pack: 10, packPrice: 18, img: "/product-1.jpg", desc: "Perfect for marking and corrections" },
  { id: 4, name: "ValuePack Assorted 5", ink: "Multi Color", inkColor: "#c97e4a", price: 10, pack: 5, packPrice: 10, img: "/product-1.jpg", desc: "Blue + Black + Red — all in one pack" },
  { id: 5, name: "PremiumFlow Blue Pen", ink: "Blue Ink", inkColor: "#1a56db", price: 5, pack: 5, packPrice: 22, img: "/product-1.jpg", desc: "Ergonomic grip, ultra-smooth tip" },
  { id: 6, name: "Office Essential Black", ink: "Black Ink", inkColor: "#1a1a1a", price: 7, pack: 10, packPrice: 65, img: "/product-1.jpg", desc: "Heavy-duty corporate writing pen" },
  { id: 7, name: "Student Pack Blue", ink: "Blue Ink", inkColor: "#1a56db", price: 2, pack: 20, packPrice: 35, img: "/product-1.jpg", desc: "Bulk pack for exam season" },
  { id: 8, name: "Gel-Feel Ballpen Red", ink: "Red Ink", inkColor: "#e02020", price: 10, pack: 5, packPrice: 45, img: "/product-1.jpg", desc: "Gel-like smoothness at ballpen price" },
];

const collections = [
  { name: "Smooth Glide Ballpens", desc: "Effortless Writing, Every Time", img: "/product-1.jpg", tag: "BESTSELLER" },
  { name: "Student Value Packs", desc: "More Pens, Less Spend", img: "/product-1.jpg", tag: "TOP PICK" },
  { name: "Office Pro Series", desc: "Reliable Performance, All Day", img: "/product-1.jpg", tag: "CORPORATE" },
];

const testimonials = [
  { quote: "These pens are my go-to for daily notes — smooth, reliable, and amazing value!", name: "Rahul S.", role: "Student, Delhi" },
  { quote: "We ordered 500 pens for our office. The quality and price are unbeatable!", name: "Meena T.", role: "Office Manager, Mumbai" },
  { quote: "My kids use these for school every day. Never leaks, always smooth. Highly recommend.", name: "Sunita K.", role: "Parent, Bengaluru" },
  { quote: "Best budget ballpen I've found. The blue ink is perfect for answer sheets.", name: "Arjun P.", role: "Engineering Student, Pune" },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      ${FONTS}
      :root {
        --bg: #faf7f2;
        --surface: #6b5b4a;
        --primary: #1a1a1a;
        --accent: #c97e4a;
        --text: #1a1a1a;
        --muted: #b09a82;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg); font-family: 'Manrope', sans-serif; color: var(--text); overflow-x: hidden; }
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .stagger-1 { transition-delay: 80ms; }
      .stagger-2 { transition-delay: 160ms; }
      .stagger-3 { transition-delay: 240ms; }
      .stagger-4 { transition-delay: 320ms; }
      .stagger-5 { transition-delay: 400ms; }
      .stagger-6 { transition-delay: 480ms; }
      .stagger-7 { transition-delay: 560ms; }
      .stagger-8 { transition-delay: 640ms; }
      :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      .carousel-track { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 8px; }
      .carousel-track::-webkit-scrollbar { display: none; }
      .carousel-card { scroll-snap-align: start; flex-shrink: 0; }
      @media (max-width: 768px) { .hide-mobile { display: none !important; } .show-mobile { display: flex !important; } }
      @media (min-width: 769px) { .hide-desktop { display: none !important; } }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); style.remove(); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  function handleAddToCart(p: typeof products[0]) {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* NAV */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        background: scrolled ? "#ffffff" : "transparent",
        borderBottom: scrolled ? "1px solid #E0E0E0" : "none",
        boxShadow: scrolled ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        transition: "background 200ms ease, box-shadow 200ms ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px"
      }}>
        {/* Hamburger mobile */}
        <button className="show-mobile hide-desktop" onClick={() => setMobileMenuOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
          aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect y="4" width="24" height="2" rx="1" fill={scrolled ? "#333333" : "#ffffff"} />
            <rect y="11" width="24" height="2" rx="1" fill={scrolled ? "#333333" : "#ffffff"} />
            <rect y="18" width="24" height="2" rx="1" fill={scrolled ? "#333333" : "#ffffff"} />
          </svg>
        </button>

        {/* Logo */}
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="var(--accent)" />
            <path d="M8 20L14 6L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.5 15h7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.04em", color: scrolled ? "#1a1a1a" : "#ffffff" }}>Ballpoint Trust</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hide-mobile" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Pens", "Bundles", "Our Story", "Contact"].map(link => (
            <button key={link} onClick={() => {
              if (link === "Pens") router.push("/shop");
              else if (link === "Bundles") router.push("/shop");
              else if (link === "Our Story") document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" });
              else if (link === "Contact") document.getElementById("bulk-orders")?.scrollIntoView({ behavior: "smooth" });
            }}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 16, color: scrolled ? "#444444" : "#ffffff", letterSpacing: "0.02em", transition: "color 200ms ease", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "#444444" : "#ffffff")}
            >{link}</button>
          ))}
        </nav>

        {/* Cart */}
        <button onClick={() => router.push("/checkout")}
          style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 8 }}
          aria-label="View cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={scrolled ? "#333333" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="6" x2="21" y2="6" stroke={scrolled ? "#333333" : "#ffffff"} strokeWidth="2" strokeLinecap="round" />
            <path d="M16 10a4 4 0 01-8 0" stroke={scrolled ? "#333333" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#ffffff", display: "flex", flexDirection: "column", padding: "24px" }}
          onClick={e => { if (e.target === e.currentTarget) setMobileMenuOpen(false); }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 32 }}>
            {["Pens", "Bundles", "Our Story", "Contact"].map(link => (
              <button key={link} onClick={() => {
                setMobileMenuOpen(false);
                if (link === "Pens") router.push("/shop");
                else if (link === "Bundles") router.push("/shop");
                else if (link === "Our Story") document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" });
                else document.getElementById("bulk-orders")?.scrollIntoView({ behavior: "smooth" });
              }}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 24, color: "#333333", textAlign: "left", padding: "16px 24px", borderBottom: "1px solid #f0ede8", height: 64 }}
              >{link}</button>
            ))}
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ position: "relative", width: "100%", height: "70vh", minHeight: 500, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.5) 100%)", zIndex: 1 }} />
        <img src="/product-1.jpg" alt="Ballpoint Trust pens — blue, black and red ink pens arranged at 45 degrees on a clean surface"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "22%", textAlign: "center", padding: "0 24px" }}>
          <div style={{ marginTop: "clamp(80px, 18vh, 160px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ffd9b3", marginBottom: 8 }}>Made in India · Trusted by 10,000+</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.8rem)", letterSpacing: "-0.01em", lineHeight: 1.1, color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.4)", maxWidth: 700 }}>
              Reliable Writing,<br />Unbeatable Value.
            </h1>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.88)", lineHeight: 1.6, maxWidth: 480 }}>
              Premium ballpens from ₹2. Every stroke counts — smooth ink, comfortable grip, everyday dependability.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 8 }}>
              <button onClick={() => router.push("/shop")}
                style={{ background: "var(--accent)", color: "#ffffff", border: "none", borderRadius: 4, padding: "0 32px", height: 56, fontSize: 18, fontFamily: "'Manrope', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em", transition: "transform 150ms ease, background 200ms ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#b36a35"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "var(--accent)"; }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                Shop All Pens
              </button>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
                Trusted by 10,000+ Students &amp; Professionals Daily · Free Shipping over ₹499
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: "var(--primary)", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(24px, 5vw, 64px)", flexWrap: "wrap" }}>
        {[
          { icon: "★", label: "4.8 / 5 Rating" },
          { icon: "✔", label: "10,000+ Happy Customers" },
          { icon: "₹", label: "Pens from just ₹2" },
          { icon: "⚡", label: "Free Shipping over ₹499" },
        ].map(t => (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--accent)", fontSize: 16, fontWeight: 700 }}>{t.icon}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, color: "#cccccc", letterSpacing: "0.02em" }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* FEATURED COLLECTIONS */}
      <section style={{ background: "var(--bg)", padding: "96px clamp(24px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)" }}>Our Collections</span>
          </div>
          <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.01em", lineHeight: 1.2, color: "var(--text)", marginBottom: 48 }}>
            Featured Pen Collections
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {collections.map((c, i) => (
              <div key={c.name} className={`reveal stagger-${i + 1}`}
                onClick={() => router.push("/shop")}
                style={{ background: "#ffffff", border: "1px solid #E0E0E0", borderRadius: 4, cursor: "pointer", overflow: "hidden", transition: "transform 200ms ease-in-out, box-shadow 200ms ease-in-out" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,26,26,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1" }}>
                  <img src={c.img} alt={c.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 600ms ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  <span style={{ position: "absolute", top: 12, left: 12, background: "var(--accent)", color: "#fff", fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 2 }}>{c.tag}</span>
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 18, color: "#333333", marginBottom: 6 }}>{c.name}</h3>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "#666666", lineHeight: 1.5 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="our-story" style={{ background: "#F8F8F8", padding: "96px clamp(24px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(300px, 60%, 720px) 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "center" }}>
          <div className="reveal">
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 16 }}>Quality You Can Trust</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.01em", lineHeight: 1.2, color: "#333333", marginBottom: 40 }}>Why Choose Our Pens?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="var(--accent)" /></svg>, title: "Consistent Ink Flow", body: "Our precision-engineered ball tip ensures every stroke delivers smooth, even ink — no skipping, no blotting, every single time." },
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.5 12a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" stroke="var(--accent)" strokeWidth="2" /><path d="M12 8v4l3 3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" /></svg>, title: "Comfortable Grip", body: "Ergonomically designed barrel reduces fatigue during long writing sessions — perfect for students and office workers alike." },
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" /></svg>, title: "Long-Lasting Performance", body: "Each pen is built to last. Our ink formulation ensures up to 2,000 metres of writing without running dry or fading." },
              ].map((item, i) => (
                <div key={item.title} className={`reveal stagger-${i + 1}`} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 20, color: "#333333", marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, color: "#444444", lineHeight: 1.7 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ overflow: "hidden" }}>
            <img src="/product-1.jpg" alt="Hand holding a Ballpoint Trust pen writing on a notebook — smooth ink in action"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", transition: "transform 600ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
        </div>
      </section>

      {/* BEST SELLERS CAROUSEL */}
      <section style={{ background: "var(--bg)", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <div className="reveal" style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)" }}>Most Loved</span>
          </div>
          <div className="reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.01em", lineHeight: 1.2, color: "var(--text)" }}>Best Selling Pens</h2>
            <button onClick={() => router.push("/shop")}
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              View All →
            </button>
          </div>
        </div>
        <div ref={carouselRef} className="carousel-track" style={{ paddingLeft: "clamp(24px, 5vw, 80px)", paddingRight: "clamp(24px, 5vw, 80px)" }}>
          {products.map((p, i) => (
            <div key={p.id} className={`carousel-card reveal stagger-${(i % 8) + 1}`}
              style={{ width: "clamp(200px, 22vw, 260px)", background: "#ffffff", border: "1px solid #E0E0E0", borderRadius: 4, overflow: "hidden", transition: "transform 250ms cubic-bezier(0.4,0,0.2,1), box-shadow 250ms cubic-bezier(0.4,0,0.2,1)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}>
                <img src={p.img} alt={p.name}
                  style={{ width: "100%", aspectRatio: "3/4", objectFit: "contain", background: "#fafafa", display: "block", transition: "transform 600ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ padding: "16px 14px 14px" }}>
                {/* VISUAL FINGERPRINT: Dynamic Value Pack Module */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: p.inkColor, border: "1px solid #E0E0E0", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#666666" }}>{p.ink}</span>
                </div>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 15, color: "#333333", marginBottom: 4, lineHeight: 1.3 }}>{p.name}</h3>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>₹{p.price}</p>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                  Pack of {p.pack} · ₹{p.packPrice} <span style={{ fontSize: 11 }}>(₹{(p.packPrice / p.pack).toFixed(1)}/pen)</span>
                </p>
                <button onClick={() => handleAddToCart(p)}
                  style={{ width: "100%", height: 40, border: `1px solid ${addedId === p.id ? "var(--accent)" : "var(--accent)"}`, borderRadius: 4, background: addedId === p.id ? "var(--accent)" : "transparent", color: addedId === p.id ? "#ffffff" : "var(--accent)", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "background 200ms ease, color 200ms ease, transform 150ms ease" }}
                  onMouseEnter={e => { if (addedId !== p.id) { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#ffffff"; } }}
                  onMouseLeave={e => { if (addedId !== p.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; } }}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
                  {addedId === p.id ? "✓ Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "#EBF5F8", padding: "96px clamp(24px, 5vw, 80px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Big quotation mark SVG */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0, pointerEvents: "none" }}>
          <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
            <text x="0" y="140" fontSize="200" fontFamily="Georgia, serif" fill="var(--accent)" fillOpacity="0.12">"</text>
          </svg>
        </div>
        <div className="reveal" style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 32 }}>What Our Customers Say</span>
          <div style={{ minHeight: 120, transition: "opacity 300ms ease" }}>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.375rem)", fontStyle: "italic", color: "#444444", lineHeight: 1.5, marginBottom: 24 }}>
              "{testimonials[activeTestimonial].quote}"
            </p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 16, color: "#333333" }}>
              — {testimonials[activeTestimonial].name}, <span style={{ fontWeight: 400, color: "#666666" }}>{testimonials[activeTestimonial].role}</span>
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 32 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} aria-label={`Testimonial ${i + 1}`}
                style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", background: i === activeTestimonial ? "var(--accent)" : "#CCCCCC", transition: "background 200ms ease", padding: 0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* BULK & CORPORATE ORDERS */}
      <section id="bulk-orders" style={{ background: "#ffffff", padding: "96px clamp(24px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px, 5vw, 80px)", alignItems: "center" }}>
          <div className="reveal" style={{ overflow: "hidden", borderRadius: 8 }}>
            <img src="/product-1.jpg" alt="Large box of Ballpoint Trust pen packs — bulk and corporate order ready"
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", borderRadius: 8, transition: "transform 600ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
          <div className="reveal">
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 16 }}>For Offices &amp; Institutions</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.01em", lineHeight: 1.2, color: "#333333", marginBottom: 20 }}>Bulk &amp; Corporate Orders</h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, color: "#444444", lineHeight: 1.7, marginBottom: 32 }}>
              Equip your team or institution with reliable writing instruments. Enjoy special pricing and dedicated support for large orders. Minimum order of 100 pens with custom branding options available.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => setInquiryOpen(true)}
                style={{ height: 48, padding: "0 24px", border: "1px solid var(--accent)", borderRadius: 4, background: "transparent", color: "var(--accent)", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 16, cursor: "pointer", transition: "background 200ms ease, color 200ms ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}>
                Inquire Now
              </button>
              <button onClick={() => router.push("/shop")}
                style={{ height: 48, padding: "0 24px", border: "none", borderRadius: 4, background: "var(--primary)", color: "#ffffff", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 16, cursor: "pointer", transition: "transform 150ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                Explore Collections
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INQUIRY MODAL */}
      {inquiryOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setInquiryOpen(false); }}>
          <div style={{ background: "#ffffff", borderRadius: 8, padding: "40px 40px 32px", maxWidth: 480, width: "100%", position: "relative" }}>
            <button onClick={() => setInquiryOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#666" }} aria-label="Close">✕</button>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "var(--text)", marginBottom: 8 }}>Bulk Order Enquiry</h3>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>Fill in your details and our team will get back within 24 hours with a custom quote.</p>
            {["Name", "Organisation", "Email", "Phone", "Quantity Required"].map(field => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{field}</label>
                <input type={field === "Email" ? "email" : field === "Phone" ? "tel" : "text"}
                  placeholder={field === "Quantity Required" ? "e.g. 500 pens" : ""}
                  style={{ width: "100%", height: 44, border: "1px solid #D0D0D0", borderRadius: 4, padding: "0 14px", fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "var(--text)", background: "var(--bg)", outline: "none" }} />
              </div>
            ))}
            <button onClick={() => setInquiryOpen(false)}
              style={{ width: "100%", height: 48, background: "var(--accent)", color: "#ffffff", border: "none", borderRadius: 4, fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 16, cursor: "pointer", marginTop: 8 }}>
              Submit Enquiry
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#333333", padding: "64px clamp(24px, 5vw, 80px) 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, paddingBottom: 48 }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="6" fill="var(--accent)" /><path d="M8 20L14 6L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10.5 15h7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.04em", color: "#ffffff" }}>Ballpoint Trust</span>
            </div>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#AAAAAA", lineHeight: 1.7, marginBottom: 20, maxWidth: 220 }}>Your everyday writing companion. Write more. Spend less. Always.</p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Instagram", "Facebook", "Twitter"].map(social => (
                <button key={social} onClick={() => window.open("https://" + social.toLowerCase() + ".com", "_blank")}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} aria-label={social}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect width="20" height="20" rx="4" fill="#555555" />
                    <circle cx="10" cy="10" r="4" stroke="white" strokeWidth="1.5" />
                    <circle cx="14.5" cy="5.5" r="1" fill="white" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          {/* Col 2 */}
          <div>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff", marginBottom: 16 }}>Shop</p>
            {["Pens", "Bundles", "Best Sellers", "Bulk Orders"].map(link => (
              <button key={link} onClick={() => link === "Bulk Orders" ? document.getElementById("bulk-orders")?.scrollIntoView({ behavior: "smooth" }) : router.push("/shop")}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "#DDDDDD", marginBottom: 8, padding: 0, textAlign: "left" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "#DDDDDD")}>{link}</button>
            ))}
          </div>
          {/* Col 3 */}
          <div>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff", marginBottom: 16 }}>Learn</p>
            {["Our Story", "Quality", "FAQ", "Contact Us"].map(link => (
              <button key={link} onClick={() => { if (link === "Our Story") document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }); else if (link === "Contact Us") document.getElementById("bulk-orders")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "#DDDDDD", marginBottom: 8, padding: 0, textAlign: "left" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "#DDDDDD")}>{link}</button>
            ))}
          </div>
          {/* Col 4 */}
          <div>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 600, color: "#ffffff", marginBottom: 12 }}>Stay in the loop</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#AAAAAA", marginBottom: 16, lineHeight: 1.6 }}>Get deals, new arrivals and writing tips delivered to your inbox.</p>
            {subscribed ? (
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>✓ You're subscribed!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ height: 44, border: "1px solid #AAAAAA", borderRadius: 4, padding: "0 14px", fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "#ffffff", background: "transparent", outline: "none" }} />
                <button onClick={() => { if (email.includes("@")) setSubscribed(true); }}
                  style={{ height: 44, background: "var(--accent)", color: "#ffffff", border: "none", borderRadius: 4, fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "transform 150ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>Subscribe</button>
              </div>
            )}
          </div>
        </div>
        {/* Bottom Strip */}
        <div style={{ borderTop: "1px solid #444444", padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#AAAAAA" }}>© 2025 Ballpoint Trust</span>
            {["Privacy Policy", "Terms of Service"].map(l => (
              <button key={l} onClick={() => window.open("/" + l.toLowerCase().replace(" ", "-"), "_blank")}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#AAAAAA", textDecoration: "underline" }}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {["UPI", "VISA", "MC"].map(p => (
              <div key={p} style={{ background: "#555", borderRadius: 4, padding: "4px 8px", display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 700, color: "#ffffff" }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}