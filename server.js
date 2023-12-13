import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from "./db/database.js";
import ErrorHandler from "./utils/errorHandler.js";

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down tje server for hanling uncaught exception`);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "config/.env" });
}
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http:://localhost:${process.env.PORT}!`);
});

app.use(ErrorHandler);

process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`Shutting down the server for unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
