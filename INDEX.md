# Vendor Alias INDEX

<!--
  ⚠️  Do not edit by hand unless adding/removing a vendor.
  This file maps every vendor name and sub-brand alias to its
  folder under Vendors/.  Lookups are case-insensitive.
  Regenerate with the `regenerate-index` skill if the data changes.
-->

Quick-reference table for deterministic vendor → folder routing.
When a user mentions a vendor name, sub-brand, or common variant,
match it against the **Lookup key** column (case-insensitive) to
find the folder path under `Vendors/`.

If a lookup key appears in **BOTH** sections (e.g. "HD Supply"),
the **Alias** entry wins — it points to the combined vendor folder.

---

## Canonical names

Every vendor folder maps directly to itself.

| Lookup key | Vendor folder |
|---|---|
| Abaco Machines | Abaco Machines |
| ACE - Emery Jensen | ACE - Emery Jensen |
| AES Industries | AES Industries |
| All tools & fasteners(ATF) | All tools & fasteners(ATF) |
| AM Auto | AM Auto |
| Ameriseal | Ameriseal |
| Amerock | Amerock |
| Aria Vetri | Aria Vetri |
| Armortex | Armortex |
| Assa Abloy - Pemco - Rockwood | Assa Abloy - Pemco - Rockwood |
| Banner | Banner |
| Bluewater Supply | Bluewater Supply |
| Bob Deck | Bob Deck |
| Bohle - Portals | Bohle - Portals |
| BWI | BWI |
| Cal-Royal | Cal-Royal |
| Choice | Choice |
| Contacta | Contacta |
| CRL | CRL |
| D&D Technologies | D&D Technologies |
| Delaney | Delaney |
| Deltana | Deltana |
| Display Fixture | Display Fixture |
| Do it best | Do it best |
| Don-Jo | Don-Jo |
| Door Controls | Door Controls |
| Dot Foods | Dot Foods |
| Drill America | Drill America |
| EPCO | EPCO |
| Eran Group | Eran Group |
| Exact Replacement Parts | Exact Replacement Parts |
| Fairchild | Fairchild |
| FHC | FHC |
| Florida Hardware Company | Florida Hardware Company |
| FWP | FWP |
| Gaab | Gaab |
| Glass Warehouse | Glass Warehouse |
| Glazelock | Glazelock |
| Groves | Groves |
| Hafele | Hafele |
| Hager | Hager |
| Hardware Resources | Hardware Resources |
| Haven | Haven |
| HB Fuller | HB Fuller |
| HD Supply Solutions | HD Supply Solutions |
| Hilti | Hilti |
| Home Depot - US lock - HD Supply | Home Depot - US lock - HD Supply |
| Horner Express | Horner Express |
| Hy Grade Metal | Hy Grade Metal |
| Ideal Security | Ideal Security |
| Ilco | Ilco |
| IML | IML |
| Imperial Dade | Imperial Dade |
| Imperial USA | Imperial USA |
| Int Door Closers | Int Door Closers |
| Int Screw Corp | Int Screw Corp |
| Jeske | Jeske |
| JLM WHOLESALE | JLM WHOLESALE |
| JNB Pro | JNB Pro |
| Johnson Hvac | Johnson Hvac |
| Karcher | Karcher |
| Knape&Vogt | Knape&Vogt |
| Krisis Bags | Krisis Bags |
| Kroil | Kroil |
| LAVI | LAVI |
| Ledsion | Ledsion |
| Legacy | Legacy |
| Lockey USA | Lockey USA |
| Melting Pont | Melting Pont |
| Mirart | Mirart |
| MSC Direct | MSC Direct |
| National oak | National oak |
| Norcon | Norcon |
| Orgill | Orgill |
| ORS Nasco | ORS Nasco |
| Pamex | Pamex |
| Perfect Score | Perfect Score |
| Petermeier | Petermeier |
| Plastics House | Plastics House |
| Pool Corp | Pool Corp |
| Precision | Precision |
| Prime-Line - Sentry | Prime-Line - Sentry |
| Q-railing | Q-railing |
| QuikServ | QuikServ |
| Ready Access | Ready Access |
| Richelieu | Richelieu |
| SDC | SDC |
| Security Lock | Security Lock |
| Shuresafe | Shuresafe |
| Southern Lock | Southern Lock |
| Strategic Brands | Strategic Brands |
| Structure Glass Solutions | STRUCTURE GLASS SOLUTIONS |
| Strybuc | Strybuc |
| Taymor | Taymor |
| Team Horner | Team Horner |
| TopNotch | TopNotch |
| True Value | True Value |
| Unelko | Unelko |
| US Horizon | US Horizon |
| Vauth&Sagel | Vauth&Sagel |
| Wallace | Wallace |
| Weslock | Weslock |
| Westmarine | Westmarine |
| Wood's Powr Grip (WPG) | Wood's Powr Grip (WPG) |
| Wurth | Wurth |

---

## Sub-brand aliases

Short names that map to a combined vendor folder.

| Lookup key | Resolves to folder | Source |
|---|---|---|
| ACE | ACE - Emery Jensen | Alias |
| Emery Jensen | ACE - Emery Jensen | Alias |
| Assa Abloy | Assa Abloy - Pemco - Rockwood | Alias |
| Pemco | Assa Abloy - Pemco - Rockwood | Alias |
| Rockwood | Assa Abloy - Pemco - Rockwood | Alias |
| Bohle | Bohle - Portals | Alias |
| Portals | Bohle - Portals | Alias |
| Home Depot | Home Depot - US lock - HD Supply | Alias |
| US lock | Home Depot - US lock - HD Supply | Alias |
| HD Supply | Home Depot - US lock - HD Supply | Alias |
| Prime-Line | Prime-Line - Sentry | Alias |
| Sentry | Prime-Line - Sentry | Alias |

---

## Common name variants

Alternate spellings / table names that differ from the folder name.

| Lookup key | Resolves to folder | Reason |
|---|---|---|
| ATF | All tools & fasteners(ATF) | Abbreviation |
| Structure Glass | STRUCTURE GLASS SOLUTIONS | Table name vs folder name |
| Top Notch | TopNotch | Table name (with space) vs folder name |
| Top-Notch | TopNotch | Hyphenated variant |
| WPG | Wood's Powr Grip (WPG) | Abbreviation |

---

## Ambiguity notes

- **"HD Supply"** appears in two places:
  - As a sub-brand of **Home Depot - US lock - HD Supply** (the alias entry above).
  - As a standalone vendor **HD Supply Solutions** (separate company, different account).
  - **Rule:** "HD Supply" alone → Home Depot group. Only route to HD Supply Solutions
    if the user explicitly says "HD Supply Solutions" (the full name).

- **Ideal Security** and **Pamex** have folders under `Vendors/` but no row in the
  master `Vendor Information.md` table yet. Their Process Documents exist; Vendor Info
  is pending.

---
Last regenerated: 2026-05-12
