"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

/**
 * Click-to-load map: a static SVG location card until the visitor asks for the
 * interactive map, so the Google Maps iframe (~1 MB of JS) never loads by default.
 */
export function MapFacade({ embedUrl, mapsUrl, label }: { embedUrl: string; mapsUrl: string; label: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={embedUrl}
        title={`Map: ${label}`}
        className="map-dark absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <div className="absolute inset-0">
      {/* Abstract street grid around the pin (decorative, not to scale). */}
      <svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <rect width="600" height="340" fill="#07090d" />
        <g stroke="rgb(255 255 255 / 0.06)" strokeWidth="1">
          {Array.from({ length: 16 }, (_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40 - 60} y2="340" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40 + 30} />
          ))}
        </g>
        <path d="M0 220 C 150 200 260 260 600 150" stroke="rgb(255 255 255 / 0.14)" strokeWidth="6" fill="none" />
        <path d="M380 0 C 360 120 400 220 340 340" stroke="rgb(255 176 32 / 0.35)" strokeWidth="5" fill="none" />
        <circle cx="300" cy="170" r="70" fill="url(#mapglow)" />
        <defs>
          <radialGradient id="mapglow">
            <stop offset="0" stopColor="#00B4F0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#00B4F0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="170" r="7" fill="#00B4F0" />
        <circle cx="300" cy="170" r="16" fill="none" stroke="#00B4F0" strokeOpacity="0.6" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-bg via-bg/80 to-transparent p-5 pt-16 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-sm text-fg-2">
          <span className="block text-fg">{label}</span>
          Interactive map loads from Google only when you ask.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line-strong bg-bg/70 px-4 text-sm hover:border-cyan/60"
          >
            <Icon name="pin" className="size-4" /> Load map
          </button>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan px-4 text-sm font-medium text-bg">
            Directions <Icon name="arrow-up-right" className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
