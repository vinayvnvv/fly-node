const moment = require("moment");

const getFyersSymbol = (symbol) => {
  let sym = "";
  if (symbol.instrument_type === "FUT") {
    sym = `${symbol.exchange}:${symbol.underlying_symbol}${moment(
      symbol.expiry
    ).format("YY")}${moment(symbol.expiry).format("MMM").toUpperCase()}FUT`;
  } else if (
    symbol.instrument_type === "CE" ||
    symbol.instrument_type === "PE"
  ) {
    if (symbol.weekly) {
      sym = `${symbol.exchange}:${symbol.underlying_symbol}${moment(
        symbol.expiry
      ).format("YY")}${moment(symbol.expiry).format("M")}${moment(
        symbol.expiry
      ).format("DD")}${symbol.strike_price}${symbol.instrument_type}`;
    } else {
      sym = `${symbol.exchange}:${symbol.underlying_symbol}${moment(
        symbol.expiry
      ).format("YY")}${moment(symbol.expiry).format("MMM").toUpperCase()}${
        symbol.strike_price
      }${symbol.instrument_type}`;
    }
  }
  return sym;
};

module.exports = { getFyersSymbol };
