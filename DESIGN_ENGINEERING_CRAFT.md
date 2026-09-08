---
name: design-engineering-craft
description: Definitive standard for award-winning, physically grounded, luxury frontend design engineering. Covers anisotropic lighting, dual-stage elevation, spring settles, button-in-button CTAs, atmospheric canvas particle systems, Web Audio haptics, smooth scrolling, OKLCH color science, View Transitions, and 120 FPS performance rules. Use when building, polishing, or reviewing any frontend interface to achieve top-tier craft.
---

# Design Engineering & Frontend Craft Playbook

> A definitive, battle-tested standard for crafting award-winning, physically grounded, high-taste digital products.
> Use these rules across any frontend stack (React, Next.js, Vue, Svelte, Canvas 2D, Three.js/WebGL, Tailwind, CSS).

---

## 1. Materiality, Light & Spatial Depth

Digital interfaces look cheap and "plastic" when they rely solely on flat hex codes or single CSS box shadows. Real-world surfaces interact dynamically with ambient room lighting, possess micro-texture, and exhibit directional bevels.

### 1.1 Anisotropic Light vs. Rotating Diffuse Layers
- **The Principle:** When an object rotates, shines, or oscillates (discs, dials, volume knobs, metallic badges), its **specular light glint** stays stationary relative to the overhead room light, while the **diffuse surface texture** rotates underneath.
- **Architecture:**
  ```html
  <div class="turntable-disc">
    <!-- Rotates via CSS keyframes or requestAnimationFrame -->
    <div class="disc-grooves-and-label-spinning" />
    <!-- Stationary overlay capturing overhead glint -->
    <div class="anisotropic-sheen-stationary" />
    <!-- Center brass spindle (anchored) -->
    <div class="center-spindle" />
  </div>
  ```
- **CSS Sheen Recipe:** Use `conic-gradient` with `mix-blend-mode: screen` (dark themes) or `overlay` (light themes) at `opacity: 0.15–0.35`:
  ```css
  .anisotropic-sheen-stationary {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 45deg at 50% 50%,
      rgba(255, 255, 255, 0.28) 0deg,
      rgba(212, 231, 157, 0.16) 20deg,
      transparent 55deg,
      rgba(255, 255, 255, 0.08) 90deg,
      transparent 135deg,
      rgba(255, 255, 255, 0.28) 180deg,
      rgba(212, 231, 157, 0.16) 200deg,
      transparent 235deg,
      rgba(255, 255, 255, 0.08) 270deg,
      transparent 315deg,
      rgba(255, 255, 255, 0.28) 360deg
    );
    mix-blend-mode: screen;
    pointer-events: none;
  }
  ```

---

### 1.2 Dual-Stage Elevation Shadows (Contact + Atmospheric)
- **The Anti-Pattern:** A single muddy shadow: `box-shadow: 0 10px 20px rgba(0,0,0,0.5);`.
- **The Craft Standard:** Layer three distinct light components:
  1. **Contact Shadow:** Tight, high-opacity, low blur (anchors the object directly to the floor).
  2. **Atmospheric Shadow:** Deep, soft, high blur, subtle color tint (simulates light diffusion).
  3. **Micro Rim Light (Top Bevel):** Inset white stroke (simulates top edge catching ambient overhead light).
  ```css
  .elevated-card {
    background: #161a17;
    box-shadow:
      /* 1. Contact Shadow */
      0 2px 4px rgba(0, 0, 0, 0.4),
      /* 2. Atmospheric Diffusion */
      0 16px 36px -6px rgba(0, 0, 0, 0.65),
      /* 3. Micro Top Rim Light */
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      /* 4. Micro Bottom Dark Inset */
      inset 0 -1px 0 rgba(0, 0, 0, 0.4);
  }
  ```

---

### 1.3 Multi-Stop Directional Bevels via Gradient Borders
- Physical objects have crisp edges that reflect light according to surface angle.
- **CSS Masked Border Technique:**
  ```css
  .tactile-panel {
    position: relative;
    background: #141815;
    border-radius: 16px;
  }
  .tactile-panel::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.04) 35%,
      rgba(0, 0, 0, 0.3) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  ```

---

### 1.4 Ambient Studio Film-Grain Overlay
- Flat digital black (`#000000`) creates color-banding and looks lifeless.
- **The Craft Standard:** Inject a global, fixed hardware-accelerated 2–3% noise texture with `pointer-events: none` and `mix-blend-mode: overlay`.
  ```css
  .studio-noise-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    background-image: url('/noise.png');
    background-repeat: repeat;
    background-size: 180px 180px;
    opacity: 0.032;
    mix-blend-mode: overlay;
  }
  ```

---

### 1.5 Frosted Optics & True Glassmorphism
- Never use simple `opacity: 0.8` on white/black backgrounds.
- **The Glass Recipe:**
  1. Deep background blur (`backdrop-filter: blur(16px) saturate(180%)`).
  2. Translucent tinted surface (`background: rgba(22, 26, 23, 0.7)`).
  3. Specular rim highlight (`border: 1px solid rgba(255, 255, 255, 0.12)`).
  4. Subtle drop shadow for separation.

---

## 2. Physics, Inertia & Spring Dynamics

### 2.1 The Spring Settle (Eliminating Rigid Stops)
- Real mechanical mechanisms (tonearms, needle drops, toggle switches, drawers) never stop on a linear mathematical curve. They exhibit a micro-oscillation bounce.
- **Keyframe Recipe:**
  ```css
  @keyframes mechanical-settle {
    0%   { transform: rotate(-9deg) translateY(-2px); }
    55%  { transform: rotate(-11.6deg) translateY(1.2px); } /* Overshoot */
    80%  { transform: rotate(-10.8deg) translateY(-0.4px); } /* Counter-bounce */
    100% { transform: rotate(-11deg) translateY(0); }        /* Rest position */
  }
  ```
- **Framer Motion Spring Parameters:**
  - Snappy UI toggles: `{ stiffness: 420, damping: 28, mass: 0.35 }`
  - Heavy physical cards: `{ stiffness: 260, damping: 24, mass: 0.8 }`
  - Gentle floating elements: `{ stiffness: 120, damping: 14, mass: 1 }`

---

### 2.2 Lift-on-Drag & Lift-on-Hover Physics
- Interactive stickers, photos, tickets, or cards must feel like they are physically peeling and lifting off the table.
- **Rule:** On `:hover` and `:active` (dragging):
  1. Increase shadow elevation and blur.
  2. Scale slightly (`scale(1.02)` on hover, `scale(1.04)` on active drag).
  3. Apply slight dynamic rotational tilt.
  ```css
  .sticker-card {
    transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.45);
  }
  .sticker-card:hover {
    transform: translateY(-4px) rotate(1deg);
    box-shadow: 8px 18px 28px rgba(0, 0, 0, 0.6);
  }
  .sticker-card:active {
    cursor: grabbing;
    transform: translateY(-8px) scale(1.03);
    box-shadow: 14px 28px 42px rgba(0, 0, 0, 0.75);
  }
  ```

---

### 2.3 Haptic Click Compression
- Every clickable button or token must deliver instant mechanical compression:
  ```css
  button, .btn {
    transition: transform 140ms cubic-bezier(0.22, 1, 0.36, 1),
                background-color 140ms ease;
  }
  button:active, .btn:active {
    transform: scale(0.975);
  }
  ```

---

## 3. Compound CTA Architecture (Button-in-Button)

Generic single-layer flat buttons blend into the background. Top-tier design engineering uses **nested compound tokens**.

### 3.1 Nested Action Chips & Dual-Coordinate Shift
- Place an independent action token (circular arrow chip, badge, or status icon) inside the primary pill capsule.
- On hover, execute a **compound coordinate shift**:
  - Main button lifts upward (`translateY(-2px)`).
  - Inner chip translates diagonally in the action vector (`translate(2px, -2px)`).
  ```html
  <a class="room-button" href="#work">
    <span>Explore Selected Work</span>
    <span class="btn-arrow-chip" aria-hidden="true">↗</span>
  </a>
  ```
  ```css
  .room-button {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 10px 14px 10px 22px;
    border-radius: 999px;
    background: var(--room-lime, #d4e79d);
    color: #20251e;
    font-size: 13.5px;
    font-weight: 600;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35);
    transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
                background-color 180ms ease,
                box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .room-button:hover {
    background: #e2efbf;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  }
  .room-button:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .btn-arrow-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(32, 37, 30, 0.12);
    font-size: 13px;
    line-height: 1;
    transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
                background-color 200ms ease;
  }
  .room-button:hover .btn-arrow-chip {
    transform: translate(2px, -2px);
    background: rgba(32, 37, 30, 0.22);
  }
  ```

---

### 3.2 Dynamic Spotlight / Coordinate-Tracking Shimmer
- Track mouse `(e.clientX, e.clientY)` over interactive containers to drive a subtle radial light highlight:
  ```css
  .spotlight-card {
    background: radial-gradient(
      600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
      rgba(255, 255, 255, 0.06),
      transparent 40%
    );
  }
  ```

---

## 4. Atmospheric Canvas & Particle Systems

When building cursor trails, musical notes, stardust sparkles, or ambient audio spectrums:

### 4.1 Sinusoidal Life Easing (No Sudden Pop-ins/Pops-out)
- **The Anti-Pattern:** Linearly fading opacity (`alpha = life / maxLife`).
- **The Craft Standard:** Use a half-sine curve `Math.sin((life / maxLife) * Math.PI)` for both **opacity** and **scale**:
  - Birth (`life = maxLife`) $\rightarrow$ `alpha = 0` (gentle materialization).
  - Mid-life (`life = maxLife / 2`) $\rightarrow$ `alpha = 1` (peak radiance).
  - Death (`life = 0`) $\rightarrow$ `alpha = 0` (ethereal dissolve).

### 4.2 Harmonic Wave Oscillation (Buoyancy)
- Particles moving in rigid straight lines feel synthetic.
- **The Fix:** Add an independent phase and sinusoidal lateral wobble:
  ```ts
  particle.phase += particle.wobbleSpeed;
  particle.x += particle.vx + Math.sin(particle.phase) * particle.wobbleAmp;
  particle.y += particle.vy; // e.g. -0.8px/frame upward float
  particle.rot += particle.vRot;
  ```

### 4.3 Harmonized Color Constellations
- Never randomize arbitrary RGB values. Pick from a tightly curated 4-color palette matching your brand accents (e.g. Lime Glow, Champagne Gold, Terracotta Rose, Mint), with glowing `ctx.shadowBlur` matched to the particle tint.

### 4.4 Interactive Radial Chord Bursts
- On user click / pointer down, emit a radial 360° burst of particles with angular distribution and velocity decay:
  ```ts
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const speed = 1.5 + Math.random() * 2.5;
    spawnParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 0.8);
  }
  ```

---

## 5. Web Audio API & Spatial Micro-Haptics

Audio adds a tactile dimension when used with restraint.

### 5.1 Zero-Dependency Synthesized UI Clicks
- Synthesize tactile clicks and ticks directly with Web Audio oscillator nodes (no heavy MP3 downloads required):
  ```ts
  class HapticAudio {
    private ctx: AudioContext | null = null;

    private init() {
      if (!this.ctx && typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    playClick(freq = 1800, duration = 0.015) {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }
  }
  export const haptics = new HapticAudio();
  ```

---

## 6. Typography, Kerning & Fluid Spatial Calculus

### 6.1 Display / Serif Tension
- Pair two contrasting typographic voices:
  1. **Ultra-Modern Geometric Sans** (bold, high impact, tight tracking: `-0.04em` to `-0.06em`).
  2. **Warm Classical Italic Serif** (Georgia, Garamond, Instrument Serif) for humanized subheadings, notes, and quotes.

### 6.2 Optical Kerning on Large Display Sizes
- As font size exceeds `48px`, default browser kerning leaves excessive whitespace between characters.
- **Rules:**
  - Large Headlines (`> 48px`): `letter-spacing: -0.05em; line-height: 1.1;`
  - Subheadings (`24px–40px`): `letter-spacing: -0.03em; line-height: 1.25;`
  - Eyebrows & Labels (`< 11px`): `letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600;`

### 6.3 Fluid Type Scales with `clamp()`
- Avoid brittle breakpoint font jumps. Use fluid typography:
  ```css
  font-size: clamp(32px, 4.5vw + 1rem, 64px);
  ```

---

## 7. Color Systems, OKLCH & Gamut Expansion

### 7.1 Perceptually Uniform Palettes with OKLCH
- Standard HSL changes perceptual brightness across hues (yellow looks brighter than blue). Use `oklch()` for uniform luminosity and seamless palette generation:
  ```css
  :root {
    --brand-lime: oklch(0.88 0.14 125);
    --brand-surface: oklch(0.16 0.01 140);
    --brand-ink: oklch(0.20 0.02 135);
  }
  ```

### 7.2 Dark Mode Luminance Balance
- Never use pure `#000000` with pure `#FFFFFF` (harsh on eyes).
- Use deep slate/forest ink (`#0e120f` or `#0a0a0a`) with warm off-white text (`#f0eee2` or `#f4f0e7`) and soft muted secondary labels (`#aeb9a2` or `#8f9b86`).

---

## 8. View Transitions & Smooth Navigation

### 8.1 Native View Transitions API
- Morph cards into case studies and maintain layout continuity across route changes:
  ```css
  @view-transition {
    navigation: auto;
  }
  ::view-transition-group(*) {
    animation-duration: 380ms;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }
  ```

---

## 9. Form Ergonomics & Micro-Validation

### 9.1 Haptic Error Shake
- On invalid form submission, apply a physical horizontal oscillation keyframe:
  ```css
  @keyframes error-shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
  .input-error {
    animation: error-shake 320ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    border-color: #e57373 !important;
  }
  ```

---

## 10. Invisible 1% Details (OS-Level Polish)

### 10.1 Brand-Matched `::selection`
```css
::selection {
  background-color: var(--room-lime, #d4e79d);
  color: #161a17;
}
```

### 10.2 Integrated Slim Scrollbar
```css
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
::-webkit-scrollbar-track {
  background: #0d120e;
}
::-webkit-scrollbar-thumb {
  background: #252f26;
  border-radius: 999px;
  border: 1px solid #141b15;
}
::-webkit-scrollbar-thumb:hover {
  background: #3e4e40;
}
```

### 10.3 High-Contrast Focus Ring
```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #161a17, 0 0 0 4px #d4e79d;
}
```

### 10.4 Zero-Flicker Boot & Accessibility Guards
- Always cache intro loaders in `sessionStorage` to run only once per session.
- Add comprehensive accessibility overrides:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 11. 120 FPS Performance Budget & Compositor Discipline

1. **Animate ONLY Composited Properties:**
   - Permitted: `transform`, `opacity`, `filter` (with caution).
   - Forbidden in loops: `top`, `left`, `width`, `height`, `margin`, `padding`, `border-width`.
2. **Paint Containment:** Use `contain: paint layout` on complex animated containers.
3. **Lifecycle Cleanup for `will-change`:** Only set `will-change: transform` during active gestures/animations, then remove it to free GPU memory.
4. **Debounced Resizing:** Always throttle/debounce resize observers and scroll listeners via `requestAnimationFrame`.

---

## 12. Pre-Flight Craft Checklist

| Category | Craft Item | Verification Criteria |
| :--- | :--- | :--- |
| **Materiality** | Anisotropic Specular Light | Are light glints stationary while textures rotate? |
| **Materiality** | Dual-Stage Shadows | Does floating UI have contact + atmospheric drop shadow? |
| **Materiality** | Top Rim Bevel | Do panels have `inset 0 1px 0 rgba(255,255,255,0.12)`? |
| **Materiality** | Film-Grain Texture | Is subtle film-grain overlay active across dark backgrounds? |
| **Physics** | Spring Settle | Do needles, switches, and drawers have overshoot oscillation? |
| **Physics** | Lift on Drag/Hover | Do shadows expand smoothly as cards lift off the surface? |
| **Physics** | Haptic Compression | Do buttons scale to `0.975–0.98` on click? |
| **Interactions** | Button-in-Button | Do primary CTAs feature animated nested chips/tokens? |
| **Particles** | Sinusoidal Easing | Do canvas particles fade in/out using half-sine curves? |
| **Typography** | Letter Spacing | Are display headings tightly tracked (`-0.05em`)? |
| **Typography** | Display/Serif Tension | Is modern sans paired with expressive italic serif? |
| **OS Polish** | Selection & Scrollbar | Are `::selection` and scrollbar custom styled? |
| **Accessibility**| Reduced Motion | Does `prefers-reduced-motion` cleanly bypass heavy loops? |
| **Performance**  | 120 FPS Compositor | Are animated properties strictly `transform` & `opacity`? |
