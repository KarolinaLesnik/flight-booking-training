# Training Flights

A small React/Vite demonstration using fictional local flight data. **TRAINING ONLY — simulated booking, no ticket issued.**

## Prerequisites and local commands

Use Node.js 24 LTS with npm. Python is not required. Run these PowerShell commands from `flight-booking-training`:

```powershell
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open http://127.0.0.1:5173. Keep that terminal open while using the app. Stop with Ctrl+C before starting another server.

For an existing installation, dependency installation is only needed when dependencies are missing or change. `npm.cmd install` can be used for initial setup; retain `package-lock.json`. A fresh clone uses `npm.cmd ci`.

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open http://127.0.0.1:4173 to check the built files. Preview is local, not public hosting. Stop with Ctrl+C.

## Try it

Search Bengaluru (BLR) to Delhi (DEL) on **2026-11-20**. Choose a flight, use **Test Traveller**, and enter 1–6 passengers. The total appears before confirmation. Prices are fictional INR amounts per person; departures are local IST times.

## Manual acceptance checks

| ID | Action | Expected result |
| --- | --- | --- |
| T01 | Search BLR → DEL, 2026-11-20 | Exactly TR101 and TR102 |
| T02 | Search BOM → DEL or use a different valid date | Clear no-flights message |
| T03 | Choose the same airports; separately clear the date and search | Helpful validation and no results for the invalid search |
| T04 | Select TR101, Test Traveller, two passengers; confirm | SIMULATED, TRAIN-prefixed reference, total INR 10,000 |
| T05 | Submit a blank/whitespace name; separately try counts 0, 7, 1.5 and empty | Helpful validation and no confirmation |
| T06 | Refresh after confirmation | Selection and confirmation clear |
| T07 | Build and run local preview, then repeat search and booking | Both work in the built app |

Also check changing any search field or the selected flight clears the old confirmation immediately. Editing the name or passenger count also clears it. Navigate with Tab, Shift+Tab, arrow keys in dropdowns/radio choices, and Enter/Space; check visible focus, readable labels, and narrow-screen layout. The training notice stays visible while scrolling.

### Verification recorded on 2026-11-03

- `npm.cmd run build`: passed after allowing Vite's child process outside the sandbox. The first sandboxed attempt failed with `spawn EPERM`; no code correction was required.
- Local preview launch: blocked by the execution policy, including the approval-requested retry.
- T01–T07 browser behavior, keyboard access, and narrow-screen layout: not executed by Codex. Run the manual checks above in your browser; the successful build alone does not verify them.

## How it works and limitations

- `src/data/flights.js` contains the three exact fixtures from the included build brief.
- `src/App.jsx` holds search, selection, validation and confirmation in React state. `src/App.css` and `src/index.css` provide ordinary CSS.
- For example, changing a search field calls `setSearch` with a new object, then clears results, selection and confirmation. React renders the new values so an old booking cannot remain attached to a changed search.
- All state is memory-only. Refreshing clears selection and confirmation and restores the initial search and test name. There is no local storage or database.
- TRAIN references are locally generated display identifiers, not reservations. There is no backend, external API, AI API, authentication, payment, ticketing or seat inventory.
- Use fictional names only. Do not enter real passenger information.

## AI-use note

OpenAI Codex assisted with implementation and documentation. Human review should verify the fixture data, validation, totals, accessibility, and manual checks above. Build results alone do not establish that browser checks passed; no automated test framework is included.
