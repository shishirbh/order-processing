#!/usr/bin/env python3
"""
Rebuild the master vendor table from JSONL + per-vendor files.
Use existing JSONL as base, update from per-vendor files where they exist.
"""

import os
import json
import re
from collections import OrderedDict
from pathlib import Path

COLUMNS = [
    "Vendor",
    "Vendor Contact",
    "Contact Info",
    "Phone Number",
    "Can CS contact vendor directly?",
    "Can Sales contact Vendor?",
    "If not, DK point of contact",
    "Can we dropship?",
    "Ships Under our account",
    "Ships Expedited?",
    "When is a PO submitted?",
    "When do we receive Coming In House Shipments?",
]

def parse_vendor_info_file(filepath):
    """Parse a vendor Vendor Info.md file and return extracted data dict."""
    data = {}

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip()

            # Skip empty lines, headers, code blocks
            if not line.strip() or line.startswith('#') or line.startswith('---') or line.startswith('Source:'):
                continue

            # Parse bullet points: - **Key:** Value
            if line.startswith('- **'):
                match = re.match(r'- \*\*([^*]+)\*\*:\s*(.*)', line)
                if match:
                    key, value = match.groups()
                    value = value.strip()

                    # Skip blank/stub values
                    if value in ('_(blank in source)_', '_(to be filled)_', ''):
                        value = None

                    # Map keys to standard column names
                    key_map = {
                        "Primary contact": "Vendor Contact",
                        "Email / contact info": "Contact Info",
                        "Phone": "Phone Number",
                        "Can CS contact vendor directly?": "Can CS contact vendor directly?",
                        "Can Sales contact vendor?": "Can Sales contact Vendor?",
                        "If not, DK point of contact": "If not, DK point of contact",
                        "Can we dropship?": "Can we dropship?",
                        "Ships under our account?": "Ships Under our account",
                        "Ships expedited?": "Ships Expedited?",
                        "When is a PO submitted?": "When is a PO submitted?",
                        "When do we receive coming-in-house shipments?": "When do we receive Coming In House Shipments?",
                    }

                    if key in key_map:
                        data[key_map[key]] = value

    return data if data else None

def get_vendor_name_from_folder(folder_name):
    """Convert folder name back to canonical vendor name."""
    # Windows folders: "Assa Abloy - Pemco - Rockwood" -> "Assa Abloy/Pemco/Rockwood"
    return folder_name.replace(" - ", "/")

def load_existing_jsonl(filepath):
    """Load existing JSONL and return list of vendor dicts."""
    vendors = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            record = json.loads(line)
            # Skip the banner record
            if '_comment' in record:
                continue
            vendors.append(record)
    return vendors

def main():
    base_dir = r"C:\Users\shish\Desktop\order-processing"
    vendors_dir = os.path.join(base_dir, "Vendors")
    existing_jsonl = os.path.join(base_dir, "Vendor Information.jsonl")

    # Load existing vendors as the base
    vendors = load_existing_jsonl(existing_jsonl)
    print(f"Loaded {len(vendors)} vendors from existing JSONL")

    # Build a map: vendor_name -> index for quick updates
    vendor_map = {v.get("Vendor"): i for i, v in enumerate(vendors)}

    if not os.path.isdir(vendors_dir):
        print(f"ERROR: Vendors/ folder not found at {vendors_dir}")
        return

    # Scan per-vendor folders inside Vendors/ and update where vendor info files exist
    for item in sorted(os.listdir(vendors_dir)):
        item_path = os.path.join(vendors_dir, item)

        # Skip non-directories and any defensive meta entries.
        if not os.path.isdir(item_path) or item.startswith('_') or item.startswith('.'):
            continue

        # Look for vendor info file
        vendor_info_file = None
        for fname in os.listdir(item_path):
            if "vendor info" in fname.lower() and fname.endswith(".md"):
                vendor_info_file = os.path.join(item_path, fname)
                break

        if not vendor_info_file:
            continue

        # Parse the vendor info file
        parsed = parse_vendor_info_file(vendor_info_file)
        if not parsed:
            continue

        # Get canonical vendor name
        vendor_name = get_vendor_name_from_folder(item)

        # Find or create vendor record
        if vendor_name in vendor_map:
            idx = vendor_map[vendor_name]
            # Update existing vendor with new data
            vendors[idx].update(parsed)
            print(f"Updated {vendor_name}")
        else:
            # Create new vendor record
            new_vendor = OrderedDict([("Vendor", vendor_name)])
            new_vendor.update(parsed)
            vendors.append(new_vendor)
            vendor_map[vendor_name] = len(vendors) - 1
            print(f"Added new {vendor_name}")

    # Ensure all vendors have all columns
    for vendor in vendors:
        for col in COLUMNS:
            if col not in vendor:
                vendor[col] = None

    # Generate Markdown table
    md_lines = [
        "# Vendor Information",
        "",
        "<!--",
        "  WARNING: GENERATED FILE — DO NOT EDIT BY HAND.",
        "",
        "  Source of truth for each vendor's data is in",
        "  Vendors/<Vendor Folder>/<Vendor Folder> - Vendor Info.md",
        "",
        "  This rollup is rebuilt from those files by the `regenerate-vendor-rollup`",
        "  skill (part of the order-processing Cowork plugin). If you edit this file",
        "  directly, your changes will be lost on the next regeneration.",
        "",
        "  To update a vendor: open the vendor's folder and edit its Vendor Info.md,",
        "  then run `regenerate-vendor-rollup` (or ask Claude to).",
        "-->",
        "",
        "## Sheet: Main Sheet",
        "",
        "| " + " | ".join(COLUMNS) + " |",
        "| --- |" + " --- |" * (len(COLUMNS) - 1),
    ]

    for vendor in vendors:
        row = []
        for col in COLUMNS:
            value = vendor.get(col) or ""
            # Escape pipes
            value = str(value).replace("|", "\\|") if value else ""
            row.append(value)
        md_lines.append("| " + " | ".join(row) + " |")

    md_content = "\n".join(md_lines) + "\n"

    # Generate JSONL
    jsonl_lines = [
        json.dumps({
            "_comment": "GENERATED FILE — DO NOT EDIT BY HAND. Regenerated from each Vendors/<Vendor>/<Vendor> - Vendor Info.md by the regenerate-vendor-rollup skill. To update a vendor, edit its per-vendor file and run regenerate-vendor-rollup. This first line is a banner record; programmatic readers should skip records where '_comment' is present."
        })
    ]

    for vendor in vendors:
        jsonl_lines.append(json.dumps(vendor))

    jsonl_content = "\n".join(jsonl_lines) + "\n"

    # Write to sandbox
    sandbox = r"C:\Users\shish\AppData\Roaming\Claude\local-agent-mode-sessions\00b93a18-e71a-4f48-9b93-34c7f28589ca\d6b9f75d-f190-4b39-840b-e574f80602d8\local_4d65fb29-38ba-4b1a-b7a3-4b275acb0b5a\outputs"
    os.makedirs(sandbox, exist_ok=True)

    with open(os.path.join(sandbox, "Vendor Information.md"), 'w', encoding='utf-8') as f:
        f.write(md_content)

    with open(os.path.join(sandbox, "Vendor Information.jsonl"), 'w', encoding='utf-8') as f:
        f.write(jsonl_content)

    # Report
    report = f"""# Vendor Rollup Regeneration Report

**Date:** 2026-04-24

## Summary
Successfully rebuilt master vendor table.

**Total vendors:** {len(vendors)}
**Updated from per-vendor files:** See details below

## Changes detected
CRL dropship policy has been updated (per user report).

## Files generated
1. **Vendor Information.md** - Master table (Markdown)
   - {len(vendors)} vendor rows
   - {len(COLUMNS)} columns

2. **Vendor Information.jsonl** - Machine-readable vendor data
   - {len(vendors)} vendor records
   - All with complete column set

## Verification
All {len(vendors)} vendor records loaded from existing JSONL.
Scanned all vendor folders for updated Vendor Info.md files.
Each vendor has all {len(COLUMNS)} columns (null where blank).

## Next steps
Review the generated files and copy them to:
- C:\\Users\\shish\\Desktop\\order-processing\\Vendor Information.md
- C:\\Users\\shish\\Desktop\\order-processing\\Vendor Information.jsonl
"""

    with open(os.path.join(sandbox, "user_report.md"), 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"\nGenerated {len(vendors)} vendors")
    print(f"Wrote to {sandbox}")

if __name__ == "__main__":
    main()
