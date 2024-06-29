# price-tracker
## What's Today's Price?
What's Today's Price is a simple price-tracking web application created with JavaScript, React, NodeJS, Puppeteer, and mySQL. You add the link of the product you want to keep track of and Puppeteer will scrape the initial product data for you and then store it into a mySQL database. A cron job will then run daily to scrape each of the items you've added to your tracking list and update the prices according to its currently listed price on the website.

<p align="center">
    <img src="vite-project/src/assets/Demo.gif" alt="Demo of application" width="500"/>
</p>

## How it works:
- Add the link of the product to your SQL database to begin tracking the item.
- Have a cron job to run a scraping function which will check the websites for price changes and update the database. Scraping is currently set to once a day, but can be adjusted to occur more frequently. **Please be mindful of how often you scrape!**
- Search for specific products or remove them if you no longer want to track them.
- Filter items by lowest price, highest price, or newest.

**How to run locally on your computer**: Use `node app.js` in the default folder to run the server for the API and use `npm run dev` in the src folder to run the web application.

## What the application looks like:
![Screenshot of application](https://imgur.com/H1YmVof.jpg)
<p align="center">Add or search for a product to have it displayed on the page</p>

### Areas to Improve On
1. Method of isolating prices and images are very specific which means if a website does not follow the same naming convention and structure for their CSS elements, the data reflected may not always be accurate.
    a. Product images are typically nested within multiple divs making it harder to extract them/the right one. 
    b. Accurate pricing can be hard to pinpoint at times because the algorithm returns the first two pieces of text for a span class with 'price' in it to retrieve listed and sale prices, but not every product will have a discounted price and some websites tend to list other recommended products on the bottom of the page which gets their prices scraped instead.
2. Many websites work to prevent the scraping of their data, so sometimes you will encounter errors that prevent you from getting that information.