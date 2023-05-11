import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import "./loadEnv.js";

if (!!process.env.error) {
  console.log(process.env.error);
  process.exit(1);
}

import app from "./index.js";
const server = createServer(app);

const host = "127.0.0.1";
const port = process.env.PORT || 5050;

server.listen(port, host, () => {
  console.log(`[🔥] App is listening on ${host}:${port}...`);
});
