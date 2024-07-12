import fastify from 'fastify';
import { CreateTrip } from './routes/create-trip';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ConfirmeTrip } from './routes/confirme-trips';
import cors from "@fastify/cors"

const app = fastify();

app.register(cors, {
    origin: "*"
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(CreateTrip)
app.register(ConfirmeTrip)

app.listen({port: 3333}).then(() => {
    console.log("Server Running 🚀")
})