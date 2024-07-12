import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs"
import z from "zod";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";

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

        if (dayjs(starts_at).isAfter(ends_at)) {
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

        const mail = await getMailClient()

       const message = await mail.sendMail({
            from: {
                name: "Equipe plann.er",
                address: "equipe@planner.com"
            },
            to:  {
                name: owner_name,
                address: owner_email
            },
            subject: "Testando envio de e-mail",
            html: `<p>Teste do envio do e-mail</p>`
        })

        console.log(nodemailer.getTestMessageUrl(message))

        return {
            tripId: trip.id
        }
    })
}