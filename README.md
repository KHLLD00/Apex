# Apex Gadgets

Frontend for Apex Gadgets — a fictional Nigerian electronics e-commerce store built as a portfolio project. Demonstrates a complete shopping experience (browse → cart → checkout → simulated payment → confirmation) without any real payment processing.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Client-side cart/coupon state persisted to localStorage

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Notes
- All product data is mock data in `src/data/products.ts`.
- Payments are fully simulated in `src/components/checkout/CheckoutFlow.tsx` — no real payment processor is integrated, per the project brief.
- Cart and simulated orders persist in the browser's localStorage.
- Out of scope (per brief): accounts, wishlist, real payments/shipping integrations, reviews system, multi-vendor, mobile app.
