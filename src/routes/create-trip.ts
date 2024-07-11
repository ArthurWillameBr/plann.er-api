import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function CreateTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/trips", {
        schema: {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
            })
        }
    }, async (request) => {
        const {destination, ends_at, starts_at} = request.body

        return {
            destination,
            ends_at,
            starts_at
        }
    })
}