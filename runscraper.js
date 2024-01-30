var cron = require('node-cron');

cron.schedule('31 13 * * *', async function runScrape() {
  try {
    const response = await fetch (`http://localhost:3000/products`, {
      method: 'PUT', headers: {'Content-type': 'application/json'}, credentials: 'include'
    });
    
  } catch (err) {
    console.log(err);
  }
}, {
  timezone: 'America/New_York'
});
