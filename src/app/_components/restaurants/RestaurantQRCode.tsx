// src/components/restaurants/RestaurantQRCode.tsx
"use client";

import React, { useCallback, useRef, useState } from "react";
import QRCode from "react-qr-code";

export default function RestaurantQRCode({ restaurantId }: { restaurantId: string }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // build URL for public menu — window.origin is available in browser
  const getPublicUrl = useCallback(() => {
    if (typeof window === "undefined") return `/menu/${restaurantId}`;
    return `${window.location.origin}/menu/${restaurantId}`;
  }, [restaurantId]);

  // copy link
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getPublicUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError("Could not copy link");
      console.error(e);
    }
  }

  // Web Share
  async function handleShare() {
    const url = getPublicUrl();
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: "Digital Menu Link",
          text: "Open this restaurant menu",
          url,
        });
      } catch (e) {
        // User cancelled share or other error
      }
    } else {
      // Fallback: Use copy button
      handleCopy();
    }
  }
  
  // Download PNG 
  function handleDownload() {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) {
      setError("QR code not found for download.");
      return;
    }

    setDownloading(true);
    // Simple logic to convert SVG to PNG
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        
        const downloadLink = document.createElement("a");
        downloadLink.href = pngFile;
        downloadLink.download = `menu-qr-${restaurantId}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setDownloading(false);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Share Menu QR Code</h3>
      
      {/* QR Code Display */}
      <div className="flex justify-center mb-4">
        <div ref={containerRef} className="inline-block bg-white p-4 border border-gray-200 rounded-lg shadow-md">
          <QRCode value={getPublicUrl()} size={180} level="H" />
        </div>
      </div>

      {/* Download Button */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
          disabled={downloading}
        >
          {downloading ? "Preparing..." : "Download QR Code (PNG)"}
        </button>
      </div>

      {/* Link and Sharing */}
      <div className="border-t pt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Public Menu Link</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={typeof window !== "undefined" ? getPublicUrl() : `/menu/${restaurantId}`}
            className="flex-1 border rounded px-3 py-2 text-sm bg-gray-50"
            aria-label="Public menu URL"
            readOnly
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition"
            title="Copy link"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-50 transition"
            title="Share link"
          >
            Share
          </button>
        </div>
      </div>
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
    </div>
  );
}