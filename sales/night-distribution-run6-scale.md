# Night Distribution Sprint — Run 6

## Leader
Validated PDF/table → analysis-ready Excel/CSV with source traceability and exception logging.

## Working assumptions
- Test price: €129 for <=30 clear pages / one agreed schema.
- Marketplace fee model for planning: 10% when sourced through Freelancer.com.
- Human QA target after deterministic validation: 10–20 min/order; planning midpoint 15 min.
- Challenge human cost: €30/h = €7.50/order at 15 min.
- AI/OCR/tool cost is not yet booked; prototype is designed to work with existing tools and zero new spend.
- Taxes, Belgian compliance/payment overhead and revisions beyond the included correction round are excluded from the contribution figures below.

## Scale model
| Orders/month | Revenue | After 10% platform fee | Human QA @15m | Contribution before tax/tools | Human QA hours |
|---:|---:|---:|---:|---:|---:|
| 10 | €1,290 | €1,161 | €75 | €1,086 | 2.5 h |
| 50 | €6,450 | €5,805 | €375 | €5,430 | 12.5 h |
| 200 | €25,800 | €23,220 | €1,500 | €21,720 | 50 h |

These are scenario estimates, not realized margins. At 200 orders/month the service is no longer low-human unless QA is reduced further or price/ticket rises.

## Fulfillment component built
`tools/validated_table_qa.py`

Deterministic checks:
- expected schema/required columns;
- missing required values;
- duplicate keys;
- positive integer source-page traceability;
- row-level exception report;
- explicit PASS vs REVIEW REQUIRED status.

The validator never silently repairs or invents ambiguous data. It concentrates human review on flagged rows.

## Productization ladder
1. Manual service with fixed boundaries and synthetic proof.
2. Standardized intake: source PDFs + target schema + required/unique field rules.
3. Reusable extraction/mapping template + deterministic QA validator + exception-only human review.
4. Batch pipeline for recurring customer/partner jobs.
5. Only after repeated paid demand: lightweight upload/API/partner portal. No SaaS before proof.

## Business-quality verdict
- Fast-cash fit: GOOD when buyer already has a bounded accuracy-sensitive extraction job.
- Repeatability: GOOD for recurring supplier/admin/reporting document batches.
- Automation leverage: HIGH on normalization, validation and report generation; OCR/extraction quality remains source-dependent.
- Human burden: acceptable at low/medium volume if exception rate stays low; 200 orders/month requires more automation or higher-value batches.
- Platform dependence: medium. Marketplace demand is useful for validation but should be complemented by direct inbound/white-label partners.
- Commoditization risk: HIGH for generic PDF→Excel/transcription. Nexa must sell validated, schema-mapped, traceable output rather than typing.
- Moat: weak at service level; potential process/data-schema/partner integration moat only after recurring workflows exist.
- Privacy/legal: customer documents may contain personal/confidential data; intake must state data handling, minimize retention and avoid sensitive/high-risk categories unless a compliant workflow exists.

## Kill thresholds
Kill or reposition the premium offer if either occurs:
- first 10 suitable accuracy-sensitive buyer opportunities consistently price near commodity transcription and ignore QA/traceability; or
- actual average human QA/revision time exceeds 30 min/order on bounded jobs at €129.

Verdict: RETAIN for market validation, but do not mistake it for a defensible SaaS. Distribution evidence, not product novelty, is the reason it survives.
