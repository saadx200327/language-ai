# Agent Workflow for Language Ai
This GitHub repo is the only source of truth for Language Ai.
Future AI improvement loops must read and edit normal GitHub files, not temporary uploaded zip files or /mnt/data paths.
Stable baseline branch:
baseline-v5-firebase
Rules:
- Do not touch the live Netlify site automatically.
- Do not auto-deploy.
- Weekly deploys are manual.
- New work must happen on separate branches named improvement/YYYY-MM-DD-description.
- Do not auto-merge improvement branches.
- Do not commit passwords or private credentials.
- Preserve Firebase Auth, Firestore sync, guest mode, localStorage fallback, leaderboard behavior, existing courses, and service worker behavior.
- The source files must stay individually editable in GitHub.
- Do not rely on zip files as the source of truth.
Required root files:
- index.html
- styles.css
- app.js
- firebase-backend.js
- FIRESTORE_RULES.txt
- README.md
- sw.js
- AGENT_WORKFLOW.md
- manifest.webmanifest
