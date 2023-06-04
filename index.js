const puppeteer = require("puppeteer");

const code = "1624028";
const playerArray = [];
const AmountOfBots = 1;
const Name = "amongthiuss";
const Guessing = true;

if (Name.length >= 13) {
  throw new error("Name has to be lower than 12");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (var index = 0; index != AmountOfBots; index++) {
  playerArray.push(Name + index);
}

async function start(PIN, NAME, GUESS) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const nickname = NAME;

  await page.goto("https://kahoot.it/");
  //type code
  try {
    await page.waitForSelector("#game-input");
    await page.type("#game-input", PIN);
  } catch (error) {
    console.log(error);
    console.error("failed");
  }
  // clicking
  try {
    await page.waitForSelector("button");
    await page.click("button");
  } catch (error) {
    console.error("failed");
    console.log(error);
  }
  // 2nd page

  try {
    await page.waitForNavigation();
    await page.click("#nickname");
    await page.type("#nickname", nickname);
    console.debug("Nickname Typed " + NAME);
  } catch (error) {
    console.log(error);
  }
  // clicking
  try {
    await page.click("button");
  } catch (error) {
    console.error("failed");
    console.log(error);
  }

  await page.waitForNavigation();

  if (GUESS == true) {
    await page.waitForNavigation();
    //gets the number of questions
    var questionCounterText = await page.$eval(
      'div[data-functional-selector="question-index-counter"]',
      (el) => el.textContent
    );
    var parts = questionCounterText.split(" of ");
    var currentQuestion = parseInt(parts[0].trim(), 10);
    var totalQuestions = parseInt(parts[1].trim(), 10);

    while (currentQuestion != totalQuestions) {
      var questionCounterText = await page.$eval(
        'div[data-functional-selector="question-index-counter"]',
        (el) => el.textContent
      );
      var parts = questionCounterText.split(" of ");
      var currentQuestion = parseInt(parts[0].trim(), 10);
      var totalQuestions = parseInt(parts[1].trim(), 10);

      await page.waitForSelector("button", { timeout: 0 });
      //gets amount of answers there are
      var answerButtons = await page.$$(
        '[data-functional-selector^="answer-"]'
      );

      let totalAnswers = answerButtons.length;

      let answer = Math.floor(Math.random() * totalAnswers);
      console.log(nickname + "s guess is " + answer);

      if (answer == 0) {
        await page.click('button[data-functional-selector="answer-0"]');
      } else if (answer == 1) {
        await page.click('button[data-functional-selector="answer-1"]');
      } else if (answer == 2) {
        await page.click('button[data-functional-selector="answer-2"]');
      } else if (answer == 3) {
        await page.click('button[data-functional-selector="answer-3"]');
      }
      console.log(currentQuestion, totalQuestions);
    }
  }

  let current_ulr = page.url();
  if (current_ulr == "https://kahoot.it/ranking") {
    await browser.close();
  }
}

for (var index = 0; index != AmountOfBots; index++) {
  let tempPlayerName = "";
  tempPlayerName = playerArray[index];
  start(code, tempPlayerName, Guessing);
  wait(2000);
}
