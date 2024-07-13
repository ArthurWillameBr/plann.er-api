import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { ClientError } from "../errors/client-error";
import { env } from "process";

export async function ConfirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          participants: {
            where: {
              is_owner: false,
            },
          },
        },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      if (trip.is_confirmed) {
        return reply.redirect(`${env.API_BASE_URL}/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      });

      const formattedStartsAt = dayjs(trip.starts_at).format("LL");
      const formattedEndsAt = dayjs(trip.ends_at).format("LL");

      const mail = await getMailClient();

      await Promise.all(
        trip.participants.map(async (participant) => {
          const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

          const message = await mail.sendMail({
            from: {
              name: "Equipe plann.er",
              address: "equipe@planner.com",
            },
            to: participant.email,
            subject: `confirme sua presença para ${trip.destination} em ${formattedStartsAt}`,
            html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6; ">
          <p>Você foi convidado para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartsAt} a ${formattedEndsAt}</strong> .</p>
      <p></p>
          <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
         <a href="${confirmationLink}">Confirmar presença</a>
      <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore.</p>
      </div>
            
            `.trim(),
          });

          console.log(nodemailer.getTestMessageUrl(message));
        })
      );

      return reply.redirect(`${env.API_BASE_URL}/trips/${tripId}`);
    }
  );
}
