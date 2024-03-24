const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;

const { GoogleAuth } = require("google-auth-library");

const API_KEY = process.env.API_KEY;

// console.log(API_KEY);

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log("Server running on port : " + PORT));

// app.get('/chatbot', (req, res) => {
//     client.generateText({
//         model: 'models/text-bison-001',
//         temperature: 0.7,
//         candidateCount: 1,
//         top_k: 40,
//         top_p: 0.95,
//         max_output_tokens: 1024,

//         stop_sequences: [],
//         prompt: {
//             text: "capital of delhi",
//         },
//     }).then(result => {
//         result.forEach(function(d1) {
//             if (d1 != null) {
//                 d1.candidates.forEach(function(d2) {
//                     res.send(d2.output);
//                 })
//             }
//         })
//     });
// })

app.post("/chatbot", async (req, res) => {
  try {
    const { text } = req.body;

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

        // res.json(modifiedResponses); // Send the modified responses as JSON
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
});

// Testing again
// Testing again