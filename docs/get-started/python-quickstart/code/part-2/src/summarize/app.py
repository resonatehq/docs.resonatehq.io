import random
import time

# @@@SNIPSTART quickstart-py-part-2-add-sleep
def downloadAndSummarize(ctx, url):
    print("Downloading and summarizing content from", url)
    # Download the content from the provided URL
    content = yield ctx.lfc(download, url)

    # highlight-start
    # Add a delay so you have time to simulate a failure
    time.sleep(10)
    #highlight-end

    # Summarize the downloaded content
    summary = yield ctx.lfc(summarize, content).with_options(promise_id="asdfsda")
    # Return the summary
    return summary
# @@@SNIPEND

def download(_, url):
    print(f"Downloading data from {url}")
    time.sleep(2.5)
    # Simulate a failure to download data 50% of the time
    if random.randint(0, 100) > 50:
        print("Download failed")
        raise Exception("Failed to download data")
    print("Download successful")
    return "This is the text of the page that was downloaded"
    
def summarize(_, content):
    print("Summarizing content...")
    time.sleep(2.5)
    if random.randint(0, 100) > 50:
        print("Summarization failed")
        raise Exception("Failed to summarize content")
    print("Summarization successful")
    return "This is the summary of the page that was downloaded"

