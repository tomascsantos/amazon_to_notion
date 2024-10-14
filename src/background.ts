// background.ts

async function createNotionPage(
  book: Book,
  credentials: Credentials
): Promise<any> {
  console.log("Notion database ID:", credentials.database_id);
  const url = "https://api.notion.com/v1/pages";

  const payload = {
    parent: { database_id: credentials.database_id },
    icon: {
      type: "external",
      external: {
        url: book.image,
      },
    },
    cover: {
      type: "external",
      external: {
        url: book.image,
      },
    },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: book.title,
            },
          },
        ],
      },
      Author: {
        select: {
          name: book.author, // Ensure that `book.author` matches one of the select options in your Notion database
        },
      },
      "Full Title": {
        rich_text: [
          {
            text: {
              content: book.full_title,
            },
          },
        ],
      },
      Category: {
        select: {
          name: book.category,
        },
      },
      URL: {
        url: book.url,
      },
      "Reading Status": {
        select: {
          name: "To Read",
        },
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create Notion page.");
  }

  const data = await response.json();
  return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createNotionPage") {
    console.log("Creating Notion page with data:", message);

    // Extract book information
    const book: Book = {
      title: message.title,
      author: message.author,
      full_title: message.full_title,
      url: message.url,
      category: message.category,
      image: message.image,
    };
    const credentials = {
      token: message.token,
      database_id: message.database_id,
    };

    // Call the function to create a Notion page
    createNotionPage(book, credentials)
      .then((result) => {
        console.log("Notion page created successfully:", result);
        sendResponse({ success: true, data: result });
      })
      .catch((error) => {
        console.error("Error creating Notion page:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Indicate that the response will be sent asynchronously
    return true;
  }
});
