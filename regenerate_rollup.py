#!/usr/bin/env python3
"""
Regenerate Vendor Information.md and Vendor Information.jsonl from per-vendor Vendor Info.md files.
"""
import os
import json
import re
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path("C:/Users/shish/Desktop/order_processing")

# Hardcoded table columns (from the master table)
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
    "Column 13",
]

def clean_value(val):
    """Clean and normalize a value."""
    if not val or val in ("_(blank)_", "_(blank in source)_", "_blank_", ""):
        return None
    return val.strip() if isinstance(val, str) else val

def extract_vendor_info(vendor_path):
    """Extract vendor info from <Vendor>/<Vendor> - Vendor Info.md"""
    # Try exact match first
    info_file = vendor_path / f"{vendor_path.name} - Vendor Info.md"

    if not info_file.exists():
        # Try to find any file ending with "- Vendor Info.md"
        for f in vendor_path.iterdir():
            if f.name.endswith("- Vendor Info.md"):
                info_file = f
                break
        else:
            return None

    if not info_file.exists():
        return None

    data = {}
    try:
        with open(info_file, "r", encoding="utf-8") as f:
            content = f.read()

        # Try table format first (hand-curated)
        is_table_format = "| Field | Value |" in content

        if is_table_format:
            # Parse markdown table rows
            # Look for lines like "| Field | Value |"
            for line in content.split("\n"):
                if "|" not in line:
                    continue
                parts = [p.strip() for p in line.split("|")]
                if len(parts) < 3:
                    continue

                field = parts[1]
                value = clean_value(parts[2])

                # Skip header rows and empty rows
                if field in ("Field", "---") or not field:
                    continue

                # Map field names to column names
                if field == "Vendor":
                    # Use directory name if vendor value is blank
                    data["Vendor"] = value if value else vendor_path.name
                elif field == "Vendor Contact":
                    data["Vendor Contact"] = value
                elif field == "Contact Info":
                    data["Contact Info"] = value
                elif field == "Phone Number":
                    data["Phone Number"] = value
                elif field == "Can CS contact vendor directly?":
                    data["Can CS contact vendor directly?"] = value
                elif field == "Can Sales contact Vendor?":
                    data["Can Sales contact Vendor?"] = value
                elif field == "If not, DK point of contact":
                    data["If not, DK point of contact"] = value
                elif field == "Can we dropship?":
                    data["Can we dropship?"] = value
                elif field == "Ships Under our account":
                    data["Ships Under our account"] = value
                elif field == "Ships Expedited?":
                    data["Ships Expedited?"] = value
                elif field == "When is a PO submitted?":
                    data["When is a PO submitted?"] = value
                elif field == "When do we receive Coming In House Shipments?":
                    data["When do we receive Coming In House Shipments?"] = value
                elif field == "Column 13":
                    data["Column 13"] = value
        else:
            # Parse the auto-generated format
            # Extract vendor name from first heading (fallback to directory name)
            vendor_found = False
            for line in content.split("\n"):
                if line.startswith("# "):
                    # Extract vendor name (e.g., "# Abaco Machines — Vendor Info" -> "Abaco Machines")
                    vendor_name = line.replace("# ", "").split("—")[0].strip()
                    if vendor_name and vendor_name.lower() != "vendor info":
                        data["Vendor"] = vendor_name
                        vendor_found = True
                    break

            if not vendor_found:
                # Use directory name as fallback
                data["Vendor"] = vendor_path.name

            # Parse sections
            lines = content.split("\n")
            for i, line in enumerate(lines):
                line = line.strip()

                # Contacts section
                if "**Primary contact:**" in line:
                    value = line.split("**Primary contact:**")[-1].strip()
                    data["Vendor Contact"] = clean_value(value)
                elif "**Email / contact info:**" in line:
                    value = line.split("**Email / contact info:**")[-1].strip()
                    data["Contact Info"] = clean_value(value)
                elif "**Phone:**" in line:
                    value = line.split("**Phone:**")[-1].strip()
                    data["Phone Number"] = clean_value(value)

                # Communication rules
                elif "**Can CS contact vendor directly?**" in line:
                    value = line.split("**Can CS contact vendor directly?**")[-1].strip()
                    data["Can CS contact vendor directly?"] = clean_value(value)
                elif "**Can Sales contact vendor?**" in line:
                    value = line.split("**Can Sales contact vendor?**")[-1].strip()
                    data["Can Sales contact Vendor?"] = clean_value(value)
                elif "**If not, DK point of contact:**" in line:
                    value = line.split("**If not, DK point of contact:**")[-1].strip()
                    data["If not, DK point of contact"] = clean_value(value)

                # Shipping
                elif "**Can we dropship?**" in line:
                    value = line.split("**Can we dropship?**")[-1].strip()
                    data["Can we dropship?"] = clean_value(value)
                elif "**Ships under our account?**" in line:
                    value = line.split("**Ships under our account?**")[-1].strip()
                    data["Ships Under our account"] = clean_value(value)
                elif "**Ships expedited?**" in line:
                    value = line.split("**Ships expedited?**")[-1].strip()
                    data["Ships Expedited?"] = clean_value(value)

                # Timing
                elif "**When is a PO submitted?**" in line:
                    value = line.split("**When is a PO submitted?**")[-1].strip()
                    data["When is a PO submitted?"] = clean_value(value)
                elif "**When do we receive coming-in-house shipments?**" in line:
                    value = line.split("**When do we receive coming-in-house shipments?**")[-1].strip()
                    data["When do we receive Coming In House Shipments?"] = clean_value(value)

    except Exception as e:
        print(f"Error reading {info_file}: {e}")
        return None

    # Ensure all columns exist
    for col in COLUMNS:
        if col not in data:
            data[col] = None

    return data if data.get("Vendor") else None

def get_all_vendors():
    """Scan all vendor folders and extract their info."""
    vendors = []

    # Only check directories that exist and have a Vendor Info file
    for vendor_dir in sorted(ROOT_DIR.iterdir()):
        if not vendor_dir.is_dir():
            continue
        if vendor_dir.name.startswith("_"):  # Skip _shared_sops, _source_docx, etc.
            continue
        if vendor_dir.name in ("orignal files", ".vscode"):  # Skip old folder and hidden
            continue

        info = extract_vendor_info(vendor_dir)
        if info:
            vendors.append(info)
        else:
            print(f"  (skipped {vendor_dir.name}: no vendor info)")

    return vendors

def write_md_rollup(vendors, output_path):
    """Write Vendor Information.md with markdown table."""
    header = f"""# Vendor Information

<!--
  ⚠️  GENERATED FILE — DO NOT EDIT BY HAND.

  Source of truth for each vendor's data is in
  <Vendor Folder>/<Vendor Folder> - Vendor Info.md

  This rollup is rebuilt from those files by the `regenerate-vendor-rollup`
  skill (part of the order-processing Cowork plugin). If you edit this file
  directly, your changes will be lost on the next regeneration.

  To update a vendor: open the vendor's folder and edit its Vendor Info.md,
  then run `regenerate-vendor-rollup` (or ask Claude to).
-->

## Sheet: Main Sheet

| {" | ".join(COLUMNS)} |
| {" | ".join(["---"] * len(COLUMNS))} |
"""

    for vendor in vendors:
        row = []
        for col in COLUMNS:
            val = vendor.get(col)
            row.append(str(val) if val else "")
        header += "| " + " | ".join(row) + " |\n"

    header += "\n\n## Sheet: CRL \n\n_(empty sheet)_\n"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(header)

def write_jsonl_rollup(vendors, output_path):
    """Write Vendor Information.jsonl with one vendor per line."""
    with open(output_path, "w", encoding="utf-8") as f:
        # Banner record
        banner = {"_comment": "GENERATED FILE — DO NOT EDIT BY HAND. Regenerated from each <Vendor>/<Vendor> - Vendor Info.md by the regenerate-vendor-rollup skill. To update a vendor, edit its per-vendor file and run regenerate-vendor-rollup. This first line is a banner record; programmatic readers should skip records where '_comment' is present."}
        f.write(json.dumps(banner) + "\n")

        # Vendor records
        for vendor in vendors:
            # Convert blanks to None for JSON
            record = {}
            for col in COLUMNS:
                val = vendor.get(col)
                record[col] = val if val else None
            f.write(json.dumps(record) + "\n")

def main():
    print("Scanning vendor directories...")
    vendors = get_all_vendors()
    print(f"Found {len(vendors)} vendors")

    md_path = ROOT_DIR / "Vendor Information.md"
    jsonl_path = ROOT_DIR / "Vendor Information.jsonl"

    print(f"Writing {md_path}...")
    write_md_rollup(vendors, md_path)

    print(f"Writing {jsonl_path}...")
    write_jsonl_rollup(vendors, jsonl_path)

    print("Done!")

if __name__ == "__main__":
    main()
