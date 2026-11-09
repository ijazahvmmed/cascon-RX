Use this DESIGN.md as the design system. Save it as DESIGN.md in the project root and follow its tokens and rules on every screen.

---
version: alpha
name: Wearebou
description: "Dark monochrome interface measured from wearebou.com: StabilGrotesk type, flat surfaces and pill-shaped controls."
colors:
  background: "#0A0A0A"
  surface: "#0A0A0A"
  on-surface: "#FFFFFF"
  on-background: "#FFFFFF"
  on-surface-variant: "#535353"
  overlay: "#0000000D"
  overlay-strong: "#FFFFFF40"
  outline: "#0A0A0A26"
  primary: "#FFFFFF"
  on-primary: "#000000"
typography:
  headline-display:
    fontFamily: StabilGrotesk
    fontSize: 42px
    fontWeight: 300
    lineHeight: 1.1
  headline-lg:
    fontFamily: StabilGrotesk
    fontSize: 30px
    fontWeight: 300
    lineHeight: 1.1
  body-md:
    fontFamily: StabilGrotesk
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
  body-sm:
    fontFamily: StabilGrotesk
    fontSize: 14px
    fontWeight: 300
    lineHeight: 1.6
  caption:
    fontFamily: StabilGrotesk
    fontSize: 13px
    fontWeight: 300
    lineHeight: 1.4
  label-lg:
    fontFamily: StabilGrotesk
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.71
  label-md:
    fontFamily: StabilGrotesk
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.4
  label-sm:
    fontFamily: StabilGrotesk
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.06em
  headline-display-mobile:
    fontFamily: StabilGrotesk
    fontSize: 28px
    fontWeight: 300
    lineHeight: 1.1
rounded:
  md: 100px
  full: 9999px
spacing:
  xs: 3.02px
  sm: 7px
  md: 9.07px
  lg: 22.46px
  xl: 60.05px
  gutter: 10px
  section: 60.05px
components:
  button-ghost:
    textColor: "{colors.background}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 8px
  link:
    textColor: "{colors.on-surface-variant}"
---

# Wearebou Design System

## Overview

Wearebou describes itself as: “Bou is a holistic brand company, working with 200+ trendsetting brands around Europe and the US.” The interface is dark, built on **Near Black (#0A0A0A)** with **White (#FFFFFF)** text and almost no color: actions are carried by contrast, not hue.

Type is set in **StabilGrotesk**. Headlines run large; body text is 20px. The surface language is flat. Controls are pill-shaped.

Measured from [wearebou.com](https://wearebou.com/) on November 9, 2026 at 1440×900 and 390×844 from 419 rendered elements. Values are computed styles from the live page, not the original source files.

## Colors

The palette has 8 roles.

- **Near Black (#0A0A0A):** Page background, seen 11 times. Token `background`.
- **White (#FFFFFF):** Primary text and headings, seen 112 times. Token `on-surface`, CSS `--colors-light`.
- **Slate (#535353):** Secondary text, seen 24 times. Token `on-surface-variant`, CSS `--colors-dark-alt`.
- **Near Black 5% (#0000000D):** Translucent fill for cards and controls, seen 20 times. Token `overlay`, CSS `--colors-black-5`.
- **White 25% (#FFFFFF40):** Stronger translucent fill, seen 2 times. Token `overlay-strong`.
- **Near Black 15% (#0A0A0A26):** Borders and dividers, seen 3 times. Token `outline`, CSS `--colors-border-dark`.
- **White (#FFFFFF):** Primary actions (the main text color; the palette is monochrome), seen 175 times. Token `primary`, CSS `--colors-light`.
- **Near Black (#000000):** Text and icons on primary. Token `on-primary`.

## Typography

**StabilGrotesk** carries the whole interface. Fallback stack: `StabilGrotesk, helvetica, sans-serif`.

- **headline-display:** StabilGrotesk 42px at weight 300, line height 1.1 (28px on mobile). Page title (h1).
- **headline-lg:** StabilGrotesk 30px at weight 300, line height 1.1. Section headings (h2).
- **body-md:** StabilGrotesk 20px at weight 500, line height 1.3. Body text.
- **body-sm:** StabilGrotesk 14px at weight 300, line height 1.6. Secondary and small text.
- **caption:** StabilGrotesk 13px at weight 300, line height 1.4. Captions and fine print.
- **label-lg:** StabilGrotesk 14px at weight 500, line height 1.71. Large buttons and tabs.
- **label-md:** StabilGrotesk 13px at weight 600, line height 1.4. Buttons, navigation and labels.
- **label-sm:** StabilGrotesk 12px at weight 500, line height 1.2, tracking 0.06em. Small labels and badges.

## Layout

Spacing does not follow a strict grid: 14% of measured values are multiples of 4px, so match the measured steps rather than rounding to a grid.

- **Scale:** xs 3.02px, sm 7px, md 9.07px, lg 22.46px, xl 60.05px.
- **Sections:** 60.05px vertical padding between major sections.
- **Gaps:** 10px is the most common gap in flex and grid layouts.
- **Breakpoints:** 352px, 360px, 440px, 460px, 480px, 576px, 640px, 960px, 980px, 1280px, 1600px.

## Elevation & Depth

The design is flat: no shadows were measured. Hierarchy comes from color contrast and #0A0A0A26 borders.

## Shapes

Interactive controls are pill-shaped. Measured radii, most used first:

- **md (100px):** 96 elements.
- **full (9999px):** 88 elements.

## Components

Measured from the rendered page. Token values reference the tokens above.

- **button-ghost (“Customize”):** transparent fill, #0A0A0A text, 14px/500, 100px radius, padding 8px, border 1px solid #0A0A0A.
- **link:** transparent fill, #535353 text, padding 0px.

## Do's and Don'ts

- Do use #0A0A0A for the page.
- Do keep text in 2 levels: #FFFFFF, #535353.
- Do let contrast carry emphasis; primary actions use #FFFFFF on #0A0A0A.
- Do reuse the measured spacing steps (7px, 9.07px, 22.46px).
- Do make buttons and chips fully rounded (9999px); most other elements use 100px corners.
- Don't use #535353 for body text; it reaches 2.57:1 on #0A0A0A. Keep it for large text or metadata.
- Don't add drop shadows for depth; use borders and contrast.
- Don't introduce new font families beyond StabilGrotesk.
- Don't add saturated accent colors; the measured palette is almost entirely neutral.
- Don't make interface transitions slower than 0.34s.

## Motion

Interface transitions are quick: 0.3s, 0.2s, 0.34s. Longer ambient animations run 0.76s.

- **Easing:** `cubic-bezier(0.29, 0.48, 0.5, 0.99)`, `ease-out`, `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Reduced motion:** the page responds to `prefers-reduced-motion`.

Generated by [Sitepeel](https://sitepeel.dev/design-md/wearebou.com/), the free DESIGN.md generator (engine 2026.10.29+b828a475ee10).


## Project application — Cascon

The supplied screenshot is the visual authority for public pages: white surfaces, near-black text, pale mint (#DCF6D3) and blue (#BFE4EC) gradients, rectangular media, wide whitespace and three-column project grids. This explicitly overrides the scraped document’s dark-page palette. Keep all measured source tokens above as provenance. Use 60px desktop outer gutters (20px mobile), a 20px media gap (10px mobile), 42px/300 display type with responsive scaling, pill actions, no shadows and interface transitions of 0.2–0.34s. Major section whitespace scales with the screenshot’s proportions. Per the user’s revision, use the bundled variable Geist font on every page, with real 300-weight display and navigation text, 600-weight emphasis, and 500-weight compact project labels. This overrides the reference’s StabilGrotesk family. Do not copy Bou’s identity, client claims, imagery or recruitment content.


## Motion and navigation revision — 9 November 2026

Live Bou measurements at 1440px: 42px/300 display type, 1.1 line height, 14px/300 navigation, 600 emphasis, 80px fixed header, 20px desktop side inset, 40px inner padding, 22.46px link gaps, 20px bottom corner radius. Header hides on downward scroll and returns on upward scroll. Mobile uses a two-line toggle and a dark fullscreen menu with 28px/300 links. Keep hiring links removed.

Use GSAP SplitText word reveals through line masks, preserving strong emphasis and accessible heading names. Use one GSAP ticker for Lenis and ScrollTrigger, lerp 0.085 and wheel multiplier 0.9. Keep touch native, reduced motion native, and pause smooth scrolling while the menu is visible. Button circles expand into pills and recycle a horizontal arrow on hover. Use the original Cascon logo artwork in the header and footer.


## FAQ and service hover revision

Use the second reference’s centered 30px/300 FAQ heading, blue Ask AI control, 20px/300 questions, thin gray dividers and plus toggles. The AI control is a provider chooser with a copyable, source-seeking question; it must not claim model endorsement or on-site AI generation. Keep the visible FAQs synchronized with FAQPage and llms-full.txt. Services transition from 300 to 600 weight on hover and focus; reserve bold width with an aria-hidden measurement layer so the layout stays still.
