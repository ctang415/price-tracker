# price-tracker

A simple price-tracking application made for self-use created with JavaScript, React, NodeJS, Puppeteer, and mySQL. You add the link of the product you want to keep track of and puppeteer will scrape the initial data for you and then store it into a mySQL database. The scraper will then run daily on each of the items you've added to your tracking list and update the price according to its listed price on the website.

Areas to Improve On
1. Method of isolating price and images are very specific which means if a website does not follow the logic, the data is not always accurate.
2. Many websites work to prevent scraping so sometimes you will encounter errors if you add multiple products from the same website.