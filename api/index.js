const Fastify = require("fastify");
const cors = require("@fastify/cors");
const fastifyStatic = require("@fastify/static");
const path = require("path");
const getSymbolsData = require("./symbols");
const getMcxSymbolsData = require("./mcxSymbols");
const {
  getMarketDataByDate,
  getUpstoxT,
  saveUpstoxT,
} = require("../config/firebase");
const { getCandles } = require("./candles");
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

fastify.get("/eq-index", async function handler(request, reply) {
  const res = await getSymbolsData(true);
  if (res && res.length > 0) {
    return res.filter(
      (item) =>
        item.segment === "NSE_EQ" ||
        item.segment === "NSE_INDEX" ||
        item.segment === "BSE_INDEX"
    );
  } else {
    return [];
  }
});

fastify.get("/mcx", async function handler(request, reply) {
  const res = await getMcxSymbolsData();
  return res;
});

fastify.get("/all", async function handler(request, reply) {
  const res = await getSymbolsData(true);
  return res;
});

function main() {
  let i = 0;
  setInterval(() => {
    i++;
    console.log(i);
    if (i === 50) r();
  }, 1000);
}

fastify.get("/test", async function handler(request, reply) {
  main();
  return "success";
});

fastify.get("/pre-market/:id", async function handler(request, reply) {
  const id = request.params.id;
  const res = await getMarketDataByDate(id);
  if (res) reply.send(res);
  else reply.status(404).send({ message: "No Document found" });
});

fastify.get(
  "/candles/:instrumentKey/:interval/:from/:limit",
  async function handler(request, reply) {
    const { instrumentKey, interval, from, limit } = request.params;
    const res = await getCandles(instrumentKey, interval, from, limit);
    if (res) reply.send(res);
    else reply.status(404).send({ message: "No Document found" });
  }
);

fastify.get("/upstoxT", async function handler(request, reply) {
  const res = await getUpstoxT();
  if (res) reply.send(res);
  else reply.status(404).send({ message: "No Document found" });
});

fastify.post("/upstoxT", async function handler(request, reply) {
  const payload = request.body;
  const res = await saveUpstoxT(payload);
  if (res) reply.send(res);
  else reply.status(404).send({ message: "No Document found" });
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
