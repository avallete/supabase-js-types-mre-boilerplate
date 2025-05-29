import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { expectType } from "tsd";
import { TypeEqual } from "ts-expect";

const client = createClient<Database>("", "");

// Expect data to be of type:
// const data: {
//     id: number;
//     name: string | null;
// }[] | null
const { data } = await client.from("users").select("*");
let expected:
  | {
      id: number;
      name: string | null;
    }[]
  | null;
// ensure both types are equals
expectType<TypeEqual<typeof data, typeof expected>>(true);
