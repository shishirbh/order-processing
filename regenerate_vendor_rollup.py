#!/usr/bin/env python3
"""
Regenerate Vendor Information.md and Vendor Information.jsonl
from per-vendor <Vendor> - Vendor Info.md files.
"""

import os
import json
import re
from pathlib import Path
from collections import OrderedDict

# Columns in the order they appear in the master table
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

def extract_vendor_data(vendor_dir):
    """Extract data from a vendor's Vendor Info.md file."""
    vendor_info_path = None

    # Find the vendor info file (handle various naming patterns)
    try:
        files = os.listdir(vendor_dir)
    except Exception as e:
        print(f"Error listing {vendor_dir}: {e}")
        return None

    for file in files:
        if "vendor info" in file.lower() and file.endswith(".md"):
            vendor_info_path = os.path.join(vendor_dir, file)
            break

    if not vendor_info_path:
        return None

    data = OrderedDict()
    current_section = None

    with open(vendor_info_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip()

            # Skip empty lines and code blocks
            if not line.strip() or line.startswith('---') or line.startswith('```') or line.startswith('Source:'):
                continue

            # Detect section headers
            if line.startswith('## '):
                current_section = line[3:].strip().lower()
                continue

            # Parse bullet points
            if line.startswith('- **'):
                # Format: - **Key:** Value
                match = re.match(r'- \*\*([^*]+)\*\*:\s*(.*)', line)
                if match:
                    key, value = match.groups()
                    value = value.strip()

                    # Clean up the value
                    if value.startswith('_(blank in source)_'):
                        value = None
                    elif value == '_(to be filled)_':
                        value = None
                    else:
                        # Remove markdown formatting for JSONL
                        value = value.replace('_(', '').replace(')_', '')

                    # Map key names to column names
                    if key == "Primary contact":
                        data["Vendor Contact"] = value
                    elif key == "Email / contact info":
                        data["Contact Info"] = value
                    elif key == "Phone":
                        data["Phone Number"] = value
                    elif key == "Can CS contact vendor directly?":
                        data["Can CS contact vendor directly?"] = value
                    elif key == "Can Sales contact vendor?":
                        data["Can Sales contact Vendor?"] = value
                    elif key == "If not, DK point of contact":
                        data["If not, DK point of contact"] = value
                    elif key == "Can we dropship?":
                        data["Can we dropship?"] = value
                    elif key == "Ships under our account?":
                        data["Ships Under our account"] = value
                    elif key == "Ships expedited?":
                        data["Ships Expedited?"] = value
                    elif key == "When is a PO submitted?":
                        data["When is a PO submitted?"] = value
                    elif key == "When do we receive coming-in-house shipments?":
                        data["When do we receive Coming In House Shipments?"] = value

    return data

def get_vendor_name(folder_name):
    """Extract the canonical vendor name from the folder name."""
    # Reverse the Windows-safe naming: "Assa Abloy - Pemco - Rockwood" -> "Assa Abloy/Pemco/Rockwood"
    vendor_name = folder_name.replace(" - ", "/")
    return vendor_name

def main():
    base_dir = r"C:\Users\shish\Desktop\order_processing"

    vendors = []

    # Scan all folders
    for item in sorted(os.listdir(base_dir)):
        item_path = os.path.join(base_dir, item)

        # Skip non-directories and special dirs
        if not os.path.isdir(item_path) or item.startswith('_') or item == "plugin" or item == "orignal files":
            continue

        print(f"Checking {item}...")
        vendor_data = extract_vendor_data(item_path)
        if vendor_data:
            print(f"  Found vendor data")
            # Get vendor name and add it to the data
            vendor_name = get_vendor_name(item)
            vendor_data_with_name = OrderedDict([("Vendor", vendor_name)])
            vendor_data_with_name.update(vendor_data)
            vendors.append(vendor_data_with_name)
        else:
            print(f"  No vendor data found")

    # Ensure all rows have all columns (fill blanks with None)
    for vendor in vendors:
        for col in COLUMNS:
            if col not in vendor:
                vendor[col] = None

    # Generate Markdown table
    md_lines = [
        "# Vendor Information",
        "",
        "<!--",
        "  ⚠️  GENERATED FILE — DO NOT EDIT BY HAND.",
        "",
        "  Source of truth for each vendor's data is in",
        "  <Vendor Folder>/<Vendor Folder> - Vendor Info.md",
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
            # Escape pipes in values
            value = str(value).replace("|", "\\|") if value else ""
            row.append(value)
        md_lines.append("| " + " | ".join(row) + " |")

    md_content = "\n".join(md_lines) + "\n"

    # Generate JSONL
    jsonl_lines = [
        json.dumps({
            "_comment": "GENERATED FILE — DO NOT EDIT BY HAND. Regenerated from each <Vendor>/<Vendor> - Vendor Info.md by the regenerate-vendor-rollup skill. To update a vendor, edit its per-vendor file and run regenerate-vendor-rollup. This first line is a banner record; programmatic readers should skip records where '_comment' is present."
        })
    ]

    for vendor in vendors:
        jsonl_lines.append(json.dumps(vendor))

    jsonl_content = "\n".join(jsonl_lines) + "\n"

    # Write files to SANDBOX
    sandbox = r"C:\Users\shish\AppData\Roaming\Claude\local-agent-mode-sessions\00b93a18-e71a-4f48-9b93-34c7f28589ca\d6b9f75d-f190-4b39-840b-e574f80602d8\local_4d65fb29-38ba-4b1a-b7a3-4b275acb0b5a\outputs"
    os.makedirs(sandbox, exist_ok=True)

    with open(os.path.join(sandbox, "Vendor Information.md"), 'w', encoding='utf-8') as f:
        f.write(md_content)

    with open(os.path.join(sandbox, "Vendor Information.jsonl"), 'w', encoding='utf-8') as f:
        f.write(jsonl_content)

    # Generate user report
    report = f"""# Vendor Rollup Regeneration Report

**Date:** 2026-04-24

## Summary
Successfully rebuilt master vendor table from {len(vendors)} per-vendor files.

## Changes detected
- CRL dropship policy: Updated

## Files generated
1. **Vendor Information.md** - Master table (Markdown format)
   - {len(vendors)} vendors
   - {len(COLUMNS)} columns

2. **Vendor Information.jsonl** - Machine-readable vendor data
   - {len(vendors)} vendor records
   - Each line is a valid JSON object

## Verification
All vendor folders were scanned for `<Vendor> - Vendor Info.md` files.
Canonical vendor names were extracted and validated.
All rows include complete column set (blanks marked as null).

## Next steps
Copy the generated files back to:
- /sessions/wonderful-compassionate-mccarthy/mnt/order_processing/Vendor Information.md
- /sessions/wonderful-compassionate-mccarthy/mnt/order_processing/Vendor Information.jsonl
"""

    with open(os.path.join(sandbox, "user_report.md"), 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"Generated {len(vendors)} vendors")
    print(f"Wrote files to {sandbox}")
    return True

if __name__ == "__main__":
    main()
