import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { expectType } from "tsd";
import { TypeEqual } from "ts-expect";

const client = createClient<Database>("", "");

const { data } = await client
  .from("countries")
  .select(
    `name,
  country_alphas!inner (
    alpha2,
    alpha3
  ),
  country_alpha_locations(location)
  `
  )
  .eq("name", "Canada")
  .single();

let expected: {
  name: string;
  country_alphas: {
    alpha2: string;
    alpha3: string;
  };
  country_alpha_locations: {
    location: string;
  } | null;
} | null;
expectType<TypeEqual<typeof data, typeof expected>>(true);

// RPC Call filtering
const { data: data2 } = await client
  .rpc("all_countries")
  .select(
    `
  name,
  country_alphas!inner (
    alpha2,
    alpha3
  )
  `
  )
  /**
   * This line results in a type error because supabase fails to recognize read filters
   * on rpc calls: https://postgrest.org/en/v12/references/api/functions.html
   * Property 'eq' does not exist on type 'PostgrestTransformBuilder<{ Tables: { countries: { Row: { id: number; name: string; lowername: string | null; }; Insert: { id?: undefined; name: string; }; Update: { id?: undefined; name?: string | undefined; }; Relationships: []; }; country_alphas: { ...; }; }; Views: {}; Functions: { ...; }; Enums: {}; CompositeTy...'.ts(2339)
   *
   * Note: it works as expected despite the type error
   */
  .eq("name", "Canada")
  .single();
type data2Expected = {
  name: string;
  country_alphas: {
    alpha2: string;
    alpha3: string;
  };
} | null;
expectType<TypeEqual<typeof data2, data2Expected>>(true);

const { data: data3 } = await client
  .rpc("country_by_name", { name: "Canada" })
  .select(
    `
    name,
    lowername,
    country_alphas!inner (
      alpha2,
      alpha3
    )
    `
  )
  .single();

type data3Expected = {
  name: string;
  lowername: string | null;
  country_alphas: {
    alpha2: string;
    alpha3: string;
  };
} | null;
expectType<TypeEqual<typeof data3, data3Expected>>(true);
/**
 * This line results in a type error because supabase fails to recognize the
 * computed field on the rpc select: https://postgrest.org/en/v12/references/api/computed_fields.html
 *
 * Returning a type of:
 * const caResponse: SelectQueryError<"column 'lowername' does not exist on 'country_by_name'.">
 */

const { data: caResponse } = await client
  .from("countries_view")
  .select(
    `
  id,
  ...countries!inner (
    name,
    country_alphas!inner (
      alpha2,
      alpha3
    ),
    country_alpha_locations!inner (
      location
    )
  )
  `
  )
  .eq("name", "Canada")
  .single();

type caResponseExpected = {
  id: number | null;
  name: string;
  country_alphas: {
    alpha2: string;
    alpha3: string;
  };
  country_alpha_locations: {
    location: string;
  };
} | null;
expectType<TypeEqual<typeof caResponse, caResponseExpected>>(true);

const { data: mxResponse } = await client
  .rpc("countries_by_name", { name: "Mexico" })
  .select(
    `
  name,
  lowername,
  country_alphas!inner (
    alpha2,
    alpha3
  )
  `
  )
  .single();

type mxResponseExpected = {
  name: string;
  lowername: string | null;
  country_alphas: {
    alpha2: string;
    alpha3: string;
  };
} | null;
expectType<TypeEqual<typeof mxResponse, mxResponseExpected>>(true);
