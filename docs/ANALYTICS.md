# Analytics (Vercel)

This project uses **Vercel Analytics** (`@vercel/analytics/react`). When the app is deployed on Vercel, the Analytics component sends page views to Vercel.

## What you get in the Vercel dashboard

- **Page views** – How many times each page was loaded
- **Unique visitors** – Approximate number of distinct visitors (based on browser fingerprint / cookie)
- **Top pages** – Which routes are visited most
- **Referrers** – Where traffic comes from (e.g. Google, direct)

You can see these under: **Vercel Dashboard → Your project → Analytics**.

## What Vercel Analytics does *not* provide

- **Visitor names** – Not collected. To know “who” visited you would need a voluntary form (e.g. “Enter your name”) or a login; the app is read-only and does not collect names.
- **Visitor city/country** – Not included in the default Vercel Analytics product. For geographic stats you could:
  - Use **Vercel Web Analytics** (if available on your plan) and check if it includes region/country.
  - Add a third-party tool (e.g. Plausible, Umami, Google Analytics) that supports geo by IP (often with consent).
- **“Active users” in real time** – Vercel Analytics is aggregate (e.g. daily/weekly counts), not a live “who is online now” list.

## Summary

- **How many users / how much traffic:** Use the Vercel project **Analytics** tab (page views, unique visitors).
- **Who (by name), city, or live active list:** Not available out of the box; would require extra features (optional form, backend, or another analytics service).
