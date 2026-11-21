# Dulux Employee Gathering 2027 — Greater Together

Participant microsite (frontend prototype) for Dulux Employee Gathering 2027, 16–18 December 2026, Swissôtel Jakarta PIK Avenue.

Adapted from the JTI Marketing Conference microsite: it keeps that site's architecture (TanStack Start, file routes, Tailwind 4, Motion), its navigation (sticky floating header, full-screen menu led by the pass), the pass layout, URL-driven sheets, and the FAQ accordion. The JTI backend (Upstash Redis, auth, server functions) is gone.

## Run

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # SSR build via Nitro (.output/)
npm run typecheck
```

Node 24.

## Pages

| Route         | Contents                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `/`           | KV hero, link to the pass, road-to-event countdown, pre-event checklist, manifesto, journey phases |
| `/passport`   | My Canvas Pass: QR, participant, piece identity, checklist, Day 1 check-in status, FAQ             |
| `/schedule`   | Day 1 flow (7 moments, in order). Day 2 and Day 3 are marked coming soon                           |
| `/activities` | Before Event (The First Stroke, Change Talk Question Box) and the Day 1 activities                 |
| `/guide`      | Dress code, venue photos and location, travel tips, transportation, FAQ                            |

## Where things live

- `src/lib/event.ts`: all event content, sourced from the planner brief and the Glow Act deck. Facts the materials don't give are marked TBC.
- `src/lib/participant.ts`: prototype state (sample participant, First Stroke, questions, check-ins, One-Word Pulse). It is stored in `localStorage` and nothing is sent anywhere.
- `src/lib/demo.ts`: demo mode. The site opens in presentation mode, showing only what attendees will see. Add `?demo=1` to any URL to reveal the stand-in controls ("Simulate crew scan", "Reset demo" in the menu); `?demo=0` hides them again. The choice is remembered in the browser.
- `src/components/canvas/Canvas.tsx`: the KV's graphic language (tiles, mosaics, the flowing ribbon, and a piece for each strength) drawn as SVG.
- `src/styles.css`: design tokens. The colours are sampled from the Greater Together KV. Headlines use Poppins Black Italic, the KV wordmark's face; body text is Poppins.

## Prototype boundaries

- **Check-ins.** In demo mode, a "Simulate crew scan" control stands in for the crew's scanner. The QR only encodes the sample pass ID.
- **Sample data.** The participant, team and room are sample values and are labelled as such.
- **Unconfirmed content.** These are shown as labelled placeholders until the event team confirms them:
  - clock times
  - the evening venue
  - pick-up times and points
  - the Day 1 dress code
  - Day 2 and Day 3
  - final welcome kit visuals
- **Proposed names.** The Change Talk guest stars and the Sunset Social line-up are shown as "proposed", as they are in the deck.
