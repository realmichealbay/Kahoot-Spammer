const puppeteer = require("puppeteer");

const code = "1545894";
const playerArray = [];
const AmountOfBots = 10;
const Name = "sebass";


if (Name.length >= 12) {
  console.error("Name has to be lower than 12");
  throw error;
} else {
  console.log("Valid Names")
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (var index = 0; index != AmountOfBots; index++) {
  playerArray.push(Name + index);
}

async function start(PIN, NAME) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const nickname = NAME;

  await page.goto("https://kahoot.it/");
  //type code
  try {
    await page.waitForSelector("#game-input");
    await page.type("#game-input", PIN);
  } catch (error) {
    console.log(error);
    console.log("failed");
  }
  // clicking
  try {
    await page.waitForSelector("button");
    await page.click("button");
  } catch (error) {
    console.log("failed");
    console.log(error);
  }
  // 2nd page

  try {
    console.log(nickname);
    await page.waitForNavigation();
    await page.click("#nickname");
    await page.type("#nickname", nickname);
    console.log("Nickname Typed " + NAME);
  } catch (error) {
    console.log(error);
  }
  // clicking
  try {
    await page.click("button");
  } catch (error) {
    console.log("failed");
    console.log(error);
  }
  console.log("Complete");

  await page.waitForNavigation();
  //await browser.close();
}

for (var index = 0; index != AmountOfBots; index++) {
  let tempPlayerName = "";
  tempPlayerName = playerArray[index];
  start(code, tempPlayerName);
  wait(2000);
}
