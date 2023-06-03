const puppeteer = require("puppeteer");
async function start() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://kahoot.it/");
    //await browser.close();
  };

  start();