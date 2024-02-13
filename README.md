# price-tracker

A simple price-tracking web application made for self-use created with JavaScript, React, NodeJS, Puppeteer, and mySQL. You add the link of the product you want to keep track of and Puppeteer will scrape the initial product data for you and then store it into a mySQL database. A cron job will then run daily to scrape each of the items you've added to your tracking list and update the prices according to its currently listed price on the website.

Areas to Improve On
1. Method of isolating prices and images are very specific which means if a website does not follow the same naming convention and structure for their CSS elements, the data reflected may not always be accurate.
    a. Product images are typically nested within multiple divs making it harder to extract them/the right one. 
    b. Accurate pricing can be hard to pinpoint at times because the algorithm returns the first two pieces of text for a span class with 'price' in it to retrieve listed and sale prices, but not every product will have a discounted price and some websites tend to list other recommended products on the bottom of the page which gets their prices scraped instead.
2. Many websites work to prevent the scraping of their data, so sometimes you will encounter errors that prevent you from getting that information.