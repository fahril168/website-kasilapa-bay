"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    window.location.replace("/id");
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#1a1714",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <meta httpEquiv="refresh" content="0;url=/id" />
      <img
        src="/img/logo-putih.png"
        alt="Kasilapa Bay"
        style={{ width: "64px", height: "auto", marginBottom: "16px", opacity: 0.8 }}
      />
      <p style={{ color: "#c8956c", fontFamily: "serif", fontSize: "1.1rem", margin: 0 }}>
        Memuat Kasilapa Bay...
      </p>
    </div>
  );
}
