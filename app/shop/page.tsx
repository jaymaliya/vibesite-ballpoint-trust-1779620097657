"use client";
export const dynamic = 'force-dynamic';

import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const products = [
    {
      id: 1,
      img: "/product-1.jpg",
      name: "Ballpoint Trust Classic Pen",
      description: "Smooth ink flow, comfortable grip, long-lasting performance for students and professionals.",
      price: 7,
    },
  ];

  const penVariants = [
    { color: "Blue Ink", swatch: "#1a56c4", price: 7, pack: "Pack of 10 for ₹65", perUnit: "₹6.5/pen", desc: "The everyday favourite. Ultra-smooth blue ink for notes, exams, and office work." },
    { color: "Black Ink", swatch: "#1a1a1a", price: 8, pack: "Pack of 10 for ₹75", perUnit: "₹7.5/pen", desc: "Professional black ink for forms, official documents, and clear impressions." },
    { color: "Red Ink", swatch: "#c0392b", price: 9, pack: "Pack of 10 for ₹85", perUnit: "₹8.5/pen", desc: "Bold red ink for marking, highlighting, and corrections. Teacher-approved." },
    { color: "Green Ink", swatch: "#1e8449", price: 6, pack: "Pack of 10 for ₹55", perUnit: "₹5.5/pen", desc: "Fresh green ink for creative notes and colour-coded organisation." },
    { color: "Multi-Pack", swatch: "linear-gradient(135deg,#1a56c4 0%,#1a1a1a 33%,#c0392b 66%,#1e8449 100%)", price: 10, pack: "Pack of 5 (assorted) for ₹48", perUnit: "₹9.6/set", desc: "One of each colour. Perfect starter set for students and offices." },
  ];

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeVariant, setActiveVariant] = useState(0);
  const [addedStates, setAddedStates] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const filters = ["All", "Bestsellers", "Blue Ink", "Black Ink", "Red Ink", "Multi-Pack"];

  const testimonials = [
    { quote: "These pens are my go-to for daily notes – smooth, reliable, and amazing value!", author: "Rahul S.", role: "Student, Delhi" },
    { quote: "I bulk ordered 500 pens for our office. Delivered on time, every pen works perfectly.", author: "Priya M.", role: "Office Manager, Bengaluru" },
    { quote: "At ₹7 a pen, the quality is unbelievable. Never switching brands.", author: "Arjun K.", role: "CA Student, Mumbai" },
  ];

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach(el => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
      (el as HTMLElement).style.transition = "opacity 400ms ease-out, transform 400ms ease-out";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (productId: string, name: string, price: number, img: string) => {
    addItem({ id: crypto.randomUUID(), name, price, quantity: 1, image: img });
    setAddedStates(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => setAddedStates(prev => ({ ...prev, [productId]: false })), 1500);
  };

  const currentVariant = penVariants[activeVariant];

  const displayProducts = products.map(p => ({
    ...p,
    price: p.price === 0 ? currentVariant.price : p.price,
  }));

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "var(--bg)", color: "var(--text)", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "72px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px",
        background: scrolled ? "#ffffff" : "transparent",
        borderBottom: scrolled ? "1px solid #E0E0E0" : "none",
        boxShadow: scrolled ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        transition: "background 200ms ease, box-shadow 200ms ease",
      }}>
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          className="ham-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="3" y1="6" x2="21" y2="6" stroke={scrolled ? "#1a1a1a" : "#1a1a1a"} strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="12" x2="21" y2="12" stroke={scrolled ? "#1a1a1a" : "#1a1a1a"} strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" stroke={scrolled ? "#1a1a1a" : "#1a1a1a"} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", fontWeight: 700, color: scrolled ? "#1a1a1a" : "#1a1a1a", letterSpacing: "0.04em" }}
        >
          PenCo
        </button>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: "40px", alignItems: "center" }} className="desktop-nav">
          {[
            { label: "Pens", action: () => router.push("/shop") },
            { label: "Bundles", action: () => router.push("/shop") },
            { label: "Our Story", action: () => document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }) },
            { label: "Contact", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
          ].map(link => (
            <button
              key={link.label}
              onClick={link.action}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 600, color: "#444444", letterSpacing: "0.02em", fontFamily: "'Manrope', sans-serif", textDecoration: "none", padding: "4px 0", borderBottom: "2px solid transparent", transition: "border-color 200ms ease, color 200ms ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderBottomColor = "#c97e4a"; (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderBottomColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#444444"; }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Cart icon */}
        <button
          onClick={() => router.push("/checkout")}
          aria-label="View cart"
          style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "8px" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#1a1a1a" : "#1a1a1a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#ffffff", display: "flex", flexDirection: "column", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {[
            { label: "Pens", action: () => { router.push("/shop"); setMobileMenuOpen(false); } },
            { label: "Bundles", action: () => { router.push("/shop"); setMobileMenuOpen(false); } },
            { label: "Our Story", action: () => { document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); } },
            { label: "Contact", action: () => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); } },
          ].map(link => (
            <button
              key={link.label}
              onClick={link.action}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", fontWeight: 600, color: "#1a1a1a", textAlign: "left", padding: "0 24px", height: "48px", fontFamily: "'Manrope', sans-serif", borderBottom: "1px solid #f0ede8" }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* ── SHOP HERO BANNER ── */}
      <section style={{ paddingTop: "72px" }}>
        <div style={{ position: "relative", width: "100%", height: "clamp(240px, 40vh, 400px)", overflow: "hidden" }}>
          <img
            src="/product-1.jpg"
            alt="Ballpoint Trust pens arranged on a clean desk surface"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.7s ease" }}
            onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)")}
            onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.55) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", padding: "24px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#c97e4a" }}>Collection</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", letterSpacing: "0.02em", lineHeight: 1.05, color: "#ffffff", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.4)", margin: 0 }}>
              Every Pen. Every Price.
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.88)", textAlign: "center", maxWidth: "480px", margin: 0 }}>
              Trusted by 10,000+ Students & Professionals Daily. Free Shipping over ₹499.
            </p>
            <div style={{ display: "flex", gap: "24px", fontSize: "13px", color: "rgba(255,255,255,0.8)", flexWrap: "wrap", justifyContent: "center" }}>
              <span>⭐ 4.8 / 5</span>
              <span>From ₹2 per pen</span>
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER PILLS ── */}
      <section className="reveal" style={{ padding: "32px 48px 0", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "0 16px", height: "32px", borderRadius: "9999px", border: activeFilter === f ? "none" : "1px solid #D0D0D0",
                background: activeFilter === f ? "#c97e4a" : "transparent",
                color: activeFilter === f ? "#ffffff" : "#333333",
                fontSize: "13px", fontWeight: 500, fontFamily: "'Manrope', sans-serif", cursor: "pointer",
                transition: "background 150ms ease, color 150ms ease",
              }}
              onMouseEnter={e => { if (activeFilter !== f) (e.currentTarget as HTMLButtonElement).style.background = "#f0ede8"; }}
              onMouseLeave={e => { if (activeFilter !== f) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section id="products" style={{ padding: "40px 48px 96px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {penVariants.map((variant, vi) => {
            const cardKey = `variant-${vi}`;
            const isAdded = addedStates[cardKey];
            return (
              <article
                key={vi}
                className="reveal"
                style={{ background: "#ffffff", border: "1px solid #E0E0E0", borderRadius: "4px", overflow: "hidden", cursor: "pointer", transition: "box-shadow 250ms cubic-bezier(0.4,0,0.2,1), transform 250ms cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,26,26,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                onClick={() => router.push(`/product?name=${encodeURIComponent("Ballpoint Trust " + variant.color + " Pen")}&price=${variant.price}&img=${encodeURIComponent("/product-1.jpg")}`)}
              >
                {/* Image */}
                <div style={{ overflow: "hidden", background: "#ffffff", aspectRatio: "3/4", position: "relative" }}>
                  <img
                    src="/product-1.jpg"
                    alt={`Ballpoint Trust ${variant.color} ballpoint pen`}
                    style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                  {vi === 0 && (
                    <div style={{ position: "absolute", top: "12px", left: "12px", background: "#c97e4a", color: "#ffffff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px" }}>
                      Bestseller
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: "16px" }}>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "15px", fontWeight: 600, color: "#333333", margin: "0 0 6px" }}>
                    Ballpoint Trust {variant.color} Pen
                  </h3>

                  {/* VISUAL FINGERPRINT — color swatch variant selector */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center" }} onClick={e => e.stopPropagation()}>
                    {penVariants.map((v, i) => (
                      <button
                        key={i}
                        aria-label={`Select ${v.color}`}
                        onClick={e => { e.stopPropagation(); setActiveVariant(i); }}
                        style={{
                          width: "16px", height: "16px", borderRadius: "9999px",
                          background: v.swatch.startsWith("linear") ? undefined : v.swatch,
                          backgroundImage: v.swatch.startsWith("linear") ? v.swatch : undefined,
                          border: activeVariant === i && vi === activeVariant ? "2px solid #c97e4a" : "1px solid #D0D0D0",
                          cursor: "pointer", padding: 0, flexShrink: 0, transition: "border 150ms ease",
                          outline: "none",
                        }}
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: "13px", color: "#666666", margin: "0 0 10px", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {variant.desc}
                  </p>

                  <div style={{ marginBottom: "10px" }}>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "#c97e4a", fontFamily: "'Manrope', sans-serif" }}>
                      ₹{variant.price}
                    </span>
                    <span style={{ fontSize: "13px", color: "#b09a82", marginLeft: "6px" }}>/ pen</span>
                  </div>

                  {/* Value Pack module */}
                  <div style={{ background: "#faf7f2", borderRadius: "4px", padding: "8px 10px", marginBottom: "14px" }}>
                    <div style={{ fontSize: "13px", color: "#444444", fontWeight: 600 }}>{variant.pack}</div>
                    <div style={{ fontSize: "12px", color: "#b09a82", marginTop: "2px" }}>{variant.perUnit}</div>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={e => { e.stopPropagation(); handleAddToCart(cardKey, `Ballpoint Trust ${variant.color} Pen`, variant.price, "/product-1.jpg"); }}
                    style={{
                      width: "100%", height: "40px", border: `1px solid #c97e4a`,
                      background: isAdded ? "#c97e4a" : "transparent",
                      color: isAdded ? "#ffffff" : "#c97e4a",
                      borderRadius: "4px", fontSize: "14px", fontWeight: 600, fontFamily: "'Manrope', sans-serif",
                      cursor: "pointer", transition: "background 200ms ease, color 200ms ease, transform 150ms ease",
                    }}
                    onMouseEnter={e => { if (!isAdded) { (e.currentTarget as HTMLButtonElement).style.background = "#c97e4a"; (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; } }}
                    onMouseLeave={e => { if (!isAdded) { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#c97e4a"; } }}
                    onMouseDown={e => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                    onMouseUp={e => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                  >
                    {isAdded ? "✓ Added" : "Add to Cart"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── WHY CHOOSE OUR PENS ── */}
      <section id="our-story" className="reveal" style={{ background: "#F8F8F8", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "3fr 2fr", gap: "64px", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#b09a82", display: "block", marginBottom: "16px" }}>Our Commitment</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "0.02em", color: "#1a1a1a", margin: "0 0 40px", lineHeight: 1.1 }}>
              Why Choose Our Pens?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {[
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c97e4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>, title: "Consistent Ink Flow", body: "Specially formulated ink that glides smoothly from start to finish — no skipping, no blotching, every single time." },
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c97e4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, title: "Comfortable Grip", body: "Ergonomic barrel design reduces hand fatigue during long writing sessions — perfect for exams and daily note-taking." },
                { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c97e4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 18v4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M20 12h-4"/><path d="m19.07 4.93-2.83 2.83"/></svg>, title: "Long-Lasting Performance", body: "Up to 3km of writing per pen. Built to last through notebooks, projects, and everything in between." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, marginTop: "2px" }}>{item.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "16px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>{item.title}</h3>
                    <p style={{ fontSize: "16px", color: "#444444", margin: 0, lineHeight: 1.7 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <img
              src="/product-1.jpg"
              alt="A hand writing smoothly with a Ballpoint Trust pen in a notebook"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
              onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="reveal" style={{ background: "#EBF5F8", padding: "96px 48px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "80px", lineHeight: 1, color: "#c97e4a", opacity: 0.25, pointerEvents: "none", fontFamily: "Georgia, serif" }}>&ldquo;</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: "22px", fontStyle: "italic", color: "#444444", lineHeight: 1.5, margin: "0 0 20px" }}>
              {testimonials[testimonialIndex].quote}
            </p>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#333333", margin: "0 0 24px" }}>
              — {testimonials[testimonialIndex].author}, {testimonials[testimonialIndex].role}
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  style={{ width: "8px", height: "8px", borderRadius: "9999px", border: "none", cursor: "pointer", background: i === testimonialIndex ? "#c97e4a" : "#CCCCCC", transition: "background 200ms ease", padding: 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BULK ORDERS ── */}
      <section id="contact" className="reveal" style={{ background: "#ffffff", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div style={{ overflow: "hidden", borderRadius: "8px" }}>
            <img
              src="/product-1.jpg"
              alt="A large box of Ballpoint Trust pens for bulk corporate orders"
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "8px", transition: "transform 0.7s ease" }}
              onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
          </div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#b09a82", display: "block", marginBottom: "16px" }}>For Schools, Offices & Institutions</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.02em", color: "#1a1a1a", margin: "0 0 20px", lineHeight: 1.1 }}>
              Bulk & Corporate Orders
            </h2>
            <p style={{ fontSize: "16px", color: "#444444", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "480px" }}>
              Equip your team or institution with reliable writing instruments. Enjoy special pricing, custom branding, and dedicated support for large orders. Minimum order: 100 pens.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {["Prices from ₹2/pen on bulk orders", "Custom logo printing available", "Delivered in 3–5 business days", "Dedicated relationship manager"].map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#c97e4a" fillOpacity="0.15" />
                    <path d="m5 8 2 2 4-4" stroke="#c97e4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: "15px", color: "#444444" }}>{pt}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setInquiryOpen(true)}
              style={{ padding: "0 24px", height: "48px", border: "1px solid #c97e4a", background: "transparent", color: "#c97e4a", borderRadius: "4px", fontSize: "15px", fontWeight: 600, fontFamily: "'Manrope', sans-serif", cursor: "pointer", transition: "background 200ms ease, color 200ms ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#c97e4a"; (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#c97e4a"; }}
            >
              Inquire Now
            </button>
          </div>
        </div>
      </section>

      {/* ── INQUIRY MODAL ── */}
      {inquiryOpen && (
        <div
          onClick={() => setInquiryOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#ffffff", borderRadius: "16px", padding: "40px", maxWidth: "480px", width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.2)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", color: "#1a1a1a", margin: 0, letterSpacing: "0.04em" }}>Bulk Order Enquiry</h3>
              <button onClick={() => setInquiryOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {[
              { label: "Full Name", type: "text", placeholder: "Ravi Sharma" },
              { label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
              { label: "Organisation", type: "text", placeholder: "ABC School / XYZ Pvt Ltd" },
              { label: "Quantity Required", type: "number", placeholder: "500" },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#444444", marginBottom: "6px" }}>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  style={{ width: "100%", height: "44px", border: "1px solid #D0D0D0", borderRadius: "4px", padding: "0 12px", fontSize: "15px", fontFamily: "'Manrope', sans-serif", color: "#1a1a1a", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}
            <button
              onClick={() => { alert("Thank you! Our team will contact you within 24 hours."); setInquiryOpen(false); }}
              style={{ width: "100%", height: "48px", background: "#c97e4a", color: "#ffffff", border: "none", borderRadius: "4px", fontSize: "15px", fontWeight: 600, fontFamily: "'Manrope', sans-serif", cursor: "pointer", marginTop: "8px", transition: "opacity 200ms ease" }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              Submit Enquiry
            </button>
          </div>
        </div>
      )}

      {/* ── TRUST BAR ── */}
      <section className="reveal" style={{ background: "#c97e4a", padding: "32px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "24px" }}>
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Free Shipping over ₹499" },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>, text: "10,000+ Happy Customers" },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, text: "Made in India" },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, text: "⭐ 4.8/5 Rated" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", color: "#ffffff" }}>
              {item.icon}
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#333333", color: "#ffffff", padding: "64px 48px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", marginBottom: "48px" }}>
          {/* Col 1 */}
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", color: "#ffffff", letterSpacing: "0.04em", marginBottom: "12px" }}>PenCo</div>
            <p style={{ fontSize: "13px", color: "#AAAAAA", lineHeight: 1.6, margin: "0 0 20px" }}>Your everyday writing companion. Reliable. Affordable. Indian.</p>
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" },
                { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { label: "Twitter", path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
              ].map(s => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  onClick={() => window.open(`https://${s.label.toLowerCase()}.com`, "_blank")}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                    <path d={s.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#ffffff", marginBottom: "16px" }}>Shop</div>
            {["Pens", "Bundles", "Best Sellers", "Bulk Orders"].map(link => (
              <button
                key={link}
                onClick={() => router.push("/shop")}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#DDDDDD", marginBottom: "8px", padding: 0, fontFamily: "'Manrope', sans-serif", textAlign: "left", transition: "color 200ms ease" }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#ffffff")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#DDDDDD")}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#ffffff", marginBottom: "16px" }}>Learn</div>
            {["Our Story", "Quality", "FAQ", "Contact Us"].map(link => (
              <button
                key={link}
                onClick={() => document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#DDDDDD", marginBottom: "8px", padding: 0, fontFamily: "'Manrope', sans-serif", textAlign: "left", transition: "color 200ms ease" }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#ffffff")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#DDDDDD")}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Col 4 — Newsletter */}
          <div id="contact-form">
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", marginBottom: "12px" }}>Stay in the loop</div>
            <p style={{ fontSize: "13px", color: "#AAAAAA", marginBottom: "16px", lineHeight: 1.5 }}>Get deals, new arrivals, and writing tips straight to your inbox.</p>
            {subscribeSuccess ? (
              <div style={{ background: "#c97e4a", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", color: "#ffffff", fontWeight: 600 }}>
                ✓ You're subscribed! Welcome to the PenCo family.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={subscribeEmail}
                  onChange={e => setSubscribeEmail(e.target.value)}
                  style={{ height: "44px", border: "1px solid #AAAAAA", borderRadius: "4px", background: "transparent", color: "#ffffff", padding: "0 12px", fontSize: "14px", fontFamily: "'Manrope', sans-serif", outline: "none", boxSizing: "border-box" }}
                />
                <button
                  onClick={() => { if (subscribeEmail.includes("@")) { setSubscribeSuccess(true); setSubscribeEmail(""); } }}
                  style={{ height: "44px", background: "#c97e4a", color: "#ffffff", border: "none", borderRadius: "4px", fontSize: "15px", fontWeight: 600, fontFamily: "'Manrope', sans-serif", cursor: "pointer", transition: "opacity 200ms ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ borderTop: "1px solid #444444", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#AAAAAA" }}>© 2025 PenCo</span>
            <button
              onClick={() => window.open("/privacy", "_blank")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#AAAAAA", fontFamily: "'Manrope', sans-serif", padding: 0, transition: "color 200ms" }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#ffffff")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#AAAAAA")}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => window.open("/terms", "_blank")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#AAAAAA", fontFamily: "'Manrope', sans-serif", padding: 0, transition: "color 200ms" }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#ffffff")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#AAAAAA")}
            >
              Terms of Service
            </button>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {["Visa", "MC", "UPI"].map(pay => (
              <div key={pay} style={{ background: "#ffffff", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", fontWeight: 700, color: "#333333" }}>{pay}</div>
            ))}
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .ham-btn { display: flex !important; }
        }
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: 3fr 2fr"],
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        * { box-sizing: border-box; }
        :root {
          --bg: #faf7f2;
          --surface: #6b5b4a;
          --primary: #1a1a1a;
          --accent: #c97e4a;
          --text: #1a1a1a;
          --muted: #b09a82;
        }
        button:focus-visible { outline: 2px solid #c97e4a; outline-offset: 2px; }
        input:focus { border-color: #c97e4a !important; }
      `}</style>
    </div>
  );
}