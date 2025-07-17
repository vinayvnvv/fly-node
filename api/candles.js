const { default: axios } = require("axios");

const getCandles = async (instrumentKey, interval, from, limit) => {
  const url = `https://service.upstox.com/chart/open/v3/candles?instrumentKey=${instrumentKey}&interval=${interval}&from=${from}&limit=${limit}`;
  const response = await axios.get(url);
  const data = response.data;
  return data;
};

module.exports = { getCandles };
