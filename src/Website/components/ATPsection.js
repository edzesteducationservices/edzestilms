// src/components/AtpBadgeSection.jsx
import React from "react";

// If you put the logo in /public/images, you can use this path directly.
// Otherwise import it as a module:  import atpLogo from "../assets/pmi-atp-2025.png";
const LOGO_SRC = "/images/pmi-atp-2025.png"; // <-- place your logo here

export default function AtpBadgeSection() {
  return (
    <section className="atp-badge-wrap">
      <div className="container">
        <div className="atp-card">
          <div className="atp-media">
            <img
              src={LOGO_SRC}
              alt="PMI® Authorized Training Partner — 2025"
              loading="lazy"
            />
          </div>

          <div className="atp-text">
            <p className="atp-kicker">We’re officially recognized</p>
            <h2 className="atp-title">
              PMI<sup>®</sup> Authorized Training Partner (ATP)
            </h2>
            <p className="atp-sub">
              Train with confidence—our PMP<sup>®</sup> program is delivered by
              a PMI-approved provider (ATP 2025).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
