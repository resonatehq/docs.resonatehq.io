// @@@SNIPSTART quickstart-ts-part-1-app
import { Context } from "@resonatehq/sdk";

// downloadAndSummarize is the top level function that awaits on the download and summarize functions.
export async function downloadAndSummarize(ctx: Context, url: string) {
  // Download the content from the provided URL
  console.log("Downloading and summarizing content from", url);
  let content = await ctx.run(download, url);

  // Summarize the downloaded content
  let summary = await ctx.run(summarize, content);

  // Return the summary of the content
  return summary;
}

// download simulates downloading a page from the internet.
// This function has a 50% chance of failing.
async function download(ctx: Context, url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 50% chance to fail
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

// summarize simulates summarizing the downloaded content
// This function has a 50% chance of failing.
async function summarize(ctx: Context, text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 50% chance to fail
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
// @@@SNIPEND
