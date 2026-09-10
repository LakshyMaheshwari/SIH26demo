---
name: Clinical Diagnostic System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#40484b'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#70787b'
  outline-variant: '#bfc8cb'
  surface-tint: '#266675'
  primary: '#003d48'
  on-primary: '#ffffff'
  primary-container: '#0b5563'
  on-primary-container: '#8cc8d8'
  inverse-primary: '#93d0e0'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#003a5b'
  on-tertiary: '#ffffff'
  tertiary-container: '#00527e'
  on-tertiary-container: '#81c5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#afecfd'
  primary-fixed-dim: '#93d0e0'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.02em
  data-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2: 0.125rem
  space-4: 0.25rem
  space-8: 0.5rem
  space-12: 0.75rem
  space-16: 1rem
  space-20: 1.25rem
  space-24: 1.5rem
  space-32: 2rem
  space-40: 2.5rem
  space-48: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
---

## Brand & Style

This design system is engineered for point-of-care clinical environments, specifically rural and low-resource diabetic retinopathy screenings. The interface addresses healthcare technicians, visiting nurses, and reviewing ophthalmologists operating under high-throughput conditions, variable lighting, and field-grade hardware.

The design movement is **Precision Clinical / Modern Utilitarian**. It balances surgical clarity with modern software ergonomics:
- **Zero Ambiguity:** Visual hierarchy is absolute. Critical diagnostic markers, screening alerts, and severity progressions must be instantly distinguishable across glare, poor display calibration, or physical distance from the monitor.
- **Calibrated Restraint:** Clean clinical surfaces eliminate distraction. Decorative elements are omitted in favor of structural gridlines, explicit boundaries, and high-legibility typographic scale.
- **Reliability and Authority:** Visual tokens evoke precision laboratory instruments rather than consumer health apps, reassuring operators and patients during automated inference.

## Colors

The color palette reflects sterile precision, high optical contrast, and explicit diagnostic signaling. The default color mode is light to accommodate clinical environments with high ambient room illumination.

### Functional Palette
- **Primary (`#0B5563` - Deep Surgical Teal):** Conveys clinical authority, stability, and focus. Applied to active navigation, primary CTAs, key brand headers, and confirmed status identifiers.
- **Secondary (`#F97316` - Severity Amber/Orange):** Dedicated to warning states, moderate-to-severe retinopathy alerts, mandatory review indicators, and urgent follow-up notifications. It is never used purely for decorative accent.
- **Tertiary (`#0284C7` - Diagnostic Cyan/Blue):** Used for analytical overlays, scan capture bounding boxes, metadata tags, and non-critical data telemetry.
- **Neutral Core (`#0F172A` - Dark Charcoal):** Used for maximum-contrast body text, optical density scales, and high-readability metrics.

### Neutral Layering & Tones
- **Base Canvas:** `#F8FAFC` (Cool Clinical Slate) provides an anti-glare, non-fatiguing workspace background.
- **Surface Elevation 0 (Card/Tile):** `#FFFFFF` (Pure Hospital White) creates razor-sharp contrast against the slate foundation.
- **Structural Borders:** `#E2E8F0` defines rigid component architecture and scan quadrant dividers.
- **Muted Labels & Metadata:** `#64748B` maintains legible, low-priority diagnostic metadata.
- **Critical Failure / Urgent Referral:** `#DC2626` reserve for proliferative stage alerts and equipment failure states.
- **Normal / Negative Finding:** `#059669` indicates clear macula/fovea and passed screening checks.

## Typography

Typography is calibrated to prevent cognitive fatigue during extended clinical shifts and eliminate mistranscription of patient identifiers or AI confidence scores.

- **Headlines (Manrope):** Geometric, semi-condensed proportions that deliver crisp patient names, severity classifications, and diagnostic verdicts without wasting horizontal canvas real estate.
- **Body & Controls (Inter):** Highly legible humanist-grotesque figures designed for dense tabular data, form inputs, and clinical instructions.
- **Data & Telemetry (JetBrains Mono):** Dedicated to technical metrics, DICOM tags, scan resolution, hardware serials, and exact AI confidence percentages (e.g., `DR Grade: 3 (89.4%)`).
- **Capitalization:** Clinical labels, quadrant references (OD/OS), and status markers leverage `label-caps` in uppercase with expanded tracking for rapid peripheral scanning.

## Layout & Spacing

The design system implements an exact 8pt spatial rhythm (with 4pt micro-steps for compact data tables and diagnostic badges).

### Grid Architecture
- **Desktop / Clinical Terminal (1280px+):** 12-column fluid grid with `1.5rem` (24px) gutters and `2rem` (32px) screen margins. Diagnostic views prioritize a persistent split: a 7-column ocular imaging canvas flanked by a 5-column triage and AI decision pane.
- **Field Tablet (768px - 1279px):** 8-column layout with `1rem` (16px) gutters. The ocular viewer collapses to top-stack or segmented tab navigation to preserve fundus image resolution.
- **Mobile Handheld (320px - 767px):** 4-column layout with `1rem` (16px) margins. Designed for mobile operators registering patients and synchronizing offline batches.

### Density & Spatial Rules
- Primary clinical dashboards use dense vertical rhythm (`space-12` to `space-16`) to maintain maximum diagnostic context within the operator's primary viewport, avoiding scroll fatigue.
- Interactive controls maintain a minimum touch target of 44x44px (`2.75rem`) to accommodate clinical gloved interaction.

## Elevation & Depth

This design system eschews soft, diffuse shadows in favor of **Crisp Borders and Tonal Layering**. Soft blurs degrade image clarity and look out of place alongside medical imaging.

### Visual Depth Hierarchy
1. **Base Floor (`#F8FAFC`):** Application canvas hosting navigation and secondary panels.
2. **Clinical Surfaces (`#FFFFFF`):** High-contrast diagnostic modules, patient logs, and imaging viewports bounded by an explicit 1px border (`#E2E8F0`).
3. **Elevated Overlays & Modals:** Floated modules employ a clean, sharp structural stroke (`#CBD5E1`) paired with an intentional, low-blur ambient shadow (`0 4px 12px -2px rgba(15, 23, 42, 0.08)`).
4. **Fundus Image Inspection Viewport:** Recessed beneath an internal stroke (`inset 0 0 0 1px #0F172A`) on an absolute pitch black (`#000000`) backing to optimize optical contrast for microaneurysm and exudate visualization.

## Shapes

The interface utilizes **Soft (Level 1)** geometric curvature:
- **Base UI Elements (`rounded` / 4px):** Applied to form fields, buttons, triage badges, data table rows, and alert banners.
- **Containers & Medical Panels (`rounded-lg` / 8px):** Applied to patient profile containers, fundus viewing boxes, and modal viewports.
- **Strict Square Geometry (0px):** Applied to fundus image crops, quadrant division rulers, and AI heat-map overlays to maintain spatial calibration without rounded optical distortion.

## Components

### Buttons
- **Primary Diagnostic Action:** Deep Medical Teal background (`#0B5563`), crisp white text (`#FFFFFF`), 4px corner radius, bold/semi-bold weight. Border: 1px solid `#08414C`. On hover: `#08414C`. Focus state: 2px offset ring in `#0284C7`.
- **Severity / Critical Action:** Secondary Orange background (`#F97316`), white text (`#FFFFFF`), 1px solid `#EA580C`. Reserved for "Flag Proliferative DR", "Urgent Referral", or "Re-scan Required".
- **Secondary / Neutral Action:** Pure white background (`#FFFFFF`), Dark Charcoal text (`#0F172A`), 1px solid `#CBD5E1`. On hover: `#F1F5F9`.

### Severity Chips & Status Indicators
- **Normal / No DR:** Background `#ECFDF5`, text `#065F46`, border `#A7F3D0`.
- **Mild / Moderate NPDR:** Background `#FFF7ED`, text `#9A3412`, border `#FED7AA`.
- **Severe NPDR / Proliferative DR:** Background `#FEF2F2`, text `#991B1B`, border `#FECACA`.
- **Structure:** Chips utilize `label-caps` typography, 4px border radius, and an optional 6px circular indicator dot for non-color-reliant accessibility.

### Input Fields & Selectors
- Background: `#FFFFFF`. Border: 1px solid `#CBD5E1`. Padding: 10px 12px.
- Focus: 1px solid `#0B5563` with a 2px outer ring in `rgba(11, 85, 99, 0.15)`.
- Error / Invalid Value: 1px solid `#DC2626` accompanied by inline assistive text in `body-sm` red.

### Checkboxes & Radios
- Size: 18x18px. Border: 1.5px solid `#94A3B8`.
- Checked State: Background `#0B5563` with white internal glyph.
- Radio circles maintain a centered solid dot with 3px separation padding.

### Diagnostic Cards & Retinal Viewport
- **Diagnostic Card:** Pure white `#FFFFFF`, 1px solid `#E2E8F0`, 8px radius. Card headers feature a subtle dividing rule (`1px solid #F1F5F9`) separating metadata from diagnostic outputs.
- **Ocular Image Matrix:** Dual-eye comparison containers (OD/OS) set against `#000000` backing. Overlay controls (zoom, heat-map toggle, inverted optic disc filter) use semi-translucent dark slate controls (`rgba(15, 23, 42, 0.85)`) with pure white icons.

### Additional Screening-Specific Components
- **AI Confidence Gauge:** Linear progress bar with neutral background (`#E2E8F0`) and calibrated fill: Teal (`#0B5563`) for standard confidence thresholds, shifting to Orange (`#F97316`) if image quality score falls below 80%.
- **Quadrant Annotation Badge:** Small rectangular markers (`OD-Superior`, `OS-Macula`) styled in `data-mono-md` with high contrast borders to pinpoint lesion coordinates without obscuring tissue boundaries.