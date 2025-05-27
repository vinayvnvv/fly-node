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

fastify.get("/test", async function handler(request, reply) {
  const res = await new Promise((r) => {
    let i = 0;
    setInterval(() => {
      i++;
      console.log(i);
      if (i === 50) r();
    }, 1000);
  });
  return res;
});

fastify.get("/instruments/:exchange", async function handler(request, reply) {
  const axios = require("axios");
  const exchange = request.params.exchange;
  const fileUrl = `https://assets.upstox.com/market-quote/instruments/exchange/${exchange}.json.gz`;

  try {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    reply.type("application/gzip").send(response.data);
  } catch (error) {
    reply.status(500).send({ error: "Failed to download file" });
  }
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
