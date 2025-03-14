// @@@SNIPSTART quickstart-ts-part-1-gateway
import express, { Request, Response } from "express";
import { Resonate, Context } from "@resonatehq/sdk";
import { downloadAndSummarize } from "./app";

// Initialize a Resonate application.
const resonate = new Resonate();

// Register a function as a Resonate function
resonate.register(
  "downloadAndSummarize", // function name
  downloadAndSummarize, // function pointer
  resonate.options({ timeout: 20000 }) // set a total execution timeout of 20 seconds
);

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
      `summarize-${url}`, // promise ID
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
// @@@SNIPEND
