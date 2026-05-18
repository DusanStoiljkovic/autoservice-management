import express from "express";
import cors from "cors";
import routes from "./routes/routes";
// import { errorMiddleware } from "./middlewares/error.middleware";
// import { notFoundMiddleware } from "./middlewares/not-found.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);


// app.use(notFoundMiddleware);
// app.use(errorMiddleware);

export default app;