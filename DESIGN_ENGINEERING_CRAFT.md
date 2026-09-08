# Design Engineering & Frontend Craft Playbook

A definitive, battle-tested standard for crafting award-winning, physically grounded, high-taste web interfaces. Use these rules across any frontend project (React, Next.js, Vue, vanilla WebGL/Canvas, CSS) to elevate user experience from "standard UI" to "luxury digital product."

---

## 1. Materiality, Light & Physical Depth

Digital surfaces look cheap and "plastic" when they rely on flat colors or single CSS box shadows. Real-world surfaces interact with ambient room lighting, possess micro-texture, and exhibit directional bevels.

### Rule 1.1: Anisotropic Light vs. Rotating Grooves
- **The Principle:** When an object rotates, shines, or moves (discs, dials, metal buttons, glossy cards), its **specular light glint** stays stationary relative to the viewer's room light, while the **diffuse surface texture** rotates underneath.
- **Implementation:** Separate rotating elements from stationary sheen layers.
  ```html
  <div class="turntable-disc">
    <!-- Rotates with CSS keyframes -->
    <div class="disc-surface-spinning" />
    <!-- Stationary overlay capturing room glint -->
    <div class="anisotropic-sheen-fixed" />
  </div>
  ```
- **CSS Sheen Texture:** Use `conic-gradient` with `mix-blend-mode: screen` or `overlay` at `opacity: 0.15–0.3` to simulate brushed metal or vinyl sheen.

---

### Rule 1.2: Dual-Stage Elevation Shadows (Contact + Atmospheric)
- **The Anti-Pattern:** A single harsh shadow: `box-shadow: 0 10px 20px rgba(0,0,0,0.5);`.
- **The Craft Standard:** Layer two shadows:
  1. **Contact Shadow:** Tight, dark, low blur (anchors the object to the surface).
  2. **Atmospheric Shadow:** Deep, soft, high blur, subtle color tint (simulates light diffusion).
  ```css
  .elevated-card {
    box-shadow:
      /* Contact Shadow */
      0 2px 4px rgba(0, 0, 0, 0.4),
      /* Atmospheric Drop */
      0 16px 36px -6px rgba(0, 0, 0, 0.65),
      /* Micro Rim Light (Bevel) */
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
  ```

---

### Rule 1.3: Directional Bevels via Multi-Stop Border Gradients
- Physical objects catch overhead light along their top edge and cast a subtle micro-shadow along their bottom edge.
- **Implementation:**
  ```css
  .tactile-container {
    background: #161a17;
    border: 1px solid transparent;
    background-clip: padding-box;
    position: relative;
  }
  .tactile-container::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.22) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(0, 0, 0, 0.4) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  ```

---

### Rule 1.4: Ambient Studio Film-Grain Overlay
- Flat digital black (`#000000` or `#0a0a0a`) causes visual banding on OLED/LCD displays and feels sterile.
- **The Fix:** Inject a fixed, hardware-accelerated 2–3% noise texture across the viewport with `pointer-events: none`.
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

## 2. Physics, Inertia & Micro-Interactions

### Rule 2.1: The Spring Settle (Eliminate Linear Stops)
- Real-world mechanical components (needles, toggle switches, drawers, floating tags) never come to a rigid mathematical stop. They exhibit a micro-oscillation settle.
- **Keyframe Recipe:**
  ```css
  @keyframes mechanical-settle {
    0%   { transform: rotate(-9deg) translateY(-2px); }
    50%  { transform: rotate(-11.4deg) translateY(1.2px); } /* Overshoot */
    75%  { transform: rotate(-10.8deg) translateY(-0.4px); } /* Settle bounce */
    100% { transform: rotate(-11deg) translateY(0); }
  }
  ```
- **Framer Motion / Spring Equivalent:** `stiffness: 420, damping: 28, mass: 0.35`.

---

### Rule 2.2: Lift-on-Drag & Lift-on-Hover Physics
- Interactive cards, polaroids, stickers, and draggable objects must feel like they are physically peeling or lifting off the desk.
- **Rule:** On `:hover` and `:active` (dragging):
  1. Increase drop-shadow blur and y-offset.
  2. Reduce shadow opacity slightly as the object moves further from the surface.
  3. Scale slightly (`scale(1.02)` on hover, `scale(1.04)` on drag).
  ```css
  .sticker {
    transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
                filter 240ms cubic-bezier(0.22, 1, 0.36, 1);
    filter: drop-shadow(5px 9px 12px rgba(0, 0, 0, 0.45));
  }
  .sticker:hover {
    transform: translateY(-4px) rotate(1deg);
    filter: drop-shadow(8px 18px 24px rgba(0, 0, 0, 0.6));
  }
  .sticker:active {
    cursor: grabbing;
    transform: translateY(-8px) scale(1.03);
    filter: drop-shadow(14px 28px 36px rgba(0, 0, 0, 0.75));
  }
  ```

---

### Rule 2.3: Haptic Click Compression
- Every clickable button should give instant, tactile mechanical compression when pressed.
- **Rule:** `transform: scale(0.98)` on `:active` with an ultra-snappy `< 140ms` recovery.
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

Standard generic flat buttons blend into the page. Premium brands (Apple, Linear, Porsche, Stripe) use **compound hierarchical tokens**.

### Rule 3.1: Nested Action Chips
- Place a distinct sub-token (such as an icon circle or arrow chip) inside the primary CTA capsule.
- On hover, create a **compound coordinate shift**:
  - The main button translates slightly (`translateY(-2px)`).
  - The inner chip shifts in the action direction (`translate(2px, -2px)`).
  ```html
  <a class="room-button" href="#work">
    <span>View selected work</span>
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
    background: var(--accent);
    color: var(--accent-ink);
    font-weight: 600;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35);
    transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .room-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }
  .btn-arrow-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.12);
    transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .room-button:hover .btn-arrow-chip {
    transform: translate(2px, -2px);
    background: rgba(0, 0, 0, 0.22);
  }
  ```

---

## 4. Atmospheric Canvas & Particle Systems

When building cursor trails, sparkles, ambient audio spectrums, or magical cues:

### Rule 4.1: Sinusoidal Life Easing (No Hard Pop-ins)
- **The Math:** Never linearly fade particles (`opacity = life / maxLife`).
- **The Craft Solution:** Use half-sine curve `Math.sin((life / maxLife) * Math.PI)` for both **opacity** and **scale**.
  - At birth (`life = maxLife`), opacity = 0 (smooth materialization).
  - At mid-life (`life = maxLife / 2`), opacity = 1 (peak radiance).
  - At death (`life = 0`), opacity = 0 (ghostly dissolve).

### Rule 4.2: Harmonic Wave Oscillation (Buoyancy)
- Particles moving in straight lines look robotic and stiff.
- **The Craft Solution:** Add an independent phase and sinusoidal lateral wobble to vertical velocity:
  ```ts
  particle.phase += particle.wobbleSpeed;
  particle.x += particle.vx + Math.sin(particle.phase) * particle.wobbleAmp;
  particle.y += particle.vy; // e.g. -0.8px/frame upward drift
  ```

### Rule 4.3: Harmonized Color Constellations
- Avoid arbitrary RGB randomization. Group particle tints into a tightly curated 4-color palette (e.g. Lime Glow, Champagne Gold, Terracotta, Mint) with a glowing `ctx.shadowBlur` matched to the particle color.

---

## 5. Editorial Typography & Layout Contrast

### Rule 5.1: The Display / Serif Tension
- High-end digital editorial design derives tension from pairing:
  1. **Ultra-Modern Geometric Grotesque Sans** (bold, confident, tight tracking: `-0.04em` to `-0.06em`).
  2. **Warm Classical Italic Serif** (Georgia, Garamond, Playfair) for humanized subheadings, notes, and quotes.
- Example:
  ```html
  <h1 class="font-display tracking-tighter">
    An AI & full-stack engineer
    <em class="font-serif italic font-normal text-accent">building useful things.</em>
  </h1>
  ```

### Rule 5.2: Optical Kerning on Monster Display Sizes
- As font size exceeds `48px`, default browser kerning leaves excessive space between letters.
- **Rule:**
  - Headlines `> 40px`: `letter-spacing: -0.04em;`
  - Headlines `> 64px`: `letter-spacing: -0.06em;`
  - All-caps labels / eyebrows `< 11px`: `letter-spacing: 0.12em; text-transform: uppercase;`

---

## 6. Invisible 1% Details (OS-Level Polish)

### Rule 6.1: Brand-Matched `::selection`
- Never leave default bright blue browser selection on a dark or curated palette.
  ```css
  ::selection {
    background-color: var(--room-lime, #d4e79d);
    color: #161a17;
  }
  ```

### Rule 6.2: Integrated Slim Scrollbar
- A thick OS scrollbar destroys immersion. Style a slim, rounded track matching dark backgrounds:
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

### Rule 6.3: Double-Ring Keyboard Focus Indicator
- Never disable focus rings (`outline: none` without replacement). Use double-ring contrast:
  ```css
  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px #161a17, 0 0 0 4px #d4e79d;
  }
  ```

### Rule 6.4: Zero-Flicker Boot & `prefers-reduced-motion`
- Store load states in `sessionStorage` so boot screens only run once per session.
- Add `prefers-reduced-motion: reduce` guards to instantly bypass heavy animations and canvas loops for accessibility and low-power devices.

---

## 7. Craft Checklist Before Shipping Any Page

| Category | Item | Verification |
| :--- | :--- | :--- |
| **Materiality** | Dual-shadow elevation | Does floating UI have contact + atmospheric shadow? |
| **Materiality** | Top-edge rim light | Do panels have `inset 0 1px 0 rgba(255,255,255,0.1)`? |
| **Materiality** | Noise texture | Is subtle film-grain overlay active on dark themes? |
| **Motion** | Settle overshoot | Do springs and drops have physical oscillation? |
| **Motion** | Lift on hover/drag | Do shadows expand smoothly on interactive elements? |
| **Interactions** | Button-in-button | Do primary CTAs have animated chips/tokens? |
| **Typography** | Letter spacing | Are display headings tightly tracked (`-0.05em`)? |
| **System** | Selection & Scrollbar | Are `::selection` and scrollbar custom styled? |
| **Accessibility** | Reduced motion | Is `prefers-reduced-motion` respected throughout? |
