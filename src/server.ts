import fastify from 'fastify';
import { CreateTrip } from './routes/create-trip';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import cors from "@fastify/cors"
import { ConfirmParticipant } from './routes/confirm-participant';
import { ConfirmTrip } from './routes/confirm-trips';

const app = fastify();

app.register(cors, {
    origin: "*"
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(CreateTrip)
app.register(ConfirmTrip)
app.register(ConfirmParticipant)

app.listen({port: 3333}).then(() => {
    console.log("Server Running 🚀")
})