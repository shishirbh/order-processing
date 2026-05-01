# DK Order Processing — Setup Guide

Everything needed to get the order processing browser chat UI running on any computer.

---

## Prerequisites (one-time per machine)

| Thing | Why | Get it |
|-------|-----|--------|
| **Node.js ≥ 18** | Runs the server | `winget install OpenJS.NodeJS.LTS` or [nodejs.org](https://nodejs.org) |
| **npm** | Installs dependencies | Comes with Node.js |
| **Git** | Clone the repo | `winget install Git.Git` or [git-scm.com](https://git-scm.com) |
| **pi** | The AI coding agent | `npm install -g @mariozechner/pi-coding-agent` |
| **LLM API key** | pi needs an LLM to answer questions | Set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` env var |

### Setting your API key

**Windows (Command Prompt):**
```cmd
set ANTHROPIC_API_KEY=sk-ant-...
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-..."
```

**Mac / Linux:**
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

To make it permanent, add it to your shell profile (`~/.bashrc`, `~/.zshrc`, or System Environment Variables on Windows).

---

## Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/shishirbh/order-processing.git
cd order_processing

# 2. Install dependencies
npm install

# 3. Link the CLI command
npm link

# 4. Launch
dk-order-processing
```

Open the URL printed in the terminal (e.g. `http://localhost:51234`).

---

## One-click setup (Windows only)

Double-click `setup.cmd` in the repo root. It will:

1. Install **Node.js** if missing (via winget)
2. Install **Git** if missing (via winget)
3. Install **pi** globally if missing
4. Run `npm install` and `npm link`
5. Launch `dk-order-processing`

The window stays open so you can see any errors.

---

## What happens at launch

`dk-order-processing` starts a local web server. On every conversation:

1. **Reads the local repo** — uses the current `order_processing/` directory as the knowledge base. No cloning, no network calls for data.
2. **Auto-loads 6 skills** from `plugin/skills/`:
   - `vendor-lookup` — look up any vendor's contacts, rules, and process
   - `add-new-vendor` — onboard a new supplier
   - `sop-refresh` — update SOPs with change notes
   - `update-vendor-info` — edit a vendor's fields
   - `draft-claim-email` — write a claim email for damaged/wrong orders
   - `regenerate-vendor-rollup` — rebuild the master vendor table
3. **Auto-loads `CLAUDE.md`** as agent context — routing rules, folder map, citation contract
4. **Starts an HTTP server** on a random port, serving the browser chat UI
5. **Sessions saved** to `~/.dk-order-processing/sessions/` — persist across restarts

---

## Example questions

Try these in the browser chat:

- *"What's the minimum order value for Deltana?"*
- *"Can we dropship with Cal-Royal?"*
- *"Draft a claim email for a damaged IML shipment"*
- *"Update Hafele's phone number to 954-555-1234"*
- *"What's Pemco's email?"*
- *"How do I escalate a claim with Hafele?"*
- *"Add a new vendor: Acme Hardware, rep is Sarah at sarah@acme.com"*

---

## Updating

Launching `dk-order-processing` auto-runs `git pull --rebase` at startup, so you always get the latest knowledge base and skills without doing anything extra.

If `package.json` changed (new dependencies), run:

```bash
npm install
```

Then re-launch.

---

## Files you need

The repo is self-contained. The code that runs the app:

```
order_processing/
├── package.json           ← npm manifest + pi SDK dependency
├── server/cli.mjs         ← HTTP server + pi agent
├── server/public/         ← browser chat UI
├── scripts/               ← Python helper scripts
├── setup.cmd              ← Windows one-click installer
└── .gitignore             ← ignores node_modules, temp files, etc.
```

Everything else is the knowledge base (vendor data, SOPs, skills).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `dk-order-processing: command not found` | Run `npm link` from the repo root |
| `Cannot find module '@mariozechner/pi-coding-agent'` | Run `npm install` |
| Port already in use | The app auto-picks a free port; if it fails, close the other instance |
| API key error | Make sure `ANTHROPIC_API_KEY` is set in your environment |
| Skills not loading | Verify `plugin/skills/` has the 6 skill folders each with a `SKILL.md` |
| blank page in browser | Ensure you open the HTTP URL (not a file:// path) |
