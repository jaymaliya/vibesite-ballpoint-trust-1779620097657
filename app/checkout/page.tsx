"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items = [], clearCart } = useCart() ?? {};
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [qrData, setQrData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const subtotal = items.reduce((sum, item) => sum + (item.price || 7) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    if (pollingActive && qrData && !paid) {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/order-status?orderId=${qrData.orderId}`);
          const data = await res.json();
          if (data.paid) {
            setPaid(true);
            setPollingActive(false);
            clearCart?.();
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        } catch (_) {}
      }, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pollingActive, qrData, paid]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!address.trim()) e.address = "Address is required";
    if (!city.trim()) e.city = "City is required";
    if (!state.trim()) e.state = "State is required";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) e.pin = "Enter a valid 6-digit PIN code";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePayViaUPI() {
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: address + " " + city + " " + state + " " + pin,
          items: JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, price: i.price || 7 }))),
        }),
      });
      const data = await res.json();
      setQrData(data);
      setPollingActive(true);
    } catch (_) {
      setPaying(false);
    }
    setPaying(false);
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    height: "48px",
    padding: "0 16px",
    border: errors[field] ? "2px solid #e53e3e" : "1.5px solid #e0d6cc",
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontFamily: "'Manrope', sans-serif",
    fontSize: "15px",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 200ms ease",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Manrope', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "6px",
    letterSpacing: "0.03em",
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "12px",
    color: "#e53e3e",
    marginTop: "4px",
  };

  if (paid && qrData) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "'Manrope', sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "64px 48px",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 24px 64px -12px rgba(26,26,26,0.12)",
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #c97e4a22 0%, #c97e4a33 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#c97e4a" />
              <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2.8rem",
            color: "var(--text)",
            letterSpacing: "0.02em",
            marginBottom: "12px",
          }}>Payment Successful!</h1>
          <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "8px" }}>
            Thank you, <strong style={{ color: "var(--text)" }}>{name}</strong>! Your order has been confirmed.
          </p>
          <div style={{
            background: "#faf7f2",
            borderRadius: "12px",
            padding: "16px 24px",
            margin: "24px 0",
            border: "1px solid #e0d6cc",
          }}>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>Order ID</p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--accent)", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.04em" }}>
              #{qrData.orderId?.slice(-8)?.toUpperCase() || "XXXXXXXX"}
            </p>
          </div>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "32px" }}>
            We'll send a confirmation to <strong style={{ color: "var(--text)" }}>{email}</strong>
          </p>
          <button
            onClick={() => router.push("/")}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px -8px rgba(201,126,74,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 20px -6px rgba(201,126,74,0.3)"; }}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
            style={{
              width: "100%",
              height: "52px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms ease",
              boxShadow: "0 6px 20px -6px rgba(201,126,74,0.3)",
            }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "'Manrope', sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "#f0ebe3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#b09a82" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" stroke="#b09a82" strokeWidth="1.8" />
              <path d="M16 10a4 4 0 01-8 0" stroke="#b09a82" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", color: "var(--text)", marginBottom: "12px", letterSpacing: "0.02em" }}>
            Your Bag is Empty
          </h2>
          <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "32px" }}>
            Looks like you haven't added any pens yet. Explore our collection of reliable ballpens starting at just ₹2.
          </p>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
            style={{
              padding: "16px 40px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "transform 200ms cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 6px 20px -6px rgba(201,126,74,0.35)",
            }}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* QR Modal */}
      {qrData && !paid && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(26,26,26,0.72)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "40px 32px",
            maxWidth: "380px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 32px 80px -16px rgba(26,26,26,0.25)",
            position: "relative",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "8px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#c97e4a" strokeWidth="1.8" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#c97e4a" strokeWidth="1.8" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#c97e4a" strokeWidth="1.8" />
                <circle cx="17.5" cy="17.5" r="1.5" fill="#c97e4a" />
                <path d="M14 14h3v3" stroke="#c97e4a" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.8rem",
                color: "var(--text)",
                letterSpacing: "0.04em",
              }}>
                Scan & Pay ₹{total.toLocaleString("en-IN")}
              </h2>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "24px" }}>
              Open any UPI app and scan the QR code below
            </p>
            <div style={{
              background: "#faf7f2",
              borderRadius: "16px",
              padding: "20px",
              display: "inline-block",
              border: "1px solid #e0d6cc",
              marginBottom: "20px",
            }}>
              {qrData.qrBase64 ? (
                <img
                  src={`data:image/png;base64,${qrData.qrBase64}`}
                  width={220}
                  height={220}
                  alt="UPI QR Code for payment"
                  style={{ display: "block" }}
                />
              ) : (
                <div style={{
                  width: "220px",
                  height: "220px",
                  background: "#f0ebe3",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "12px",
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#c97e4a" strokeWidth="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#c97e4a" strokeWidth="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#c97e4a" strokeWidth="1.5" />
                    <circle cx="17.5" cy="17.5" r="1.5" fill="#c97e4a" />
                  </svg>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>UPI ID: ballpointtrust@upi</p>
                </div>
              )}
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "20px",
            }}>
              <PulsingDot />
              <span style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--accent)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}>
                Waiting for payment...
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "20px" }}>
              Do not close this window. Payment confirmation is automatic.
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => (
                <span key={app} style={{
                  padding: "4px 12px",
                  background: "#f0ebe3",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                }}>
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0d6cc",
        padding: "0 48px",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(26,26,26,0.06)",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "24px",
            letterSpacing: "0.08em",
            color: "var(--text)",
            padding: "4px 0",
          }}>
          Ballpoint Trust
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--muted)", fontSize: "14px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="11" rx="2" stroke="#b09a82" strokeWidth="1.8" />
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#b09a82" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontWeight: 600 }}>Secure Checkout</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 96px" }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "40px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--muted)" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 0, fontFamily: "'Manrope', sans-serif", fontSize: "13px" }}>Home</button>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#b09a82" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <button onClick={() => router.push("/shop")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 0, fontFamily: "'Manrope', sans-serif", fontSize: "13px" }}>Shop</button>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#b09a82" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{ color: "var(--text)", fontWeight: 600 }}>Checkout</span>
        </nav>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
          letterSpacing: "0.02em",
          color: "var(--text)",
          marginBottom: "40px",
          lineHeight: 1.1,
        }}>
          Complete Your Order
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)",
          gap: "40px",
          alignItems: "start",
        }}>
          {/* Left: Form */}
          <div>
            {/* Delivery Info */}
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "36px",
              marginBottom: "24px",
              border: "1px solid #e0d6cc",
              boxShadow: "0 4px 16px -6px rgba(26,26,26,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px", fontFamily: "'Manrope', sans-serif" }}>1</span>
                </div>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.6rem",
                  letterSpacing: "0.04em",
                  color: "var(--text)",
                  margin: 0,
                }}>
                  Delivery Information
                </h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Full Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
                    placeholder="e.g. Rahul Sharma"
                    style={inputStyle("name")}
                    onFocus={e => { e.currentTarget.style.borderColor = "#c97e4a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,126,74,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.name ? "#e53e3e" : "#e0d6cc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {errors.name && <p style={errorStyle}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
                    placeholder="you@example.com"
                    style={inputStyle("email")}
                    onFocus={e => { e.currentTarget.style.borderColor = "#c97e4a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,126,74,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.email ? "#e53e3e" : "#e0d6cc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {errors.email && <p style={errorStyle}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); if (errors.phone) setErrors(p => ({ ...p, phone: "" })); }}
                    placeholder="10-digit mobile"
                    style={inputStyle("phone")}
                    onFocus={e => { e.currentTarget.style.borderColor = "#c97e4a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,126,74,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.phone ? "#e53e3e" : "#e0d6cc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                </div>

                {/* Address */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Street Address *</label>
                  <textarea
                    value={address}
                    onChange={e => { setAddress(e.target.value); if (errors.address) setErrors(p => ({ ...p, address: "" })); }}
                    placeholder="House no., Street, Locality"
                    rows={3}
                    style={{
                      ...inputStyle("address"),
                      height: "auto",
                      padding: "12px 16px",
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#c97e4a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,126,74,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.address ? "#e53e3e" : "#e0d6cc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {errors.address && <p style={errorStyle}>{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label style={labelStyle}>City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => { setCity(e.target.value); if (errors.city) setErrors(p => ({ ...p, city: "" })); }}
                    placeholder="e.g. Mumbai"
                    style={inputStyle("city")}
                    onFocus={e => { e.currentTarget.style.borderColor = "#c97e4a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,126,74,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.city ? "#e53e3e" : "#e0d6cc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {errors.city && <p style={errorStyle}>{errors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label style={labelStyle}>State *</label>
                  <select
                    value={state}
                    onChange={e => { setState(e.target.value); if (errors.state) setErrors(p => ({ ...p, state: "" })); }}
                    style={{ ...inputStyle("state"), cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23b09a82' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#c97e4a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,126,74,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.state ? "#e53e3e" : "#e0d6cc"; e.currentTarget.style.boxShadow = "none"; }}>
                    <option value="">Select State</option>
                    {["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p style={errorStyle}>{errors.state}</p>}
                </div>

                {/* PIN */}
                <div>
                  <label style={labelStyle}>PIN Code *</label>
                  <input
                    type="text"
                    value={pin}
                    onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); if (errors.pin) setErrors(p => ({ ...p, pin: "" })); }}
                    placeholder="6-digit PIN"
                    style={inputStyle("pin")}
                    onFocus={e => { e.currentTarget.style.borderColor = "#c97e4a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,126,74,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.pin ? "#e53e3e" : "#e0d6cc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid #e0d6cc",
              boxShadow: "0 4px 16px -6px rgba(26,26,26,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px", fontFamily: "'Manrope', sans-serif" }}>2</span>
                </div>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.6rem",
                  letterSpacing: "0.04em",
                  color: "var(--text)",
                  margin: 0,
                }}>
                  Payment Method
                </h2>
              </div>

              {/* UPI Option */}
              <div style={{
                border: "2px solid var(--accent)",
                borderRadius: "14px",
                padding: "20px 24px",
                background: "rgba(201,126,74,0.04)",
                marginBottom: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "2px solid var(--accent)",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text)" }}>UPI / QR Code</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
                    {["GPay", "PhonePe", "Paytm"].map(app => (
                      <span key={app} style={{
                        padding: "3px 10px",
                        background: "#f0ebe3",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--muted)",
                      }}>{app}</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                  Scan QR code with any UPI app. Instant confirmation. No transaction fees.
                </p>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
                {[
                  { icon: "M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z", label: "256-bit SSL" },
                  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "100% Secure" },
                  { icon: "M20 7H4C2.9 7 2 7.9 2 9v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 3H8L6 7h12l-2-4z", label: "Trusted Payments" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d={item.icon} stroke="#c97e4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePayViaUPI}
                disabled={paying}
                onMouseEnter={e => { if (!paying) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 14px 36px -8px rgba(201,126,74,0.45)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 20px -6px rgba(201,126,74,0.3)"; }}
                onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                style={{
                  width: "100%",
                  height: "56px",
                  background: paying ? "#d4a47a" : "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: paying ? "not-allowed" : "pointer",
                  transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms ease",
                  boxShadow: "0 6px 20px -6px rgba(201,126,74,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  letterSpacing: "0.02em",
                }}>
                {paying ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                      <path d="M12 3a9 9 0 019 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    Generating QR...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke="#fff" strokeWidth="1.8" />
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke="#fff" strokeWidth="1.8" />
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke="#fff" strokeWidth="1.8" />
                      <circle cx="17.5" cy="17.5" r="1.5" fill="#fff" />
                      <path d="M14 14h3v3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Pay ₹{total.toLocaleString("en-IN")} via UPI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div style={{ position: "sticky", top: "96px" }}>
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              border: "1px solid #e0d6cc",
              boxShadow: "0 4px 16px -6px rgba(26,26,26,0.06)",
            }}>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.6rem",
                letterSpacing: "0.04em",
                color: "var(--text)",
                marginBottom: "24px",
              }}>
                Order Summary
              </h2>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "1px solid #e0d6cc",
                      background: "#faf7f2",
                      position: "relative",
                    }}>
                      <img
                        src={item.image || "/product-1.jpg"}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #fff",
                      }}>
                        <span style={{ fontSize: "10px", color: "#fff", fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: 0, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: "13px", color: "var(--muted)", margin: "2px 0 0" }}>
                        Qty: {item.quantity} × ₹{(item.price || 7).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--accent)", flexShrink: 0, margin: 0 }}>
                      ₹{((item.price || 7) * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#e0d6cc", margin: "20px 0" }} />

              {/* Pricing breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "var(--muted)" }}>Subtotal</span>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "var(--muted)" }}>Shipping</span>
                  {shipping === 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.5H2M16 2l4 4.5-4 4.5M16 2v9M8 22l-4-4.5 4-4.5M8 22v-9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#16a34a" }}>FREE</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>₹{shipping}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <div style={{
                    background: "#faf7f2",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    border: "1px solid #e0d6cc",
                  }}>
                    <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                      Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for <strong style={{ color: "var(--accent)" }}>FREE shipping</strong>
                    </p>
                    <div style={{ height: "4px", background: "#e0d6cc", borderRadius: "999px", marginTop: "8px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        background: "var(--accent)",
                        borderRadius: "999px",
                        width: `${Math.min((subtotal / 500) * 100, 100)}%`,
                        transition: "width 400ms ease",
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#e0d6cc", margin: "20px 0" }} />

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.04em", color: "var(--text)" }}>TOTAL</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.02em", color: "var(--accent)" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Secure UPI payment — no data stored" },
                  { d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", text: "Easy returns within 7 days" },
                  { d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10", text: "Made in India — shipped nationwide" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d={item.d} stroke="#c97e4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo / Rating block */}
            <div style={{
              background: "rgba(201,126,74,0.08)",
              borderRadius: "14px",
              padding: "20px 24px",
              marginTop: "16px",
              border: "1px solid rgba(201,126,74,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#c97e4a">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", margin: 0 }}>4.8 / 5</p>
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "2px 0 0" }}>10,000+ happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: "#1a1a1a",
        padding: "24px 48px",
        textAlign: "center",
        borderTop: "1px solid #2a2a2a",
      }}>
        <p style={{ fontSize: "13px", color: "#666", fontFamily: "'Manrope', sans-serif", margin: 0 }}>
          © 2025 Ballpoint Trust · All rights reserved · Prices from ₹2/pen
        </p>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #faf7f2;
          --surface: #6b5b4a;
          --primary: #1a1a1a;
          --accent: #c97e4a;
          --text: #1a1a1a;
          --muted: #b09a82;
        }
        body { background: var(--bg); }
        @media (max-width: 768px) {
          main > div > div:first-child, main > div > div:last-child {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </div>
  );
}

function PulsingDot() {
  return (
    <div style={{
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: "#c97e4a",
      animation: "dot-pulse 1.2s ease-in-out infinite",
      flexShrink: 0,
    }} />
  );
}