import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import "dayjs/locale/pt-br"
import z from "zod";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import dayjs from "dayjs";

dayjs.locale("pt-br");

export async function CreateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
    async (request) => {
      const {
        destination,
        ends_at,
        starts_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;

      if (dayjs(starts_at).isAfter(ends_at)) {
        throw new Error("invalid trip start date");
      }

      if (dayjs(ends_at).isBefore(dayjs(starts_at))) {
        throw new Error("invalid trip end date");
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          ends_at,
          starts_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true,
                },
                ...emails_to_invite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const formattedStartsAt = dayjs(starts_at).format("LL");
      const formattedEndsAt = dayjs(ends_at).format("LL");
    
      const confirmationLink= `http://localhost:3333/trip/${trip.id}/confirm`;

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "equipe@planner.com",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: `confirme sua viagem para ${destination}`,
        html: `
      <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6; ">
    <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartsAt} a ${formattedEndsAt}</strong> .</p>
<p></p>
    <a href="${confirmationLink}">Para confirmar sua viagem, clique no link abaixo:</a>
<p></p>
    <p>Caso você não saiba do que se trata esse e-mail, apenas ignore.</p>
</div>
      
      `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return {
        tripId: trip.id,
      };
    }
  );
}
