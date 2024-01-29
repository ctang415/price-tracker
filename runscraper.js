const { CronJob } = require('cron');

const testJob = new CronJob(
    '30 10 * * * ', // cronTime
    async function runScrape () {
        try {
          const response = await fetch (`http://localhost:3000/products`, {
            method: 'PUT', headers: {'Content-type': 'application/json'}
          });
          if (!response.ok) {
            throw await response.json();
          }
          const data = await response.json();
          if (response.status === 200) {
            console.log(data);
          }
        } catch (err) {
          console.log(err);
        }
      }, // onTick
    null, // onComplete
    true, // start
    'America/New_York' // timeZone
);
