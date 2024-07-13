import fastify from 'fastify';
import { CreateTrip } from './routes/create-trip';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import cors from "@fastify/cors"
import { ConfirmParticipant } from './routes/confirm-participant';
import { ConfirmTrip } from './routes/confirm-trips';
import { CreateActivity } from './routes/create-activity';
import { GetActivities } from './routes/get-activities';
import { CreateLinks } from './routes/create-link';
import { GetParticipants } from './routes/get-participants';
import { createInvite } from './routes/create-invite';
import { getLinks } from './routes/get-links';

const app = fastify();

app.register(cors, {
    origin: "*"
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(CreateTrip)
app.register(ConfirmTrip)
app.register(ConfirmParticipant)
app.register(CreateActivity)
app.register(GetActivities)
app.register(CreateLinks)
app.register(GetParticipants)
app.register(createInvite)
app.register(getLinks)

app.listen({port: 3333}).then(() => {
    console.log("Server Running 🚀")
})