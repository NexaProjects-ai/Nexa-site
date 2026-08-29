# Sample QA report — Validated PDF/Table → Excel

**Synthetic demonstration only. No client data.**

## Delivery summary
- 10 source pages represented
- 10 structured records
- 9 rows validated automatically/manual spot-check logic
- 1 row routed to review instead of silently guessing
- Output schema: page, record ID, date, supplier, SKU, description, quantity, unit price, line total, validation status

## Checks applied
1. Required fields present: record ID, date, supplier, description, quantity and price.
2. Quantity × unit price cross-check against extracted line total.
3. Date normalized to ISO `YYYY-MM-DD`.
4. Numeric fields normalized to decimal values without currency symbols.
5. Duplicate record IDs checked across batch.
6. Source page retained for traceability.
7. Ambiguous or low-confidence values are flagged rather than invented.

## Exception log
| Source page | Record | Field | Issue | Action |
|---|---|---|---|---|
| 10 | INV-2026-0821-010 | SKU | Source value partly obscured in synthetic input | Flagged `REVIEW_REQUIRED`; no guessed replacement |

## Buyer-facing result
The finished file is not merely transcribed text. It is structured, typed, traceable and ready to sort, filter, import or analyse. The exception log makes uncertain values explicit so the buyer knows exactly what still needs human review.
