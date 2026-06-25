# /githubupdate

Publish the Red Beacon Asset Management site to GitHub. Runs five steps in order — abort with a clear message if any step fails.

**Repo:** `cscht9whcw-code/rbadvisory`
**Live site:** `https://cscht9whcw-code.github.io/rbadvisory/`
**Known allowed email in source:** `lionel.goh@redbeaconam.com` (form recipient, intentional)

---

## Step 1 — Security scan

Scan every tracked file (`index.html`, `styles.css`, `script.js`) for sensitive data before anything is pushed. Check for:

- Real email addresses that are NOT `lionel.goh@redbeaconam.com` (any other `@` pattern that looks like a real address)
- API keys or tokens matching patterns: `ghp_`, `sk-`, `Bearer `, `token:`, `secret:`, `password:`, `api_key`, `apikey` (case-insensitive)
- Private key blocks: `-----BEGIN`
- Hard-coded credentials or connection strings

Use `Grep` with appropriate patterns across all three source files. If anything suspicious is found, **stop immediately**, list the findings, and ask the user to resolve them before proceeding.

If the scan is clean, state: "Security scan passed — no sensitive data detected."

---

## Step 2 — Update README.md

Read the current `index.html` to extract accurate, up-to-date facts about the site (sections present, features, form integration status). Then rewrite `README.md` so it reflects the actual current state. The README must include:

- H1 title: `Red Beacon Asset Management`
- One-paragraph description of what the site is
- `## Live Site` section with the link: `https://cscht9whcw-code.github.io/rbadvisory/`
- `## Tech Stack` — Vanilla HTML/CSS/JS, no frameworks, no build tools
- `## Project Structure` — file tree with brief descriptions of `index.html`, `styles.css`, `script.js`, `.github/workflows/deploy.yml`
- `## Features` — list from actual content in `index.html` (sections, animations, carousel, form, responsive nav)
- `## Running Locally` — `npx serve .` instruction, note that the form needs HTTP (not `file://`)
- `## Deployment` — explain that pushing to `main` triggers the GitHub Actions workflow which deploys to GitHub Pages automatically

Write the README with standard UTF-8 text (no wide-character / double-spaced encoding). Keep it concise and professional.

---

## Step 3 — Commit and push

1. Run `git status` to see what has changed.
2. Stage only the project source files — never stage `.env`, credentials, or files matching `.gitignore`. Stage: `index.html`, `styles.css`, `script.js`, `README.md`, `.github/workflows/deploy.yml`, and any other tracked source files shown as modified.
3. Write a commit message that summarises what changed (check `git diff --cached` to inform the message). Format: short imperative subject line, blank line, then bullet points for notable changes if more than one file changed.
4. Commit and push to `origin main`.

If there are no changes to commit, skip this step and say so.

---

## Step 4 — Confirm GitHub Pages deployment

After pushing, run:

```
gh run list --repo cscht9whcw-code/rbadvisory --workflow deploy.yml --limit 3
```

Report the status of the latest run (queued / in_progress / completed: success or failure). If it failed, show the failure URL so the user can inspect the logs. If it succeeded or is in progress, confirm the live URL: `https://cscht9whcw-code.github.io/rbadvisory/`

---

## Step 5 — Update repo About

Run the following `gh` command to set the repo description and website:

```
gh repo edit cscht9whcw-code/rbadvisory \
  --description "Single-page investment advisory website for Red Beacon Asset Management — vanilla HTML/CSS/JS, deployed to GitHub Pages." \
  --homepage "https://cscht9whcw-code.github.io/rbadvisory/"
```

Confirm success. If `gh` is not authenticated, tell the user to run `gh auth login` and retry.

---

## Final summary

Print a concise table:

| Step | Result |
|------|--------|
| Security scan | ✓ Clean / ✗ Issues found |
| README updated | ✓ Updated / — No changes needed |
| Git push | ✓ Pushed / — Nothing to commit |
| GitHub Pages | ✓ Deployed / ⏳ In progress / ✗ Failed |
| Repo About | ✓ Updated |
