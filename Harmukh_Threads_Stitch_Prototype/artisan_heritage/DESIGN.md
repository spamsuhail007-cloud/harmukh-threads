# Design System Strategy: The Digital Heirloom

## 1. Overview & Creative North Star

This design system is built to transform a digital commerce platform into a high-end editorial experience. Our Creative North Star is **"The Digital Curator."** 

We are not building a generic storefront; we are designing a digital gallery that honors the centuries-old craftsmanship of Kashmir. To achieve this, the system moves away from rigid, boxy layouts in favor of **intentional asymmetry** and **tonal depth**. We treat whitespace not as "empty" space, but as a luxury material—like the fine margins of a high-fashion magazine. By overlapping editorial typography with artisanal imagery and using a "paper-on-paper" layering logic, we create a tactile, premium environment that feels both heritage-rooted and modern.

---

## 2. Colors: The Tonal Palette

The color strategy is anchored in the earthy elegance of the Himalayas. We utilize Material Design token logic to create a sophisticated, light-themed environment dominated by ivory and warm charcoal, punctuated by the heat of saffron.

### Core Token Implementation
- **Primary (`#9b4000`) & Primary Container (`#c25303`):** Reserved for high-intent actions and brand signatures. Use these for main CTAs to inject the "Deep Saffron" energy.
- **Surface (`#fcf9f2`):** Our "Ivory" base. This is the canvas.
- **On-Surface (`#1c1c18`):** Our "Warm Charcoal." Used for body text to ensure readability while maintaining a softer, more organic feel than pure black.
- **Secondary (`#765a24`):** The "Antique Gold." Use this for subtle accents, icons, or decorative elements that signify premium quality.

### The "No-Line" Rule
To maintain an editorial feel, **1px solid borders are prohibited** for sectioning. Boundaries must be defined through:
1.  **Background Color Shifts:** A `surface-container-low` (`#f6f3ec`) section sitting against a `surface` (`#fcf9f2`) background.
2.  **Tonal Transitions:** Using subtle shifts in the surface hierarchy to denote change in context.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine papers. 
- Use **Surface Container Lowest (`#ffffff`)** for floating cards or elevated interaction states.
- Use **Surface Container High (`#ebe8e1`)** for recessed areas like footers or utility bars.
*Note: Always nest containers to create depth. An inner card should always be a different tier than its parent container to define its importance without a border.*

### The Glass & Gradient Rule
For navigation bars or floating action menus, use **Glassmorphism**. Apply `surface` with 80% opacity and a `20px` backdrop-blur. To provide a "visual soul," use a subtle linear gradient on primary buttons transitioning from `primary` to `primary-container`.

---

## 3. Typography: Editorial Authority

We use a high-contrast pairing to balance heritage and utility.

| Level | Font Family | Size | Intent |
| :--- | :--- | :--- | :--- |
| **Display-LG** | Noto Serif | 3.5rem | Hero headlines; the "Editorial" voice. |
| **Headline-MD** | Noto Serif | 1.75rem | Product categories and section starts. |
| **Title-MD** | Inter | 1.125rem | Product names and sub-navigation. |
| **Body-LG** | Inter | 1rem | Long-form descriptions; high legibility. |
| **Label-MD** | Inter | 0.75rem | Metadata, tags, and utility micro-copy. |

**The Signature Look:** Headlines should use tighter letter-spacing (-0.02em) to feel authoritative, while Body text (Inter) should have generous line-height (1.6) to provide a "breathable" reading experience.

---

## 4. Elevation & Depth

Hierarchy is achieved through **Tonal Layering** rather than traditional shadows or lines.

### The Layering Principle
Depth is created by "stacking" surface tiers.
- **Example:** A product detail card (`surface-container-lowest`) placed on a product grid (`surface-container-low`) creates a soft, natural lift.

### Ambient Shadows
Shadows must be "ambient," mimicking natural gallery lighting.
- **Shadow Spec:** `0px 12px 32px rgba(44, 38, 34, 0.06)`. 
- Shadows must be tinted with the `on-surface` color to avoid a "muddy" grey look. Use extremely low opacity (4–8%).

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., input fields), use the **Ghost Border**:
- Token: `outline-variant` (`#dfc0b3`) at **20% opacity**.
- Never use 100% opaque, high-contrast borders.

---

## 5. Components

### Buttons
- **Primary:** Filled with `primary`, text in `on-primary`. 8px (`lg`) corner radius.
- **Secondary:** Outlined with a Ghost Border. 
- **Interaction:** On hover, shift background to `primary-container`.

### Cards & Product Grids
- **Forbid dividers.** Use vertical white space (64px+) or a shift to `surface-container-low` to separate items.
- Imagery should use a subtle 4px radius to feel "soft" but not "bubbly."

### Input Fields
- Use a "Minimalist Float" style. No containing box. Only a bottom border using `outline-variant` at 40% opacity. 
- On focus, the border transitions to `primary` and the label shrinks to `label-sm`.

### Navigation (The Curated Bar)
- Use a `surface` background with 90% opacity and `backdrop-blur`.
- Navigation links use `title-sm` (Inter) with generous horizontal spacing.

### Selection Chips
- Rounded (`full`). Background: `surface-container-high`. 
- Selected state: `primary` background with `on-primary` text.

---

## 6. Do's and Don'ts

### Do
- **Do use asymmetric layouts.** Offset an image to the left and text to the right with generous, uneven margins.
- **Do use "Saffron" sparingly.** It is a highlight, not a flood. Use it to draw the eye to the "Add to Cart" or "Limited Edition" badge.
- **Do prioritize image quality.** The design system relies on high-quality, tactile photography of textiles and woodcraft.

### Don't
- **Don't use pure black (#000000).** It breaks the heritage warmth. Use `on-surface` (`#1c1c18`).
- **Don't use standard drop shadows.** If a component feels flat, try changing its surface tier before adding a shadow.
- **Don't crowd the screen.** If you aren't sure if there's enough whitespace, add 24px more. Luxury is the ability to breathe.
- **Don't use 1px dividers between list items.** Use the spacing scale to create clear, rhythmic separation.

---

*This design system is a living framework. It is intended to guide the creation of a digital space that feels as hand-woven and intentional as the products it showcases.*