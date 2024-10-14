// content.ts

interface Book {
  author: string;
  full_title: string;
  title: string;
  url: string;
  category: string;
  image: string;
}

interface Credentials {
  token: string;
  database_id: string;
}

// Function to log the book information and send it to the background script
function logBookInfo(): void {
  const full_title: string =
    document.querySelector<HTMLElement>("#productTitle")?.innerText.trim() ||
    "Title not found";
  const author: string =
    document.querySelector<HTMLElement>(".author a")?.innerText.trim() ||
    "Author not found";
  const image: string =
    document.querySelector<HTMLImageElement>("#landingImage")?.src ||
    "Image not found";

  const book: Book = {
    title: full_title.split(":")[0].trim(),
    author,
    url: window.location.href,
    category: "Book",
    full_title: full_title,
    image: image,
  };

  console.log("Sending message to background script:", book);

  const credentials: Credentials = {
    token: process.env.NOTION_TOKEN as string,
    database_id: process.env.LIBRARY_DATABASE_ID as string,
  };

  chrome.runtime.sendMessage(
    {
      action: "createNotionPage",
      ...book,
      ...credentials,
    },
    (response: { success: boolean; data?: any; error?: any }) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError);
        return;
      }

      if (response && response.success) {
        console.log("Notion page created successfully:", response.data);
        alert("Book added to Notion!");
      } else if (response && !response.success) {
        console.error("Failed to create Notion page:", response.error);
      } else {
        console.error("Unexpected response:", response);
      }
    }
  );
}

// Create a new button element
const button: HTMLButtonElement = document.createElement("button");
button.innerText = "Add to Notion";

// Style the button to make it shorter and rounded
button.style.padding = "6px 12px"; // Reduced padding for a shorter height and width
button.style.backgroundColor = "#ff9900";
button.style.color = "#fff";
button.style.border = "none";
button.style.cursor = "pointer";
button.style.fontSize = "14px";
button.style.marginTop = "10px";
button.style.borderRadius = "8px"; // Rounded corners

// Optional: Add a subtle box-shadow for better aesthetics
button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";

// Optional: Add a hover effect to enhance interactivity
button.addEventListener("mouseenter", () => {
  button.style.backgroundColor = "#e68a00"; // Darker shade on hover
});
button.addEventListener("mouseleave", () => {
  button.style.backgroundColor = "#ff9900"; // Original color when not hovered
});
// Find the element with id="breadcrumb-back-link"
const breadcrumbElement: HTMLElement | null = document.getElementById(
  "wayfinding-breadcrumbs_container"
);

const author = document.querySelector<HTMLElement>(".author a");
// Insert the button right after the breadcrumb-back-link element
if (breadcrumbElement && breadcrumbElement.parentNode && author) {
  breadcrumbElement.insertAdjacentElement("afterend", button);
} else {
  console.warn('Element with id "wayfinding-breadcrumbs_container" not found.');
}

// Attach a click event listener to the button
button.addEventListener("click", logBookInfo);
