const Fastify = require("fastify");
const cors = require("@fastify/cors");
const getSymbolsData = require("./symbols");
const fastify = Fastify({
  logger: true,
});
fastify.register(cors, {
  // put your options here
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
  const res = await getSymbolsData();
  return res;
});

// Run the server!
async function runServer() {
  try {
    await fastify.listen({ port: process.env.PORT || 4000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

runServer();
