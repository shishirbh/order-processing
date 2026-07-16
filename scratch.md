# Railway Deployment Work Summary

## Branch

- Created `railway-deployment` from `pi`.
- Committed the Railway preparation as:
  - `c7c58bd Prepare app for Railway deployment`

## Changes made

Converted the existing browser UI and API into one Railway-deployable Node.js service:

- Added `npm start` to `package.json`.
- Updated `server/cli.mjs` to:
  - Listen on Railway's `PORT` environment variable.
  - Bind to `0.0.0.0` by default.
  - Expose an unauthenticated `GET /health` endpoint.
  - Protect application routes with HTTP Basic authentication when `APP_PASSWORD` is set.
  - Use `APP_USERNAME`, defaulting to `dk`.
  - Store sessions, pi sessions, and feedback under configurable `DATA_DIR`.
  - Skip runtime `git pull` on Railway or when `NO_GIT_SYNC=1`.
- Added `railway.json` with:
  - Railpack builder.
  - `npm start` start command.
  - `/health` health check.
  - Restart-on-failure policy.
- Added `.env.example` documenting the required and optional variables.
- Updated `.gitignore` to exclude local environment files while retaining `.env.example`.
- Added Railway deployment instructions to `README.md`.
- Updated `package-lock.json` through `npm install`.

## Railway variables

Required:

- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
- `APP_PASSWORD` — use a long, random password

Optional:

- `APP_USERNAME` — defaults to `dk`
- `DATA_DIR=/data` — use with a Railway volume mounted at `/data`
- `NO_GIT_SYNC=1` — Railway already skips Git synchronization automatically

Railway supplies `PORT` automatically.

## Validation performed

- Installed npm dependencies.
- Confirmed JavaScript syntax and JSON configuration are valid.
- Confirmed `/health` returns HTTP 200.
- Confirmed `/` returns HTTP 401 without credentials.
- Confirmed `/` returns HTTP 200 with valid credentials.
- Confirmed the working tree was clean after the deployment commit.

## Dependency note

`npm install` reported six vulnerabilities: one moderate and five high. No automatic audit fixes were applied.

## Next steps

1. Commit this `scratch.md` file if it should be retained in Git.
2. Deploy with `railway up`.
3. Configure the required Railway variables.
4. Optionally attach a Railway volume at `/data` for persistent sessions and feedback.
5. Generate a Railway domain after deployment succeeds.
