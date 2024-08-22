import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//import routes
import appRouter from "./routes/event.routes.js";

//routes declaration
app.use("/api/v3/app",appRouter);

export { app };