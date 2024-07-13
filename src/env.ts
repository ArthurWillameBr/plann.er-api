import { z } from "zod"

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3333),
    API_BASE_URL: z.string().url(),
    WEB_BASE_URL: z.string().url()
})

export const env = envSchema.parse(process.env)