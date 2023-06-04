const puppeteer = require("puppeteer");

const code = "4672173";
const playerArray = [];
const AmountOfBots = 1;
const Name = "bittleyou";
const Guessing = true;
const TwoFA = true;

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
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--window-size=500,500"],
  });
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
    try {
      await page.waitForSelector(
        'div[data-functional-selector="notification-bar-error"]',
        { timeout: 3000 }
      );

      const errorMessage = await page.$eval(
        'div[data-functional-selector="notification-bar-text"]',
        (el) => el.textContent
      );

      if (errorMessage === "Sorry, that nickname is taken.") {
        console.log("Nickname is already taken.");
      } else {
        console.log("An error occurred: " + errorMessage);
      }
    } catch (error) {
      console.log(error);
    }

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
    var currentQuestion = 0;
    var totalQuestions = 1;

    while (currentQuestion != totalQuestions) {
      await page.waitForSelector("button", { timeout: 0 });

      var [currentQuestion, totalQuestions] = await get_question_number(page);

      //gets amount of answers there are
      var answerButtons = await page.$$(
        '[data-functional-selector^="answer-"]'
      );
      let answer = Math.floor(Math.random() * answerButtons.length);
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
    }
  }

  await page.waitForNavigation();
  await page.waitForNavigation();
  let current_ulr = page.url();
  console.log(current_ulr);
  if (current_ulr == "https://kahoot.it/ranking") {
    await browser.close();
  }
}
async function get_question_number(page) {
  //gets the number of questions
  var questionCounterText = await page.$eval(
    'div[data-functional-selector="question-index-counter"]',
    (el) => el.textContent
  );

  var parts = questionCounterText.split(" of ");
  var currentQuestion = parseInt(parts[0].trim(), 10);
  var totalQuestions = parseInt(parts[1].trim(), 10);

  // Return an array with two elements
  return [currentQuestion, totalQuestions];
}
for (var index = 0; index != AmountOfBots; index++) {
  let tempPlayerName = "";
  tempPlayerName = playerArray[index];
  start(code, tempPlayerName, Guessing);
  wait(2000);
}
