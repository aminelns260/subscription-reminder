import express from "express";

import { PORT } from "./config/env.js";

import connectToDatabase from "./database/mongodb.js"

import userRouter from "./routes/user.routes.js"
import authRouter from "./routes/auth.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"

import errorMiddleware from './middlewares/error.middleware.js'
import arcjetMiddleware from './middlewares/arcjet.middleware.js'

import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(arcjetMiddleware)


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware)

app.listen(PORT, async () => {
    console.log(`The App is running on port ${PORT}`);

    await connectToDatabase();
})