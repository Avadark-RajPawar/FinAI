const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const https = require("https"); // Import the 'https' module
const fs = require("fs"); // Import the 'fs' module

require("dotenv").config();

const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");
const API_KEY = process.env.API_KEY;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
// console.log(FINNHUB_API_KEY);

// Importing Finnhub library
const finnhub = require("finnhub");

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log("Server running on port : " + PORT));

// Configure HTTPS options to bypass self-signed certificate error
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

app.post("/chatbot", async (req, res) => {
  try {
    const { text } = req.body;

    // Check if the user's query is related to fetching stock prices
    if (text.toLowerCase().includes("price of")) {
      const stockName = text.split("price of")[1].trim(); // Extract the stock name from the query
      // console.log(`${stockName}`);

      // Function to get the price of a stock symbol
      function getSymbolPrice(stockName) {
        return new Promise((resolve, reject) => {
          try {
            // Retrieve the API key authentication object from the Finnhub API client
            const api_key =
              finnhub.ApiClient.instance.authentications["api_key"];

            // Set the API key from the environment variable
            api_key.apiKey = process.env.FINNHUB_API_KEY;

            // Create a new instance of the Finnhub client
            const finnhubClient = new finnhub.DefaultApi();

            // Fetch the quote for the given symbol and handle the response
            finnhubClient.quote(stockName, (err, data, response) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      }

      // Fetch the stock price from Finnhub API
      getSymbolPrice(stockName)
        .then((data) => {
          const stockPrice = data.c; // Extract the stock price from the response
          // Respond to the user with the stock price
          res.json([
            {
              role: "assistant",
              content: `The current price of ${stockName} is ${stockPrice}`,
            },
          ]);
        })
        .catch((error) => {
          console.error(error);
          res
            .status(500)
            .send({ error: "An error occurred while fetching stock price" });
        });
    } else {
      // If the user's query is not related to fetching stock prices, proceed with generating text using Bard API
      client
        .generateText({
          model: "models/text-bison-001",
          temperature: 0.7,
          candidateCount: 1,
          top_k: 40,
          top_p: 0.95,
          max_output_tokens: 1024,
          stop_sequences: [],
          prompt: {
            text: text,
          },
        })
        .then((result) => {
          const responses = result.map((d1) => {
            if (d1 != null) {
              return d1.candidates.map((d2) => d2.output);
            }
            return null; // Handle null or undefined responses
          });

          // Filter out null or undefined responses and add the 'role' and 'content' fields
          const modifiedResponses = responses
            .filter((response) => response !== null && response !== undefined)
            .map((response) => ({
              role: "assistant",
              content: response[0], // Extract the response data and set it as the content
            }));

          console.log("Response data:", modifiedResponses);
          res.json(modifiedResponses); // Send the modified responses as JSON
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send({ error: "An error occurred" });
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
});
