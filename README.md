# Amazon Book Scraper

This is a simple Chrome extension that allows you to scrape book data from Amazon and add it to notion.

## Installation

1. Clone the repository
2. Run `npm install`
3. Add your Notion API token and database ID to the `.env` file like the `.env.example` file
4. Run `npm run build`
5. Load as an unpacked extension in Chrome

## Overview

- `content.js` is the main script which adds a button to the Amazon book page.
- `background.js` is the script which handles the interaction with the Notion API. This has to be done in the background because of CORS.
