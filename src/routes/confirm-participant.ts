import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";

export async function ConfirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm/:participantId",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
          participantId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId, participantId } = request.params;

      const participant = await prisma.participant.findUnique({
        where: {
            
        }
      })

      return reply.redirect(`http://localhost:3000/trips/${tripId}`);
    }
  );
}
