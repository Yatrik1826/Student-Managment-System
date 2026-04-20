const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require("./app");
const connectDB = require("./config/db");
const { port } = require("./config/env");

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
