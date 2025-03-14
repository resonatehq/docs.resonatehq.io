import { Context } from "@resonatehq/sdk";

// @@@SNIPSTART quickstart-ts-part-2-add-sleep
export async function downloadAndSummarize(ctx: Context, url: string) {
  console.log("Downloading and summarizing content from", url);

  // Download the content from the provided URL
  let content = await ctx.run(download, url);

  // Sleep for 10 seconds
  await ctx.sleep(10000);

  // Summarize the downloaded content
  let summary = await ctx.run(summarize, content);

  // Return the summary of the content
  return summary;
}
// @@@SNIPEND

async function download(ctx: Context, url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Timeout simulates time it takes to download
    setTimeout(() => {
      // 50% chance of failure
      if (Math.random() < 0.5) {
        console.log("download failed");
        reject("download failed");
      } else {
        console.log("download successful");
        resolve("This is the text of the page");
      }
    }, 2500);
  });
}

async function summarize(ctx: Context, text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Timeout simulates time it takes to summarize
    setTimeout(() => {
      // 50% chance of failure
      if (Math.random() < 0.5) {
        console.log("summarization failed");
        reject("summarization failed");
      } else {
        console.log("summarization successful");
        resolve("This is a summary of the text");
      }
    }, 2500);
  });
}
