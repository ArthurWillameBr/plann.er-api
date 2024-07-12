import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs"
import z from "zod";
import { prisma } from "../lib/prisma";

export async function CreateTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/trips", {
        schema: {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email()   
            })
        }
    }, async (request) => {
        const {destination, ends_at, starts_at, owner_name, owner_email} = request.body

        if (dayjs(starts_at).isBefore(new Date())) {
            throw new Error("invalid trip start date")
        }

        if(dayjs(ends_at).isBefore(dayjs(starts_at))) {
            throw new Error("invalid trip end date")
        }

        const trip = await prisma.trip.create({
            data: {
                destination,
                ends_at,
                starts_at
            }
        })

        return {
            tripId: trip.id
        }
    })
}