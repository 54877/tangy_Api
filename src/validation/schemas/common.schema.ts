import { z } from "../../config/zod";
import { IdScheme } from "../rules/common.rule";

export const IdSchema = z.object({
  id: IdScheme,
});
