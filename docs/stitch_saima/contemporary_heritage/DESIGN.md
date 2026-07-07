---
name: Contemporary Heritage
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#45464d'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#7c5800'
  on-secondary: '#ffffff'
  secondary-container: '#fcbf46'
  on-secondary-container: '#704e00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0f1d24'
  on-tertiary-container: '#77868e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#f9bc44'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#d5e5ee'
  tertiary-fixed-dim: '#b9c9d2'
  on-tertiary-fixed: '#0f1d24'
  on-tertiary-fixed-variant: '#3a4950'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
typography:
  display:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 20px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 64px
  section-gap: 120px
---

## Brand & Style
The design system is built on the intersection of professional authority and community warmth. It seeks to evoke the feeling of a prestigious cultural institution that remains deeply accessible to the grassroots community. The brand personality is **Empathetic, Authoritative, and Culturally Rooted.**

The visual style follows a **Modern Corporate** aesthetic infused with **Editorial** elegance. By pairing high-contrast serif typography with generous whitespace and a sophisticated color palette, the system communicates the richness of multicultural arts. The interface should feel like a high-end gallery or a concert program: curated, intentional, and respectful of the art it showcases. 

Key visual principles:
- **Breathability:** Prioritize layout over density to let photography and text breathe.
- **Warmth through Texture:** Use subtle cream backgrounds rather than stark white to create a welcoming, parchment-like feel.
- **Human-Centric:** Lead with high-quality imagery of performers and community members to ground the professional structure in human emotion.

## Colors
This design system utilizes a palette inspired by the South Australian landscape and traditional cultural arts.

- **Primary (Deep Navy):** `#0F172A`. Used for typography, navigation, and core branding elements to establish authority and depth.
- **Secondary (Vibrant Ochre):** `#C89116`. A warm, gold-leaning ochre used for calls to action, accents, and highlighting cultural richness.
- **Tertiary (Dusty Slate):** `#5C6B73`. Used for secondary information and subtle UI elements to bridge the gap between navy and cream.
- **Background (Soft Cream):** `#F8F5F1`. This serves as the primary canvas, providing a sophisticated, warm alternative to white that reduces eye strain and enhances readability.
- **Surface (Parchment):** `#FFFFFF`. Used sparingly for card elements or input fields to create subtle lift against the cream background.

## Typography
The typography strategy is a dual-font system that balances tradition with modern accessibility.

- **Headlines (EB Garamond):** A classical serif that evokes musical scores and literary history. Use for all major headings and display text. Headlines should be set with slightly tighter letter spacing to maintain a sophisticated "editorial" look.
- **Body & UI (Plus Jakarta Sans):** A friendly, modern sans-serif chosen for its high legibility and warmth. This handles all functional text, body copy, and navigation.
- **Hierarchy:** Ensure a clear distinction between the "Storytelling" layer (Serif) and the "Information" layer (Sans-serif). 
- **Accessibility:** Maintain a minimum body size of 16px. Use the `label-md` style for small headers or category tags, employing uppercase and tracking for a professional, organized feel.

## Layout & Spacing
The layout philosophy centers on **Generous Whitespace** to honor the artistic content. 

- **Grid System:** Use a 12-column fluid grid for desktop and tablet, and a 4-column grid for mobile. 
- **The "Section Gap":** Major content blocks should be separated by 120px on desktop to prevent visual clutter and give the organization's initiatives a sense of importance.
- **Alignment:** While text is generally left-aligned for readability, display headlines can be center-aligned in hero sections to create a formal "theatrical" entrance.
- **Responsive Behavior:** On mobile, margins reduce to 20px, and vertical stack spacing (stack-lg) reduces to 48px to maintain momentum while scrolling.

## Elevation & Depth
Depth in the design system is communicated through **Tonal Layers** and **Ambient Shadows** rather than aggressive 3D effects.

- **Tonal Layering:** The primary background is the soft cream. Elevated elements (like cards or featured quotes) use a white surface.
- **Shadows:** Use a "Warm Ambient" shadow profile. Shadows should have a large blur radius, low opacity (8-10%), and a slight tint of the primary Navy or Secondary Ochre to feel natural and integrated rather than gray and "digital."
- **Focus States:** Use a soft 2px solid border in the secondary Ochre color for interactive elements to ensure accessibility without breaking the sophisticated aesthetic.
- **Imagery:** Photography should sit on the surface with a subtle `shadow-md` to provide a "printed" look, as if photographs are laid upon parchment.

## Shapes
The shape language is **Softly Structured.**

- **Corner Radius:** A consistent 0.5rem (8px) radius is applied to buttons, input fields, and small cards. 
- **Large Components:** Imagery and large feature cards use a `rounded-lg` (16px) radius to feel friendlier and more modern.
- **Circular Elements:** Use full pill-shaping for tags and chips to contrast against the more structured rectangular forms of the grid.
- **Iconography:** Use line icons with rounded terminals to match the weight and friendliness of the Plus Jakarta Sans typeface.

## Components
Consistent styling for core elements to maintain the "Contemporary Heritage" feel:

- **Buttons:** 
  - *Primary:* Solid Deep Navy with White text. Bold and authoritative.
  - *Secondary:* Solid Ochre with Deep Navy text. Used for high-conversion community actions (e.g., "Donate" or "Register").
  - *Ghost:* Transparent with a Navy border. For low-priority navigation.
- **Input Fields:** Soft Cream background with a 1px Navy border at 20% opacity. On focus, the border becomes the Secondary Ochre.
- **Cards:** White background, 16px corner radius, and subtle ambient shadow. Headlines within cards should use the Serif font at `headline-sm` size.
- **Chips/Tags:** Pill-shaped with a light Ochre tint (`#FDF2D9`) and Deep Navy text, used for categorizing art forms (e.g., "Classical," "Indigenous Art," "Youth Workshop").
- **Lists:** Use custom bullet points in the Secondary Ochre color (small circles or stylised diamonds) to add a decorative touch to text-heavy community information.
- **Imagery:** All photography must feature rounded corners. For featured performers, consider a "floating" effect using a subtle drop shadow and a slightly larger corner radius (24px).