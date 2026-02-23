# LAFUMEE - Smoke & Neon Lounge

An immersive, scroll-driven creative website for a premium hookah lounge featuring a cinematic 3D scene with custom GLSL smoke shaders, neon effects, and GSAP animations.

## Features

- **3D WebGL Experience**: Custom Three.js scene with @react-three/fiber
- **Custom GLSL Smoke Shader**: FBM noise-based smoke simulation with touch/tilt interaction
- **Neon Sign**: Interactive 3D neon text with pulse animations
- **GSAP ScrollTrigger**: Smooth camera movements and section transitions
- **Mobile Gyro Support**: Device orientation for parallax effects
- **Cookie & Motion Consent**: GDPR-compliant consent modal with iOS motion permission
- **Performance Optimization**: Adaptive DPR, quality settings, lazy loading
- **Dark Luxury Design**: Glassmorphism panels with Tailwind CSS

## Quick Start

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### Business Information (`src/app/config.ts`)

Edit this file to customize your business details:

```typescript
export const config = {
  brandName: "LAFUMEE",
  tagline: "Smoke & Neon Lounge",
  phone: "+1 (555) 123-4567",
  whatsappLink: "https://wa.me/15551234567",
  mapsLink: "https://maps.google.com/?q=Your+Address",
  instagramLink: "https://instagram.com/yourhandle",
  address: {
    street: "123 Your Street",
    city: "City Name",
    state: "ST",
    zip: "12345",
    full: "123 Your Street, City Name, ST 12345"
  },
  openingHours: [
    { days: "Monday - Thursday", hours: "5:00 PM - 1:00 AM" },
    { days: "Friday - Saturday", hours: "5:00 PM - 3:00 AM" },
    { days: "Sunday", hours: "4:00 PM - 12:00 AM" }
  ],
  // ... more options
};
```

### Menu Data (`src/data/menu.json`)

Edit the JSON file to update your menu:

```json
{
  "categories": [
    {
      "id": "hookah",
      "name": "Hookah",
      "icon": "smoke",
      "items": [
        {
          "id": "h1",
          "name": "Classic Mint",
          "description": "Fresh spearmint blend",
          "price": 25,
          "tags": ["bestseller"]
        }
      ]
    }
  ]
}
```

Available tags: `bestseller`, `new`, `premium`, `vegan`, `spicy`, `0%`

### Images

Replace images in the `public/images/` directory:
- Gallery images are loaded from Unsplash by default
- Update the `galleryImages` array in `src/app/sections/Gallery.tsx`
- Recommended formats: WebP or optimized JPEG

## Cookie & Motion Consent

The website includes a comprehensive consent system:

### Cookies Consent
- Required before using the site
- Stores preference for 180 days
- If declined, no localStorage/cookies are written (session-only state)

### Motion Permission (iOS)
- Required for gyroscope effects on iPhone/iPad
- Must be requested from a user gesture (button click)
- Works automatically on Android/desktop

### How it Works
1. On first visit, a blocking modal appears
2. User must accept or decline cookies
3. User can optionally enable motion features
4. Settings can be changed anytime via "Privacy & Motion Settings" button

### Respecting Preferences
- `prefers-reduced-motion` is respected
- Motion disabled by default even if permitted when reduced motion is enabled

## Performance Tuning

### Quality Settings
The site auto-detects device capability and adjusts:

- **High Quality**: Full DPR, DOF effects, 6 octaves smoke
- **Low Quality**: Reduced DPR (0.6-0.8), no DOF, 3 octaves smoke

Users can manually toggle via the Quality Toggle component.

### Adaptive Features
- `navigator.deviceMemory` detection
- Hardware concurrency check
- Mobile device detection
- FPS monitoring (first 2 seconds)

### Manual Optimization
Edit `src/three/postprocessing/Effects.tsx`:
```typescript
const settings = {
  high: {
    bloom: { intensity: 0.8, /* ... */ },
    dpr: 1.5,
  },
  low: {
    bloom: { intensity: 0.5, /* ... */ },
    dpr: 0.8,
  }
};
```

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Main app component
│   ├── config.ts            # Business configuration
│   ├── ConsentContext.tsx   # Consent state management
│   ├── components/
│   │   ├── ConsentModal.tsx
│   │   ├── CTAButtons.tsx
│   │   ├── GlassPanel.tsx
│   │   ├── Nav.tsx
│   │   ├── QualityToggle.tsx
│   │   ├── ReserveModal.tsx
│   │   └── SectionIndicator.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── Hookah.tsx
│       ├── Drinks.tsx
│       ├── FoodMenu.tsx
│       ├── Gallery.tsx
│       └── Contact.tsx
├── three/
│   ├── CanvasScene.tsx      # Main 3D canvas
│   ├── CameraRig.tsx        # ScrollTrigger camera
│   ├── NeonSign.tsx         # Interactive neon
│   ├── Smoke.tsx            # GLSL smoke shader
│   ├── interactions/
│   │   ├── useGyro.ts
│   │   ├── useDragRotate.ts
│   │   └── usePointerTouch.ts
│   └── postprocessing/
│       └── Effects.tsx
├── data/
│   └── menu.json
└── styles/
    └── (via index.css)
```

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **GSAP** + **ScrollTrigger**
- **TailwindCSS**
- **Postprocessing** (bloom, vignette, DOF)
- **Custom GLSL Shaders**

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14.5+ for motion permission)

## Known Limitations

1. **iOS Motion**: Requires explicit permission via button click (Safari security)
2. **WebGL**: Falls back gracefully on unsupported browsers
3. **Performance**: Heavy on low-end mobile devices (auto-detects and adjusts)

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Run linter
npm run format   # Format code
```

## License

Private - All rights reserved.

---

Built with love for great vibes.
