import { APIServer } from "./src/APIServer.ts";
const server = new APIServer({hostname: "localhost", port: 8080});
server.startServer();