import { z } from "zod";
import { REGISTER_SCHEMA } from "../const/registerSchema";
export type RegisterFormData = z.infer<typeof REGISTER_SCHEMA>;
