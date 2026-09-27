# Apex Gadgets Backend Architecture

## Purpose

Apex Gadgets is a fictional Nigerian electronics e-commerce portfolio project. The backend will add realistic persistence and administration without introducing production-scale infrastructure or real payment processing.

## Current application boundary

- **Framework:** Next.js 14 App Router + TypeScript
- **UI:** React + Tailwind CSS
- **Current catalog:** `src/data/products.ts`
- **Current categories:** `src/data/categories.ts`
- **Current coupons:** `src/data/coupons.ts`
- **Current cart:** `src/context/CartContext.tsx`, persisted to browser localStorage
- **Current checkout:** `src/components/checkout/CheckoutFlow.tsx`
- **Current order confirmation:** `src/components/checkout/OrderConfirmation.tsx`
- **Current shared types:** `src/types/index.ts`

These static data modules will remain useful as UI/reference data during the migration, but Supabase will become the authoritative source once the backend integration phase begins.

## Target architecture

```
Browser / React UI
        |
        | public reads / checkout requests
        v
Next.js App Router
  |                 |
  |                 +--> src/app/api/*       HTTP endpoints where useful
  |
  +--> src/lib/backend/*                     server-side domain operations
  |          |
  |          +--> Supabase server client
  |
  +--> src/lib/supabase/*
             |
             +--> Supabase Auth
             +--> PostgreSQL
             +--> Storage
```

### 1. Supabase clients

Target location:

- `src/lib/supabase/client.ts` — browser-safe Supabase client using only public environment variables.
- `src/lib/supabase/server.ts` — server-side client for Server Components, Route Handlers, and Server Actions.
- `src/lib/supabase/admin.ts` — server-only service-role client for narrowly scoped trusted operations.

The service-role client must never be imported by browser/client components.

### 2. Backend/domain layer

Target location:

`src/lib/backend/`

Suggested modules:

- `products.ts` — product/category/variant queries and mutations
- `inventory.ts` — stock validation and stock updates
- `coupons.ts` — coupon validation and discount calculation
- `orders.ts` — order validation, totals and order creation
- `payments.ts` — simulated payment workflow
- `admin.ts` — admin authorization and dashboard queries
- `errors.ts` — predictable application errors

This layer keeps business rules out of React components.

### 3. API / server entry points

Target location:

`src/app/api/`

Only operations that benefit from an HTTP boundary need Route Handlers. Server Actions may be used where they provide a simpler fit.

Planned endpoints/actions include:

- product/catalog reads
- admin product/category management
- coupon validation
- checkout/order creation
- simulated payment
- admin order management
- dashboard statistics

The exact endpoint set will be finalized during implementation rather than creating unnecessary routes.

### 4. Shared types

Keep shared frontend/backend contracts in:

`src/types/`

The current frontend `Product`, `CartItem`, `Coupon`, and `Order` types will be evolved into database-aligned domain types without coupling UI components directly to Supabase-generated internals.

## Data ownership

| Concern | Current source | Target source |
|---|---|---|
| Products | local TypeScript array | PostgreSQL |
| Categories | local TypeScript array | PostgreSQL |
| Variants | embedded product data | PostgreSQL |
| Product images | product image URLs | Supabase Storage + PostgreSQL records |
| Cart | localStorage | Browser cart remains guest-local |
| Coupons | local TypeScript array | PostgreSQL |
| Orders | localStorage | PostgreSQL |
| Inventory | product `stock` field | PostgreSQL |
| Payment | client-side simulation | Server-controlled simulation |
| Admin access | none | Supabase Auth + authorization/RLS |

The guest cart does not need a database-backed cart table because customer accounts are explicitly out of scope.

## Checkout trust boundary

The browser may submit:

- customer details
- selected product IDs
- selected variant IDs/attributes
- quantities
- requested delivery method
- coupon code

The server must determine:

- current product/variant prices
- current stock
- coupon validity
- subtotal
- discount
- delivery fee
- final total

Frontend totals are display-only and must never become the authoritative order amount.

## Admin boundary

Admin-only mutations include:

- create/update/deactivate products
- manage categories
- manage variants
- manage product images
- modify inventory
- create/manage coupons
- view orders
- change order status
- view dashboard statistics

Supabase Auth identifies the signed-in admin, while database RLS and server-side authorization protect the underlying data.

## Migration strategy

1. Introduce Supabase infrastructure without disrupting the current UI.
2. Define database-aligned types and query functions.
3. Seed Supabase with the mock catalogue.
4. Switch public product/category reads from static arrays to Supabase.
5. Move coupon validation to the server.
6. Move checkout/order creation to the server.
7. Move simulated payment handling to the server.
8. Add admin authentication and protected management operations.
9. Remove obsolete static commerce logic only after the Supabase-backed flows are verified.

## Non-goals

The architecture deliberately does not introduce:

- Express/NestJS
- a separate backend server
- customer accounts
- real payment gateways
- payment webhooks
- shipping APIs
- email/SMS/WhatsApp infrastructure
- warehouse management
- advanced analytics

## Environment boundary

Expected environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Only variables prefixed with `NEXT_PUBLIC_` may be exposed to browser code. The service-role key remains server-only.

## Phase 1 completion state

This document defines the implementation boundary and migration strategy. No Supabase schema, authentication setup, backend endpoints, or production data migration is performed in Phase 1.
