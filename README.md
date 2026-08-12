# Wangoh — Interactive Travel Website

A cinematic, immersive travel website featuring an airplane window parallax experience, country exploration, flight animations, and city discovery.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

## Features

- **Airplane Window Scroll Experience** — GSAP ScrollTrigger-powered parallax scene with layered clouds, cabin interior, and a cinematic reveal of Central Park
- **Country Cards** — Glassmorphism-styled cards for Japan, USA, Italy, France, Thailand, South Korea with hover animations
- **Flight Animation** — Full-screen SVG world map with animated flight path from Istanbul to the selected destination
- **City Cards** — City-level exploration for each country with image backgrounds and descriptions
- **Responsive Design** — Desktop, tablet, and mobile layouts via Tailwind CSS

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- GSAP + ScrollTrigger

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles, glassmorphism utilities
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main page (view router)
├── components/
│   ├── AirplaneWindow.tsx   # Scroll-based parallax scene
│   ├── CountryCards.tsx     # Country selection grid
│   ├── FlightAnimation.tsx  # SVG map flight animation
│   └── CityCards.tsx        # City exploration grid
└── data/
    └── destinations.ts  # All country/city data (easy to extend)
```

## Adding New Countries

Edit `src/data/destinations.ts` and add a new entry to the `countries` array:

```ts
{
  name: "Germany",
  code: "DE",
  flag: "🇩🇪",
  description: "Your description here.",
  image: "https://images.unsplash.com/photo-...",
  coordinates: { lat: 52.52, lng: 13.405 },
  cities: [
    { name: "Berlin", description: "...", image: "https://..." },
  ],
}
```

No other files need to change.

## Image Credits

All images sourced from [Unsplash](https://unsplash.com) (free to use under the Unsplash License).

## License

MIT
