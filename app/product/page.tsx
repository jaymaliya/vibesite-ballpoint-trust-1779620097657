"use client";
export const dynamic = 'force-dynamic';

import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const inkVariants = [
  { label: "Blue Ink", color: "#2563EB", price: 7 },
  { label: "Black Ink", color: "#1a1a1a", price: 7 },
  { label: "Red Ink", color: "#DC2626", price: 8 },
  { label: "Green Ink", color: "#16A34A", price: 8 },
];

const packOptions = [
  { label: "Single Pen", multiplier: 1, discount: 0 },
  { label: "Pack of 5", multiplier: 5, discount: 5 },
  { label: "Pack of 10", multiplier: 10, discount: 10 },
  { label: "Pack of 20", multiplier: 20, discount: 15 },
];

const reviews = [
  { name: "Priya M.", date: "12 Jan 2025", rating: 5, text: "Incredibly smooth writing experience. I use these pens daily for college notes and they never skip. Best value for money!", avatar: "P" },
  { name: "Rahul S.", date: "3 Feb 2025", rating: 5, text: "Bought a pack of 20 for our office. Everyone loves them. Consistent ink flow from start to finish. Will definitely reorder.", avatar: "R" },
  { name: "Anjali K.", date: "18 Feb 2025", rating: 4, text: "Great pens for the price. The blue ink is very vibrant and the grip is comfortable for long writing sessions.", avatar: "A" },
  { name: "Vikas T.", date: "5 Mar 2025", rating: 5, text: "Ordered these for my students. The price is unbeatable and quality is consistent. Exactly what a classroom needs.", avatar: "V" },
];

const thumbnails = ["/product-1.jpg", "/product-1.jpg", "/product-1.jpg", "/product-1.jpg"];

function ProductContent() {
  const searchParams = useSearchParams();
  const paramImg = searchParams.get('img') ? decodeURIComponent(searchParams.get('img')!) : null;
  const paramName = searchParams.get('name') ? decodeURIComponent(searchParams.get('name')!) : null;
  const paramPrice = searchParams.get('price') ? Number(searchParams.get('price')) : null;
  const displayImg = paramImg ?? "/product-1.jpg";
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const basePrice = paramPrice && paramPrice > 0 ? paramPrice : 7;
  const displayName = paramName && paramName.trim().length > 3 ? paramName : "SmoothFlow Ballpoint Pen";

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedPack, setSelectedPack] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [addedState, setAddedState] = useState(false);
  const [buyNowAdded, setBuyNowAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [emailVal, setEmailVal] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);

  const variantPrice = inkVariants[selectedVariant].price || basePrice;
  const pack = packOptions[selectedPack];
  const totalUnits = pack.multiplier * quantity;
  const rawTotal = variantPrice * totalUnits;
  const discount = pack.discount;
  const finalPrice = Math.round(rawTotal * (1 - discount / 100));
  const perUnit = (finalPrice / totalUnits).toFixed(1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleAddToCart = () => {
    addItem({ id: `product-${selectedVariant}-${selectedPack}`, name: `${displayName} - ${inkVariants[selectedVariant].label} (${pack.label})`, price: finalPrice, quantity: 1, image: displayImg });
    setAddedState(true);
    setCartCount(c => c + 1);
    setToastVisible(true);
    setTimeout(() => setAddedState(false), 1500);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const handleBuyNow = () => {
    addItem({ id: `product-${selectedVariant}-${selectedPack}`, name: `${displayName} - ${inkVariants[selectedVariant].label} (${pack.label})`, price: finalPrice, quantity: 1, image: displayImg });
    setBuyNowAdded(true);
    setCartCount(c => c + 1);
    setTimeout(() => { setBuyNowAdded(false); router.push('/checkout'); }, 400);
  };

  const handleSubscribe = () => {
    if (emailVal.includes('@')) { setSubSuccess(true); setEmailVal(''); }
  };

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700&display=swap');
        :root { --bg:#faf7f2; --surface:#6b5b4a; --primary:#1a1a1a; --accent:#c97e4a; --text:#1a1a1a; --muted:#b09a82; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 400ms ease-out, transform 400ms ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .focus-ring:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: var(--muted); border-radius: 3px; }
        @media (max-width: 768px) { .desktop-only { display: none !important; } .mobile-only { display: flex !important; } }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
      `}</style>

      {/* Toast */}
      {toastVisible && (
        <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, background: "var(--primary)", color: "#fff", padding: "14px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 32px rgba(26,26,26,0.25)", display: "flex", alignItems: "center", gap: "8px", transition: "opacity 300ms" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c97e4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Item added to cart!
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setLightboxOpen(false)} className="focus-ring" style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={thumbnails[activeThumb]} alt={displayName} onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "8px" }} />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "#fff", display: "flex", flexDirection: "column", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", color: "var(--primary)", letterSpacing: "0.05em" }}>BALLPOINT TRUST</span>
            <button onClick={() => setMobileMenuOpen(false)} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {[{ label: "Pens", action: () => router.push('/shop') }, { label: "Bundles", action: () => router.push('/shop') }, { label: "Our Story", action: () => { setMobileMenuOpen(false); document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' }); } }, { label: "Contact", action: () => { setMobileMenuOpen(false); document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' }); } }].map((link, i) => (
            <button key={i} onClick={() => { setMobileMenuOpen(false); link.action(); }} className="focus-ring" style={{ display: "block", textAlign: "left", padding: "16px 0", fontSize: "24px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em", color: "var(--primary)", background: "none", border: "none", borderBottom: "1px solid #f0ede8", cursor: "pointer", width: "100%" }}>
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* NAVIGATION */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: "72px", background: scrolled ? "#fff" : "transparent", borderBottom: scrolled ? "1px solid #E0E0E0" : "none", boxShadow: scrolled ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "background 200ms ease, border 200ms ease, box-shadow 200ms ease", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px" }}>
        {/* Desktop */}
        <button onClick={() => router.push('/')} className="focus-ring desktop-only" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px", letterSpacing: "0.05em", color: scrolled ? "var(--primary)" : "#fff" }}>BALLPOINT TRUST</button>
        <div className="desktop-only" style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          {[{ label: "Pens", action: () => router.push('/shop') }, { label: "Bundles", action: () => router.push('/shop') }, { label: "Our Story", action: () => document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' }) }, { label: "Contact", action: () => document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' }) }].map((link, i) => (
            <button key={i} onClick={link.action} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 600, fontFamily: "'Manrope', sans-serif", color: scrolled ? "#444444" : "#fff", letterSpacing: "0.02em", transition: "color 200ms ease", textDecoration: "none" }}>{link.label}</button>
          ))}
        </div>
        <button onClick={() => router.push('/checkout')} className="focus-ring desktop-only" style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "var(--primary)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {cartCount > 0 && <span style={{ position: "absolute", top: "-8px", right: "-8px", width: "18px", height: "18px", borderRadius: "9999px", background: "var(--accent)", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
        </button>

        {/* Mobile */}
        <button onClick={() => setMobileMenuOpen(true)} className="focus-ring mobile-only" style={{ background: "none", border: "none", cursor: "pointer", display: "none" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "var(--primary)" : "#fff"} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <button onClick={() => router.push('/')} className="focus-ring mobile-only" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "0.05em", color: scrolled ? "var(--primary)" : "#fff", display: "none" }}>BALLPOINT TRUST</button>
        <button onClick={() => router.push('/checkout')} className="focus-ring mobile-only" style={{ background: "none", border: "none", cursor: "pointer", position: "relative", display: "none" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "var(--primary)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {cartCount > 0 && <span style={{ position: "absolute", top: "-8px", right: "-8px", width: "18px", height: "18px", borderRadius: "9999px", background: "var(--accent)", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
        </button>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ paddingTop: "96px", paddingBottom: "16px", paddingLeft: "clamp(24px, 5vw, 80px)", paddingRight: "clamp(24px, 5vw, 80px)", display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: "var(--muted)" }}>
        <button onClick={() => router.push('/')} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "13px", fontFamily: "'Manrope', sans-serif" }}>Home</button>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        <button onClick={() => router.push('/shop')} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "13px", fontFamily: "'Manrope', sans-serif" }}>Pens</button>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        <span style={{ color: "var(--text)", fontWeight: 600 }}>{displayName}</span>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <div style={{ padding: "0 clamp(24px, 5vw, 80px) 80px", maxWidth: "1320px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "clamp(300px, 55%, 680px) 1fr", gap: "64px", alignItems: "start" }}>

          {/* LEFT: IMAGE GALLERY */}
          <div style={{ position: "sticky", top: "88px" }}>
            {/* Main image */}
            <div onClick={() => setLightboxOpen(true)} style={{ overflow: "hidden", borderRadius: "16px", background: "#fff", border: "1px solid #E0E0E0", cursor: "zoom-in", marginBottom: "16px", aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={thumbnails[activeThumb]} alt={`${displayName} - ${inkVariants[selectedVariant].label}`} style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "10px" }}>
              {thumbnails.map((t, i) => (
                <button key={i} onClick={() => setActiveThumb(i)} className="focus-ring" style={{ width: "80px", height: "80px", border: i === activeThumb ? "2px solid var(--accent)" : "1px solid #E0E0E0", borderRadius: "8px", overflow: "hidden", cursor: "pointer", background: "#fff", padding: 0, flexShrink: 0 }}>
                  <img src={t} alt={`View ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </button>
              ))}
            </div>
            {/* Trust bar under image */}
            <div style={{ marginTop: "24px", padding: "16px 20px", background: "#fff", borderRadius: "12px", border: "1px solid #E0E0E0", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between" }}>
              {[{ icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Genuine Products" }, { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, text: "Free Ship ₹499+" }, { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>, text: "Easy Returns" }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>
                  {item.icon} {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div style={{ paddingTop: "8px" }}>
            {/* Eyebrow */}
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px" }}>Ballpoint Trust — Made in India</p>
            {/* Title */}
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 500, letterSpacing: "0.02em", lineHeight: 1.1, color: "var(--text)", marginBottom: "16px" }}>{displayName}</h1>

            {/* Ratings */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "2px" }}>{[1,2,3,4,5].map(s => <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= 5 ? "var(--accent)" : "#E0E0E0"} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>4.8</span>
              <span style={{ fontSize: "14px", color: "var(--muted)" }}>(2,847 reviews)</span>
              <span style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700, background: "#dcfce7", padding: "2px 8px", borderRadius: "9999px" }}>In Stock</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontFamily: "'Bebas Neue', sans-serif", color: "var(--accent)", letterSpacing: "0.02em" }}>₹{finalPrice.toLocaleString("en-IN")}</span>
                {pack.discount > 0 && <span style={{ fontSize: "14px", color: "var(--muted)", textDecoration: "line-through" }}>₹{rawTotal.toLocaleString("en-IN")}</span>}
                {pack.discount > 0 && <span style={{ fontSize: "13px", background: "var(--accent)", color: "#fff", padding: "2px 10px", borderRadius: "9999px", fontWeight: 700 }}>{pack.discount}% OFF</span>}
              </div>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>₹{perUnit}/pen · {totalUnits} pens total · Incl. all taxes</p>
            </div>

            <div style={{ width: "100%", height: "1px", background: "#E0E0E0", marginBottom: "24px" }} />

            {/* Ink Color Variant */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "12px" }}>
                Ink Colour: <span style={{ color: inkVariants[selectedVariant].color, fontWeight: 700 }}>{inkVariants[selectedVariant].label}</span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {inkVariants.map((v, i) => (
                  <button key={i} onClick={() => setSelectedVariant(i)} className="focus-ring" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 18px", height: "36px", borderRadius: "9999px", border: i === selectedVariant ? "2px solid var(--accent)" : "1px solid #D0D0D0", background: i === selectedVariant ? "var(--accent)" : "#F0EDE8", cursor: "pointer", transition: "background 150ms ease, border 150ms ease", fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 600, color: i === selectedVariant ? "#fff" : "#444444" }}>
                    <span style={{ width: "16px", height: "16px", borderRadius: "9999px", background: v.color, border: "1px solid rgba(0,0,0,0.1)", display: "inline-block", flexShrink: 0 }} />
                    {v.label}
                    {v.price !== variantPrice && <span style={{ fontSize: "11px", opacity: 0.8 }}>+₹{v.price - variantPrice}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pack Options */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "12px" }}>Pack Size:</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {packOptions.map((p, i) => {
                  const pTotal = Math.round(variantPrice * p.multiplier * (1 - p.discount / 100));
                  return (
                    <button key={i} onClick={() => setSelectedPack(i)} className="focus-ring" style={{ padding: "12px 16px", borderRadius: "12px", border: i === selectedPack ? "2px solid var(--accent)" : "1px solid #E0E0E0", background: i === selectedPack ? "rgba(201,126,74,0.06)" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 150ms ease", fontFamily: "'Manrope', sans-serif" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{p.label}</div>
                      <div style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 700, marginTop: "2px" }}>₹{pTotal}</div>
                      {p.discount > 0 && <div style={{ fontSize: "11px", color: "#16A34A", fontWeight: 600 }}>Save {p.discount}%</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "12px" }}>Quantity:</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0", width: "fit-content" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="focus-ring" style={{ width: "44px", height: "44px", border: "1px solid #D0D0D0", borderRight: "none", borderRadius: "4px 0 0 4px", background: "#fff", cursor: "pointer", fontSize: "20px", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope', sans-serif", transition: "background 150ms ease" }} onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")} onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>−</button>
                <div style={{ width: "64px", height: "44px", border: "1px solid #D0D0D0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "var(--text)", background: "#fff" }}>{quantity}</div>
                <button onClick={() => setQuantity(q => q + 1)} className="focus-ring" style={{ width: "44px", height: "44px", border: "1px solid #D0D0D0", borderLeft: "none", borderRadius: "0 4px 4px 0", background: "#fff", cursor: "pointer", fontSize: "20px", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope', sans-serif", transition: "background 150ms ease" }} onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")} onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>+</button>
              </div>
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>Total: {totalUnits} pens</p>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              <button onClick={handleAddToCart} className="focus-ring" style={{ width: "100%", height: "56px", borderRadius: "12px", border: "none", background: addedState ? "#16A34A" : "var(--accent)", color: "#fff", fontSize: "16px", fontWeight: 700, fontFamily: "'Manrope', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 300ms ease, transform 150ms ease", letterSpacing: "0.01em" }} onMouseEnter={e => { if (!addedState) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#b86d3a"; } }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = addedState ? "#16A34A" : "var(--accent)"; }} onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                {addedState ? (
                  <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Added to Cart</>
                ) : (
                  <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> Add to Cart — ₹{finalPrice.toLocaleString("en-IN")}</>
                )}
              </button>
              <button onClick={handleBuyNow} className="focus-ring" style={{ width: "100%", height: "56px", borderRadius: "12px", border: "2px solid var(--primary)", background: "var(--primary)", color: "#fff", fontSize: "16px", fontWeight: 700, fontFamily: "'Manrope', sans-serif", cursor: "pointer", transition: "transform 150ms ease, background 200ms ease", letterSpacing: "0.01em" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#333"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "var(--primary)"; }} onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                Buy Now
              </button>
            </div>

            {/* Mini trust row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "28px", padding: "16px 0", borderTop: "1px solid #E0E0E0", borderBottom: "1px solid #E0E0E0" }}>
              {[{ label: "10,000+ sold" }, { label: "Free ship ₹499+" }, { label: "Made in India" }, { label: "7-day returns" }].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {t.label}
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#444444" }}>
                The <strong>{displayName}</strong> delivers a smooth, consistent writing experience that students and professionals rely on every day. Engineered with a precision-formed tungsten carbide ball tip for skip-free performance, it writes reliably from the first stroke to the last.
              </p>
              <ul style={{ marginTop: "16px", paddingLeft: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Smooth tungsten carbide tip — zero skipping", "Comfortable hexagonal grip — fatigue-free writing", "Fade-resistant {ink color} pigment ink", "Consistent flow from 1st to last stroke", "Smooth barrel, 0.7mm tip — ideal for fine writing"].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", lineHeight: 1.6, color: "#444444" }}>
                    <svg style={{ marginTop: "3px", flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {item.replace('{ink color}', inkVariants[selectedVariant].label.split(' ')[0].toLowerCase())}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accordion */}
            <div style={{ border: "1px solid #E0E0E0", borderRadius: "12px", overflow: "hidden" }}>
              <button onClick={() => setAccordionOpen(o => !o)} className="focus-ring" style={{ width: "100%", padding: "18px 20px", background: "#fff", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Manrope', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>
                Product Details & Specifications
                <svg style={{ transform: accordionOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 250ms ease" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {accordionOpen && (
                <div style={{ padding: "0 20px 20px", background: "#fafafa" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    {[["Tip Size", "0.7mm"], ["Ink Type", "Oil-based ballpoint"], ["Body Material", "Polypropylene"], ["Cap Type", "Click mechanism"], ["Weight", "8g"], ["Length", "148mm"], ["Country of Origin", "India"], ["Pack Options", "Single, 5, 10, 20 pens"]].map(([k, v], i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #E0E0E0" }}>
                        <td style={{ padding: "10px 0", fontWeight: 600, color: "var(--muted)", width: "45%" }}>{k}</td>
                        <td style={{ padding: "10px 0", color: "var(--text)" }}>{v}</td>
                      </tr>
                    ))}
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC VALUE PACK VISUAL FINGERPRINT — Variant Selector Showcase */}
      <section className="reveal" style={{ padding: "80px clamp(24px, 5vw, 80px)", background: "#fff", borderTop: "1px solid #E0E0E0", borderBottom: "1px solid #E0E0E0" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px" }}>Choose Your Ink</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "0.02em", color: "var(--text)", marginBottom: "40px" }}>Pick Your Colour & Save More</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {inkVariants.map((v, i) => (
              <div key={i} onClick={() => { setSelectedVariant(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: "#faf7f2", border: i === selectedVariant ? "2px solid var(--accent)" : "1px solid #E0E0E0", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 300ms cubic-bezier(0.4,0,0.2,1)", boxShadow: i === selectedVariant ? "0 8px 32px rgba(201,126,74,0.15)" : "0 2px 8px rgba(26,26,26,0.05)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(26,26,26,0.12)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = i === selectedVariant ? "0 8px 32px rgba(201,126,74,0.15)" : "0 2px 8px rgba(26,26,26,0.05)"; }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {[14, 10, 12].map((size, j) => (
                    <div key={j} style={{ width: `${size}px`, height: `${size}px`, borderRadius: "9999px", background: v.color, border: `${i === selectedVariant ? "2px solid var(--accent)" : "1px solid #D0D0D0"}`, opacity: j === 0 ? 1 : 0.5 + j * 0.15 }} />
                  ))}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>{v.label}</div>
                <div style={{ fontSize: "24px", fontFamily: "'Bebas Neue', sans-serif", color: "var(--accent)", letterSpacing: "0.02em" }}>₹{v.price}</div>
                <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>Pack of 10 for ₹{v.price * 10 - 5} · ₹{((v.price * 10 - 5) / 10).toFixed(1)}/pen</div>
                {i === selectedVariant && <div style={{ marginTop: "10px", fontSize: "11px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Selected ✓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="reveal" style={{ padding: "96px clamp(24px, 5vw, 80px)", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "48px" }}>
            <div>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px" }}>What people say</p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "0.02em", color: "var(--text)" }}>Customer Reviews</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "3px" }}>{[1,2,3,4,5].map(s => <svg key={s} width="24" height="24" viewBox="0 0 24 24" fill="var(--accent)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <div><div style={{ fontSize: "28px", fontFamily: "'Bebas Neue', sans-serif", color: "var(--text)", lineHeight: 1 }}>4.8 / 5</div><div style={{ fontSize: "12px", color: "var(--muted)" }}>2,847 verified reviews</div></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {reviews.map((r, i) => (
              <div key={i} className="reveal" style={{ background: "#fff", borderRadius: "16px", padding: "28px", border: "1px solid #E0E0E0", transition: "all 300ms cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(201,126,74,0.12)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(26,26,26,0.05)"; }}>
                <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= r.rating ? "var(--accent)" : "#E0E0E0"} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                </div>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#444444", marginBottom: "20px", fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{r.avatar}</div>
                  <div><div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{r.name}</div><div style={{ fontSize: "12px", color: "var(--muted)" }}>{r.date}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOU MIGHT ALSO LIKE */}
      <section className="reveal" style={{ padding: "80px clamp(24px, 5vw, 80px)", background: "#fff", borderTop: "1px solid #E0E0E0" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px" }}>Keep writing</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "0.02em", color: "var(--text)", marginBottom: "40px" }}>You Might Also Like</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {[{ name: "Blue Ink Ballpen — Pack of 10", price: 65, desc: "Classic reliable blue ink" }, { name: "Black Ink Ballpen — Pack of 5", price: 32, desc: "Crisp black for official use" }, { name: "Assorted Colour Pack — 20 Pens", price: 110, desc: "4 colours, 5 each" }, { name: "Red Ink Precision Pen", price: 8, desc: "Bold marking & correction" }].map((p, i) => (
              <article key={i} onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent("/product-1.jpg")}`)} style={{ cursor: "pointer", border: "1px solid #E0E0E0", borderRadius: "16px", overflow: "hidden", background: "#faf7f2", transition: "all 300ms cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 2px 8px rgba(26,26,26,0.05)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(26,26,26,0.12)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(26,26,26,0.05)"; }}>
                <div style={{ overflow: "hidden", aspectRatio: "1/1", background: "#fff" }}>
                  <img src="/product-1.jpg" alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </div>
                <div style={{ padding: "16px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "4px", lineHeight: 1.4 }}>{p.name}</h3>
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>{p.desc}</p>
                  <p style={{ fontSize: "18px", fontFamily: "'Bebas Neue', sans-serif", color: "var(--accent)", letterSpacing: "0.02em" }}>₹{p.price.toLocaleString("en-IN")}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section id="brand-story" className="reveal" style={{ padding: "96px clamp(24px, 5vw, 80px)", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "16px" }}>Our Promise</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "0.02em", color: "var(--text)", marginBottom: "24px", lineHeight: 1.1 }}>Quality You Can Trust at Prices You Love</h2>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#444444", marginBottom: "24px" }}>At Ballpoint Trust, we believe great writing shouldn't cost a fortune. Every pen we make goes through rigorous quality checks — from ink viscosity to tip precision — so that whether you're a student jotting lecture notes or an office professional signing contracts, your pen never lets you down.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[{ title: "Consistent Ink Flow", desc: "Precision-engineered tip delivers smooth, even ink from first stroke to last." }, { title: "Comfortable Grip", desc: "Ergonomic barrel designed for extended writing without hand fatigue." }, { title: "Exceptional Value", desc: "Premium quality at ₹2–₹10 — because reliable writing is a right, not a luxury." }].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(201,126,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div><div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>{item.title}</div><div style={{ fontSize: "14px", lineHeight: 1.6, color: "#666666" }}>{item.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ overflow: "hidden", borderRadius: "20px", border: "1px solid #E0E0E0", aspectRatio: "4/3" }}>
            <img src="/product-1.jpg" alt="Ballpoint Trust pens in use on a desk" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer-contact" style={{ background: "#333333", color: "#fff", padding: "64px clamp(24px, 5vw, 80px) 0" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", paddingBottom: "48px" }}>
          {/* Col 1 */}
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px", letterSpacing: "0.05em", color: "#fff", marginBottom: "12px" }}>BALLPOINT TRUST</div>
            <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#AAAAAA", marginBottom: "24px" }}>Your everyday writing companion. Reliable pens for students, professionals, and institutions across India.</p>
            <div style={{ display: "flex", gap: "16px" }}>
              {["instagram", "facebook", "twitter"].map(platform => (
                <button key={platform} onClick={() => window.open(`https://${platform}.com`, '_blank')} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                  {platform === "instagram" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>}
                  {platform === "facebook" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>}
                  {platform === "twitter" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>}
                </button>
              ))}
            </div>
          </div>
          {/* Col 2 */}
          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "#fff", marginBottom: "20px" }}>Shop</div>
            {["All Pens", "Bundles", "Best Sellers", "Bulk Orders"].map((link, i) => (
              <button key={i} onClick={() => router.push('/shop')} className="focus-ring" style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#DDDDDD", marginBottom: "10px", fontFamily: "'Manrope', sans-serif", textAlign: "left", padding: 0 }}>{link}</button>
            ))}
          </div>
          {/* Col 3 */}
          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "#fff", marginBottom: "20px" }}>Learn</div>
            {[{ label: "Our Story", action: () => document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' }) }, { label: "Quality Promise", action: () => document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' }) }, { label: "FAQ", action: () => {} }, { label: "Contact Us", action: () => {} }].map((link, i) => (
              <button key={i} onClick={link.action} className="focus-ring" style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#DDDDDD", marginBottom: "10px", fontFamily: "'Manrope', sans-serif", textAlign: "left", padding: 0 }}>{link.label}</button>
            ))}
          </div>
          {/* Col 4 — Newsletter */}
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "12px", fontFamily: "'Manrope', sans-serif" }}>Stay in the loop</div>
            <p style={{ fontSize: "13px", color: "#AAAAAA", marginBottom: "16px", lineHeight: 1.6 }}>Get deals, new arrivals & writing tips in your inbox.</p>
            {subSuccess ? (
              <div style={{ padding: "14px", borderRadius: "8px", background: "rgba(22,163,74,0.2)", border: "1px solid #16A34A", fontSize: "14px", color: "#4ade80", fontWeight: 600 }}>✓ You're subscribed! Thank you.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="email" value={emailVal} onChange={e => setEmailVal(e.target.value)} placeholder="your@email.com" style={{ height: "44px", padding: "0 14px", border: "1px solid #AAAAAA", borderRadius: "4px", background: "transparent", color: "#fff", fontSize: "14px", fontFamily: "'Manrope', sans-serif", outline: "none" }} onKeyDown={e => e.key === 'Enter' && handleSubscribe()} />
                <button onClick={handleSubscribe} className="focus-ring" style={{ height: "44px", background: "var(--accent)", border: "none", borderRadius: "4px", color: "#fff", fontSize: "15px", fontWeight: 700, fontFamily: "'Manrope', sans-serif", cursor: "pointer", transition: "transform 150ms ease, background 200ms ease" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#b86d3a"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "var(--accent)"; }}>Subscribe</button>
              </div>
            )}
          </div>
        </div>
        {/* Bottom strip */}
        <div style={{ borderTop: "1px solid #444444", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", maxWidth: "1320px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#AAAAAA", fontFamily: "'Manrope', sans-serif" }}>© 2025 Ballpoint Trust</span>
            <button onClick={() => window.open('/privacy', '_blank')} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#AAAAAA", fontFamily: "'Manrope', sans-serif" }}>Privacy Policy</button>
            <button onClick={() => window.open('/terms', '_blank')} className="focus-ring" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#AAAAAA", fontFamily: "'Manrope', sans-serif" }}>Terms of Service</button>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {[{ label: "UPI" }, { label: "Visa" }, { label: "MC" }].map((pay, i) => (
              <div key={i} style={{ height: "26px", padding: "0 10px", borderRadius: "4px", background: "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{pay.label}</div>
            ))}
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div className="mobile-only" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 800, background: "#fff", borderTop: "1px solid #E0E0E0", padding: "12px 20px", display: "none", alignItems: "center", justifyContent: "space-between", gap: "12px", boxShadow: "0 -4px 20px rgba(26,26,26,0.1)" }}>
        <div>
          <div style={{ fontSize: "22px", fontFamily: "'Bebas Neue', sans-serif", color: "var(--accent)", letterSpacing: "0.02em" }}>₹{finalPrice.toLocaleString("en-IN")}</div>
          <div style={{ fontSize: "11px", color: "var(--muted)" }}>₹{perUnit}/pen · {totalUnits} pens</div>
        </div>
        <button onClick={handleAddToCart} className="focus-ring" style={{ flex: 1, height: "48px", borderRadius: "12px", border: "none", background: addedState ? "#16A34A" : "var(--accent)", color: "#fff", fontSize: "15px", fontWeight: 700, fontFamily: "'Manrope', sans-serif", cursor: "pointer", transition: "background 300ms ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {addedState ? "✓ Added" : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow} className="focus-ring" style={{ height: "48px", padding: "0 20px", borderRadius: "12px", border: "2px solid var(--primary)", background: "var(--primary)", color: "#fff", fontSize: "15px", fontWeight: 700, fontFamily: "'Manrope', sans-serif", cursor: "pointer" }}>Buy</button>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontFamily: "'Manrope', sans-serif", color: "var(--muted)", fontSize: "16px" }}>Loading…</div></div>}>
      <ProductContent />
    </Suspense>
  );
}