const puppeteer = require("puppeteer");

const code = "3363532";
const playerArray = [];
const AmountOfBots = 1;
const Name = "blah";

for (var index = 0; index != AmountOfBots; index++) {
  playerArray.push(Name + index);
}

console.log(playerArray);

async function start(PIN, NAME) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://kahoot.it/");
  //type code
  try {
    await page.waitForSelector("#game-input");
    console.log("Found Game input");
    await page.type("#game-input", PIN);
    console.log("Code Typed");
  } catch (error) {
    console.log(error);
    console.log("failed");
  }
  // clicking
  try {
    await page.click("button");
    console.log("Clicked");
  } catch (error) {
    console.log("failed");
    console.log(error);
  }

  try {
    await page.waitForSelector("form");
    await page.type("input", NAME);
    console.log("Nickname Typed " + NAME);
  } catch (error) {
    console.log(error);
  }
  try {
    await page.click("button");
    console.log("Clicked");
  } catch (error) {
    console.log("failed");
    console.log(error);
  }

  /*
  await page.goto("");
  await page.waitForSelector("");
*/

  //await browser.close();
}

for (var index = 0; index != AmountOfBots; index++) {
  let tempPlayerName = "";
  tempPlayerName = playerArray[index];
  console.log(tempPlayerName);
  start(code, tempPlayerName);
}
