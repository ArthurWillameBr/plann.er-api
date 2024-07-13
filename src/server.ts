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
import { UpdateTrip } from './routes/update-trip';
import { GetTripDetails } from './routes/get-trip-details';
import { errorHandler } from './error-handler';

const app = fastify();

app.register(cors, {
    origin: "*"
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(CreateTrip)
app.register(ConfirmTrip)
app.register(ConfirmParticipant)
app.register(CreateActivity)
app.register(GetActivities)
app.register(CreateLinks)
app.register(GetParticipants)
app.register(createInvite)
app.register(getLinks)
app.register(UpdateTrip)
app.register(GetTripDetails)

app.listen({port: 3333}).then(() => {
    console.log("Server Running 🚀")
})