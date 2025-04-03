import { z } from "zod";

// Schema that ensures a string is a number
export const StringAsNumberSchema = z
  .string()
  .refine((val) => !isNaN(Number(val)), {
    message: "String must be a valid number",
  })
  .transform((val) => Number(val));
