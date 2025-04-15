const Fastify = require("fastify");
const cors = require("@fastify/cors");
const fastifyStatic = require("@fastify/static");
const path = require("path");
const getSymbolsData = require("./symbols");
const fastify = Fastify({
  logger: true,
});
fastify.register(cors, {
  // put your options here
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "./../static"),
  prefix: "/static/", // optional: default '/'
  //constraints: { host: "example.com" }, // optional: default {}
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
  const res = await getSymbolsData();
  return res;
});

fastify.get("/all", async function handler(request, reply) {
  const res = await getSymbolsData(true);
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
