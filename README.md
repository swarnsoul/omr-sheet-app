# OMR Sheet Web App

A pixel-perfect, interactive digital replica of the **Multigraphics Group 100-Question Sample OMR Sheet**, built with Next.js (App Router), TypeScript, Tailwind CSS, and native SVG.

---

## Features

- **Exact Physical Replica**: Faithful digital recreation of the Multigraphics Group sample OMR sheet adhering strictly to A4 proportions ($920 \times 1300\text{ px}$ canvas) with timing marks along both borders.
- **Fluid Responsive Scaling (Desktop, Tablet & Mobile)**:
  - The sheet remains an un-reflowed master SVG on a $920 \times 1300\text{ px}$ canvas.
  - Dynamically measures available viewport width via `ResizeObserver` and scales proportionally (`transform: scale()`) with a sized wrapper.
  - No horizontal overflow, zero bottom clipping, and zero phantom margins.
  - Zoom modes: **Fit Width (default)**, **Fit Page**, **100%**, **50%–200%**, and double-tap to zoom on touch screens. Remembers zoom preferences in `localStorage`.
- **Mobile Quick Entry Mode**:
  - Auto-adapted for small viewports ($< 640\text{ px}$) and toggleable on any device.
  - Question stepper with large touch targets ($\ge 48\text{ px}$) for options $A, B, C, D$.
  - Progress tracker, previous/next stepper buttons, jump-to-question selector, and 100-question grid overview.
- **Dedicated Paper & Candidate Details Editor**:
  - Mobile-friendly bottom sheet / desktop modal to cleanly input exam info, candidate name, roll number, stream, class, section, and codes.
  - Mobile input font sizes $\ge 16\text{ px}$ to prevent iOS auto-zoom on focus.
- **Interactive 100-Question Grid**: 4 columns of 25 questions ($1\text{–}25$, $26\text{–}50$, $51\text{–}75$, $76\text{–}100$) with four options ($A, B, C, D$). Clicking an option marks it in solid black; clicking again un-marks it.
- **Candidate Identification Blocks**:
  - Candidate Name ($21\text{ columns} \times 26\text{ alphabet bubbles } A\text{–}Z$).
  - Class ($6\text{th}\text{–}12\text{th}$), Section ($A\text{–}J$), Stream (PCM, PCB, COM, HUM), and Set Number ($1, 2, 3$).
  - Roll Number ($2\text{ digits}$), Subject Code ($3\text{ digits}$), and Admission Number ($4\text{ digits}$) with $0\text{–}9$ bubble rows.
- **Native SVG Master Rendering**: Every bubble, label, box, and timing mark is rendered inside a master SVG with mathematical centering (`textAnchor="middle"` and `dominantBaseline="central"`), guaranteeing that bubbles never shift or overlap borders.
- **High-Resolution Exports**:
  - **Download PDF**: Single-page A4 PDF rendered at $3\times$ scale ($2760 \times 3900\text{ px}$) with FAST lossless compression.
  - **Download PNG / JPG**: Ultra-sharp $3\times$ raster export directly to your device.
  - **Optional Answer Key Summary Page**: Appends a second page with a 4-column 100-question answer key table and option distribution statistics.
- **Local Persistence & Sheet Management**:
  - Continuous auto-save to browser `localStorage` on every change.
  - "My Saved Sheets" drawer to name, duplicate, rename, export/import JSON, and reopen saved sheets.
  - Quick Fill simulator for testing and answer key generation.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & CSS Variables
- **Icons**: Lucide React
- **Document Generation**: jsPDF (A4 layout) & HTML5 Canvas vector rasterization
- **Storage**: Client-side `localStorage` (No external backend required)

---

## How to Run Locally

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## How to Export PDF / PNG

1. Fill out your sheet details and mark your responses (either directly on the sheet or via **Quick Entry Mode**).
2. In the toolbar:
   - Click **"Download PDF"** for an immediate, high-resolution A4 PDF.
   - Click **"Download PNG"** for a high-res ($2760 \times 3900$) image.
   - Click the **Settings icon** next to "Download PDF" to customize the file name or check **"Include Answer Key Summary Page"** to add a structured second page.
   - Click **"Print"** for the browser print dialog.

---

## Project Structure

```
├── app/
│   ├── globals.css            # Print rules, 100dvh, touch-action, mobile font sizing
│   ├── layout.tsx             # Document root layout, responsive viewport metadata
│   └── page.tsx               # Main viewport, ResizeObserver scaling wrapper, modals
├── components/
│   ├── AnswerKeySummary.tsx   # Offscreen 2nd-page SVG summary generator
│   ├── DownloadModal.tsx      # Responsive export options popover / bottom sheet
│   ├── OMRSheet.tsx           # Master SVG sheet with interactive inputs
│   ├── PaperDetailsModal.tsx  # Mobile-friendly paper & candidate details editor
│   ├── QuickEntryModal.tsx    # Mobile quick entry stepper & 100-question grid
│   ├── SavedSheetsModal.tsx   # Responsive saved sheets manager & JSON backup
│   └── Toolbar.tsx            # Desktop / tablet / mobile toolbar & sticky bottom nav
├── types/
│   └── omr.ts                 # State data structures and empty initial state
├── utils/
│   ├── exportImage.ts         # 3x high-resolution PNG / JPG export
│   ├── exportPdf.ts           # Direct A4 jsPDF generator (canvas-to-PDF)
│   └── storage.ts             # LocalStorage autosave & sheet operations
├── package.json
├── tailwind.config.js
└── tsconfig.json
```
