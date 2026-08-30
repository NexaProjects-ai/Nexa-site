#!/usr/bin/env python3
"""Deterministic QA for Nexa validated PDF/table -> Excel/CSV deliveries.

Usage:
  python tools/validated_table_qa.py input.csv --required id,name,amount --unique id --source-page source_page --out qa-report.md

The tool never repairs data silently. It reports missing values, duplicate keys,
invalid source-page references and row-level exceptions so a human can review only
flagged rows before delivery.
"""

from __future__ import annotations
import argparse
import csv
from collections import Counter
from pathlib import Path


def split_csv_arg(value: str | None) -> list[str]:
    return [x.strip() for x in (value or "").split(",") if x.strip()]


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    p.add_argument("--required", default="")
    p.add_argument("--unique", default="")
    p.add_argument("--source-page", default="source_page")
    p.add_argument("--out", type=Path, default=Path("qa-report.md"))
    args = p.parse_args()

    required = split_csv_arg(args.required)
    unique = split_csv_arg(args.unique)

    with args.input.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fields = reader.fieldnames or []

    findings: list[tuple[int, str, str]] = []
    missing_columns = [c for c in required + unique if c not in fields]
    if args.source_page and args.source_page not in fields:
        missing_columns.append(args.source_page)

    for col in sorted(set(missing_columns)):
        findings.append((0, "SCHEMA", f"Missing expected column: {col}"))

    for idx, row in enumerate(rows, start=2):
        for col in required:
            if col in fields and not (row.get(col) or "").strip():
                findings.append((idx, "MISSING", f"Required field '{col}' is blank"))
        if args.source_page in fields:
            raw = (row.get(args.source_page) or "").strip()
            if not raw:
                findings.append((idx, "TRACE", f"Missing {args.source_page}"))
            else:
                try:
                    page = int(raw)
                    if page < 1:
                        raise ValueError
                except ValueError:
                    findings.append((idx, "TRACE", f"Invalid {args.source_page}: {raw!r}"))

    for col in unique:
        if col not in fields:
            continue
        vals = [(r.get(col) or "").strip() for r in rows]
        counts = Counter(v for v in vals if v)
        dupes = {v for v, n in counts.items() if n > 1}
        for idx, row in enumerate(rows, start=2):
            value = (row.get(col) or "").strip()
            if value and value in dupes:
                findings.append((idx, "DUPLICATE", f"Duplicate {col}: {value}"))

    clean_rows = max(0, len(rows) - len({r for r, _, _ in findings if r > 0}))
    status = "PASS" if not findings else "REVIEW REQUIRED"

    lines = [
        "# QA report",
        "",
        f"- File: `{args.input.name}`",
        f"- Rows checked: {len(rows)}",
        f"- Rows without findings: {clean_rows}",
        f"- Findings: {len(findings)}",
        f"- Status: **{status}**",
        "",
        "## Checks",
        "",
        f"- Required fields: {', '.join(required) if required else 'none configured'}",
        f"- Unique keys: {', '.join(unique) if unique else 'none configured'}",
        f"- Source trace column: {args.source_page or 'none'}",
        "",
        "## Findings",
        "",
    ]
    if findings:
        lines += ["| CSV row | Type | Detail |", "|---:|---|---|"]
        for rownum, kind, detail in findings:
            row_label = "schema" if rownum == 0 else str(rownum)
            lines.append(f"| {row_label} | {kind} | {detail.replace('|', '/')} |")
    else:
        lines.append("No findings. Deterministic checks passed.")

    lines += [
        "",
        "## Delivery rule",
        "",
        "Never guess or silently repair ambiguous source data. Resolve or explicitly flag every finding before client delivery.",
    ]
    args.out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(status)
    return 0 if not findings else 2


if __name__ == "__main__":
    raise SystemExit(main())
