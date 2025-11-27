import express from "express";

import permissionRoutes from "./routes/permissionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const apiV1Router = express.Router();

apiV1Router.use("/users", userRoutes);
apiV1Router.use("/permissions", permissionRoutes);

export { apiV1Router };
