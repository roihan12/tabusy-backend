import app from "./app.js";
import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down tje server for hanling uncaught exception`);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "config/.env" });
}


const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http:://localhost:${process.env.PORT}!`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`Shutting down the server for unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
