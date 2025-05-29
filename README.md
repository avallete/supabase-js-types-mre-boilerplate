# Supabase-JS TypeScript Types MRE

This repository contains a Minimal Reproducible Example (MRE) for TypeScript type issues with Supabase.

## Getting Started

1. Fork this repository
2. Clone your fork
3. Install dependencies with `pnpm install`

## Setup

1. **Database Setup**

   - Navigate to the `db` directory
   - The database schema is defined in `init.sql`

2. **Generate Types**

   - Run `pnpm run generate` to:
     - Start the database
     - Generate TypeScript types from your schema
     - The types will be output to `database.types.ts`

3. **Reproduce the Issue**
   - Add your query in `repro.ts`
   - Include the expected valid result that TypeScript should accept
   - This helps demonstrate the type error you're encountering
