import { Resonate } from "@resonatehq/sdk";
import express, { Request, Response } from "express";
import { downloadAndSummarize } from "./app";

// @@@SNIPSTART quickstart-ts-part-2-server-url
// Initialize a Resonate application.
const resonate = new Resonate({ url: "http://localhost:8001" });
// @@@SNIPEND

// @@@SNIPSTART quickstart-ts-part-2-register-timeout
// Register a function as a Resonate function
resonate.register(
  "downloadAndSummarize", // function name
  downloadAndSummarize, // function pointer
  resonate.options({ timeout: 60000 }) // set a total execution timeout of 1 minute
);
// @@@SNIPEND

// Start the Resonate application
resonate.start();

// Initialize an Express application.
const app = express().use(express.json());

// Register a function as an Express endpoint
app.post("/summarize", async (req: Request, res: Response) => {
  const url = req.body?.url;
  try {
    // Call the resonate function
    let summary = await resonate.run(
      "downloadAndSummarize", // function name
      `summarize-${url}`, // unique identifier of the promise
      url // function argument
    );
    res.send(summary);
  } catch (e) {
    res.status(500).send("An error occurred.");
  }
});

// Start the Express application
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
