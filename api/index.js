const Fastify = require("fastify");
const getSymbolsData = require("./symbols");
const fastify = Fastify({
  logger: true,
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
