const commander = require("commander");
const axios = require("axios");

commander
  .option("-c, --concurrency <n>", "Number of parallel requests", parseInt)
  .option("-n, --requests <n>", "Number of requests to perform", parseInt)
  .option("-b, --body", "Send a random generated body with request")
  .arguments("<url>")
  .action(async (url) => {
    const start = Date.now();
    const { concurrency, requests, body } = commander.opts();
    const promises = [];
    let successful = 0;
    let failed = 0;
    for (let i = 1; i <= requests; i++) {
      promises.push(
        new Promise(async (resolve) => {
          try {
            const bodyData = body
              ? Math.random().toString(36).substring(2)
              : "";
            const response = await axios({
              url,
              method: "POST",
              data: bodyData,
            });
            console.log(`${i} ${Date.now() - start}`);
            successful++;
          } catch (error) {
            console.error(error.message);
            failed++;
          }
          resolve();
        })
      );
      if (i % concurrency === 0) {
        await Promise.all(promises);
        promises.length = 0;
      }
    }
    await Promise.all(promises);
    console.log(`\nBombarded ${requests} times`);
    console.log(`${successful} successful, ${failed} failing`);
    console.log(
      `Average response time ${Math.round((Date.now() - start) / requests)}ms`
    );
  });

commander.parse(process.argv);
