# Nexa Night Distribution Sprint — Run 3 Offer Shootout

Date: 2026-08-30

## Decision

**Provisional leader: Validated PDF/Table → Analysis-Ready Excel**

**Challenger: Supplier Catalog → Shopify Import-Ready CSV**

**Killed for tonight as a standalone offer: generic Excel/CSV cleanup.** The work is real, but the market is saturated with low-priced generic cleanup gigs. Nexa only keeps cleanup as a component inside a higher-value finished output.

---

## OFFER 1 — Validated PDF/Table → Analysis-Ready Excel

### Buyer
Operations, finance, admin, purchasing or reporting teams that receive PDF batches and need the data in a spreadsheet they can actually sort, analyse or import.

### Trigger
A batch of invoices, reports, statements, supplier lists or tabular PDFs arrives and somebody otherwise has to copy/check it manually.

### Fixed scope
**€129 fixed**

- up to 30 pages
- one agreed output schema
- typed Excel/CSV-ready fields
- date/number normalization
- duplicate and required-field checks
- source-page traceability
- discrepancy / exception log
- 24-hour target turnaround after usable files + schema are supplied
- one correction round for extraction errors

### Boundary
Handwriting, severely damaged scans, complex nested tables, >30 pages, or documents requiring interpretation rather than extraction are quoted separately.

### Guarantee
If a clearly legible field covered by the agreed schema is missed or mapped incorrectly, Nexa corrects it without additional charge. Ambiguous source values are flagged, never guessed.

### Why pay instead of Acrobat/OCR/ChatGPT/VA?
The paid result is not raw OCR. It is a **validated, typed, traceable dataset plus an exception log**. The buyer gets something usable downstream instead of another file to manually audit.

### Proof
- `samples/validated-pdf-to-excel/sample-output.csv`
- `samples/validated-pdf-to-excel/qa-report.md`

### Economics estimate
Assumptions, not observed buyer economics:
- price: €129
- Freelancer fixed-price fee assumption from current public terms: 10% → €12.90
- net before fulfillment: €116.10
- AI/parser/template processing: ~15–30 min for clean digital PDFs; irregular scans can exceed this
- human QA target: 10–20 min
- expected total fulfillment target: 30–50 min on in-scope batch
- gross contribution before payment/tax/compliance overhead: roughly €91–€101 if human time is valued at €30/h

### Load-bearing kill assumption
A buyer will pay materially more than commodity transcription because validation + exception logging removes downstream checking.

### Same-day falsification
Bid/position only on jobs that mention accuracy, totals, schema, immediate usability, structured workbook or spot checks. If the first 10 suitable hand-raisers consistently clear near commodity pricing and ignore QA differentiation, kill the premium fixed offer.

---

## OFFER 2 — Supplier Catalog → Shopify Import-Ready CSV

### Buyer
Small Shopify merchants, ecommerce operators and VAs receiving messy supplier Excel/CSV files with products, variants, prices, images and SKUs.

### Trigger
A new supplier/brand file must be imported or refreshed, but the source columns and product/variant structure do not match Shopify cleanly.

### Fixed scope
**€149 fixed**

- up to 250 source rows / approximately 100 products, whichever comes first
- one supplier file
- map source columns to Shopify import fields
- normalize handles, SKUs, prices, tags and variant structure
- duplicate/missing-field checks
- import-ready CSV
- exception list for rows needing buyer decisions
- 24-hour target turnaround after receiving source file and store-field requirements
- one correction round for mapping errors

### Boundary
No scraping of restricted sources, no store login required, no mass SEO rewriting, no unsupported product claims, no image editing, and no guarantee that third-party app/theme custom fields import without a supplied schema.

### Guarantee
If the delivered CSV contains a mapping/formatting error inside the agreed schema, Nexa corrects it without additional charge. Missing supplier facts are flagged, not invented.

### Why pay instead of a generic listing VA or free CSV fixer?
The buyer is purchasing **supplier-file mapping + variant normalization + an exception list**, not manual copy/paste. Free tools handle common formatting errors; they do not necessarily resolve the buyer's specific source-to-target mapping or ambiguous supplier data.

### Proof
- `samples/catalog-cleanup/shopify-import-ready.csv`
- `samples/catalog-cleanup/qa-report.md`

### Economics estimate
Assumptions, not observed buyer economics:
- price: €149
- Freelancer fee at 10% → €14.90
- net before fulfillment: €134.10
- parsing/mapping/normalization target: 20–35 min
- human QA target: 10–20 min
- expected total fulfillment target: 35–60 min for clean supplier data
- gross contribution before payment/tax/compliance overhead: roughly €104–€117 if human time is valued at €30/h

### Load-bearing kill assumption
Enough buyers have messy supplier-specific mapping problems that a fixed mapping/QA service can escape the €5–€30 generic listing market and free CSV cleaners.

### Same-day falsification
Only pursue hand-raisers mentioning supplier sheets, variants, import errors, mapping, large catalogs or migration. If demand is mostly simple product entry priced per item, park this service and keep the transformation logic for later tooling.

---

## Competitor / substitute evidence snapshot

### Validated PDF/Table → Excel
- Fiverr generic PDF→Excel/data-cleaning services commonly start around **$15–$20**, including offers that bundle deduplication/formatting.
- Current Freelancer PDF→Excel jobs range from low commodity rates around **$2–$10/h** to **$15–$25/h** where accuracy/structure are emphasized.
- Conclusion: plain conversion is a commodity. Nexa must sell validation, downstream usability and explicit exceptions.

### Catalog → Shopify-ready CSV
- Fiverr generic Shopify product listing/import services commonly start around **$5–$30**, with some specialist/import offers higher.
- A current Freelancer catalog-fill request for ~200 products/brand is budgeted at **€30–€100** and is heavily crowded, showing real demand but strong commodity pressure.
- Self-service Shopify CSV cleanup tools exist at free, $9/session and roughly $19–$149 credit-package levels.
- Conclusion: generic upload is killed. Only supplier-specific mapping, variant normalization and QA are worth testing as a service.

### Generic Excel cleanup
- Fiverr has thousands of Excel cleanup listings, many starting around **$15**; experienced sellers can still sell larger work, but the undifferentiated offer is hard for a new seller to win.
- Keep cleanup embedded inside a business outcome rather than list it as the primary product.

---

## Run-4 instruction
Build the inbound acquisition asset around **Validated PDF/Table → Analysis-Ready Excel** unless a new live buyer signal before the next run materially contradicts this choice. The acquisition message should lead with: `PDFs in. Clean, checked Excel out — with every uncertainty flagged.`
