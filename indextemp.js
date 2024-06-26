const http = require("https");
const fs = require("fs");
const zlib = require("zlib");
const express = require("express");
const moment = require("moment");
const cors = require("cors");
const getSymbols = require("./symbols");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/symbols", (req, responseRef) => {
  // const fileUrl =
  //   "https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz"; // URL of the gz file
  // const outputFile = "output.txt"; // Name of the output file

  // // Create a writable stream for the output file
  // const outputStream = fs.createWriteStream(outputFile);

  // // Make a GET request to download the gz file
  // const request = http.get(fileUrl, (response) => {
  //   // Check if response is successful
  //   if (response.statusCode !== 200) {
  //     console.error(
  //       "Failed to download the file. Status code:",
  //       response.statusCode
  //     );
  //     return;
  //   }

  //   // Pipe the response to zlib to unzip
  //   const gunzip = zlib.createGunzip();
  //   response
  //     .pipe(gunzip)
  //     .pipe(outputStream)
  //     .on("finish", () => {
  //       console.log("File unzipped successfully.");
  //       // Once unzipping is done, read the output file and print its content
  //       fs.readFile(outputFile, "utf8", (err, data) => {
  //         if (err) {
  //           console.error("Error reading output file:", err);
  //         } else {
  //           // console.log("Content of the unzipped file:");
  //           console.log(typeof data);
  //           const jsonData = JSON.parse(data);
  //           console.log(jsonData.length);
  //           const today = moment();
  //           // Get the date 10 days from today
  //           const next10Days = moment().add(8, "days");

  //           // Create a sample date to check
  //           // E
  //           let result = jsonData.filter((d) => {
  //             const sampleDate = moment(d.expiry);
  //             const expMatch = sampleDate.isBetween(
  //               today,
  //               next10Days,
  //               null,
  //               "[]"
  //             );
  //             const validNames = new Set([
  //               "BANKNIFTY",
  //               "NIFTY",
  //               "FINNIFTY",
  //               "Nifty 50",
  //               "Nifty Bank",
  //               "Nifty Fin Service",
  //             ]);
  //             //   const symbolMatch =
  //             //     /BANKNIFTY|NIFTY|FINNIFTY|Nifty 50|Nifty Bank|Nifty Fin Service/.test(
  //             //       d.name
  //             //     );
  //             const symbolMatch = validNames.has(d.name);
  //             return expMatch && symbolMatch;
  //           });
  //           responseRef.json(result);
  //         }
  //       });
  //     })
  //     .on("error", (err) => {
  //       console.error("Error writing to output file:", err);
  //     });
  // });

  // // Handle request error
  // request.on("error", (err) => {
  //   console.error("Error downloading the file:", err);
  // });
  getSymbols({}, (data) => {
    console.log("Symbols", data.length);
    responseRef.json(data);
  });
});

// getSymbols({}, (data) => {
//   console.log("Symbols", data.length);
// });

app.listen(process.env.PORT || 4000, () => {
  console.log("app started", process.env.PORT || 4000);
});
