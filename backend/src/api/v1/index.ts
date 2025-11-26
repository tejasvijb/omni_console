import express from "express";

import userRoutes from "./routes/userRoutes.js";

const apiV1Router = express.Router();

apiV1Router.use("/users", userRoutes);

export { apiV1Router };
