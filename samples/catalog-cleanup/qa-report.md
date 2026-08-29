# Sample QA report — Supplier Catalog → Shopify Import-Ready CSV

**Synthetic demonstration only. No client data.**

## Delivery summary
- Supplier-style product data normalized into Shopify product/variant rows
- Handles standardized
- Variant SKUs generated consistently
- Prices normalized to decimal format
- Tags normalized and deduplicated
- Image URLs validated for HTTPS shape
- Product/variant structure made explicit

## Checks applied
1. Required Shopify import columns mapped.
2. Duplicate rows and duplicate SKUs checked.
3. Prices stripped of currency symbols and normalized to two decimals.
4. Empty handles generated from product titles.
5. Variants grouped under the same product handle.
6. Option names and values normalized.
7. Inventory fields converted to integers.
8. Missing or suspicious source values would be routed to an exception list rather than invented.

## Boundary
This offer cleans and structures catalog data. It does not promise SEO rankings, rewrite hundreds of descriptions from scratch, scrape restricted sources, or make unsupported claims about products.

## Buyer-facing result
The buyer receives a reviewable, import-ready CSV rather than a generic spreadsheet cleanup. The value is fewer failed imports, fewer silent mapping errors and less manual rework before products go live.
