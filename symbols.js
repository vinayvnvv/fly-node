const http = require("https");
const fs = require("fs");
const zlib = require("zlib");
const moment = require("moment");
const fetchSymbols = (
  fileUrl,
  finish,
  symbolsData,
  filterNamesSet,
  responseRef
) => {
  // URL of the gz file
  const outputFile = "output.txt"; // Name of the output file

  // Create a writable stream for the output file
  const outputStream = fs.createWriteStream(outputFile);

  // Make a GET request to download the gz file
  const request = http.get(fileUrl, (response) => {
    // Check if response is successful
    if (response.statusCode !== 200) {
      console.error(
        "Failed to download the file. Status code:",
        response.statusCode
      );
      return;
    }

    // Pipe the response to zlib to unzip
    const gunzip = zlib.createGunzip();
    response
      .pipe(gunzip)
      .pipe(outputStream)
      .on("finish", () => {
        console.log("File unzipped successfully.");
        // Once unzipping is done, read the output file and print its content
        fs.readFile(outputFile, "utf8", (err, data) => {
          if (err) {
            console.error("Error reading output file:", err);
          } else {
            // console.log("Content of the unzipped file:");
            console.log(typeof data);
            const jsonData = JSON.parse(data);
            console.log(jsonData.length);
            const today = moment();
            // Get the date 10 days from today
            const next10Days = moment().add(8, "days");

            // Create a sample date to check
            // E
            let result = jsonData.filter((d) => {
              const sampleDate = moment(d.expiry);
              const expMatch = sampleDate.isBetween(
                today,
                next10Days,
                null,
                "[]"
              );
              const validNames = new Set(filterNamesSet);
              //   const symbolMatch =
              //     /BANKNIFTY|NIFTY|FINNIFTY|Nifty 50|Nifty Bank|Nifty Fin Service/.test(
              //       d.name
              //     );
              const symbolMatch = validNames.has(d.name);
              const assetSymbol = finish ? d.asset_type === "INDEX" : true;
              return expMatch && symbolMatch && assetSymbol;
            });
            if (finish) {
              responseRef([...result, ...symbolsData]);
              // responseRef.json(result);
              return;
            } else {
              fetchSymbols(
                "https://assets.upstox.com/market-quote/instruments/exchange/BSE.json.gz",
                true,
                result,
                ["SENSEX"],
                responseRef
              );
            }
          }
        });
      })
      .on("error", (err) => {
        console.error("Error writing to output file:", err);
      });
  });
  request.on("error", (err) => {
    responseRef([...symbolsData]);
  });
};

const getSymbols = (req, responseRef) => {
  const fileUrl =
    "https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz";
  const filterNamesSet = [
    "BANKNIFTY",
    "NIFTY",
    "FINNIFTY",
    "Nifty 50",
    "Nifty Bank",
    "Nifty Fin Service",
  ];
  fetchSymbols(fileUrl, false, [], filterNamesSet, responseRef);
};

const getSymbolsData = () => {
  return new Promise((resolve, reject) => {
    getSymbols({}, (data) => {
      resolve(data);
    });
  });
};

module.exports = getSymbolsData;
