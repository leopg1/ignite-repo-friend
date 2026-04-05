

## Plan: Remove inner card from Free Analysis section

**What changes**: Remove the inner dark card (lines 470-498) that contains the Search icon, "Fără obligații", "Primești raportul în 24-48h", the button, and "Răspundem în max 2 ore". Instead, integrate the button and key text directly into the left content area, below the features list.

**File**: `src/pages/Index.tsx` (FreeAnalysisBlock function, lines ~468-498)

**Steps**:
1. Remove the entire `motion.div` block (lines 470-498) that renders the inner card with dark background
2. Below the features list (after the `mb-6 lg:mb-0` div), add:
   - A subtle "Fără obligații · Primești raportul în 24-48h" text line
   - The "Vreau analiza gratuită" button (keeping hover/tap animations)
   - The "Răspundem în max 2 ore" small text
3. Adjust the parent flex layout from `flex-col lg:flex-row` to a simpler centered layout since there's no longer a two-column split
4. Remove `lg:mb-0` from features div and adjust spacing for a single-column flow

The result will be a single cohesive card with content flowing top-to-bottom (or left-aligned on desktop), with the CTA button naturally integrated below the features list.

