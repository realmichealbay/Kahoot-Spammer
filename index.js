const puppeteer = require("puppeteer");

const code = "4672173";
const playerArray = [];
const AmountOfBots = 5;
const Name = "joeshst";
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

function createCheckURL(page, browser) {
  return async function checkURL() {
    let current_url = page.url();
    console.debug(page.url());
    if (current_url === "https://kahoot.it/ranking") {
      await browser.close();
    }
  };
}

async function start(PIN, NAME, GUESS) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--window-size=500,500"],
  });
  const page = await browser.newPage();
  setInterval(createCheckURL(page, browser), 1000);
  await page.goto("https://kahoot.it/");
  //type code
  try {
    await page.waitForSelector("#game-input");
    const gameInput = await page.$("#game-input");
    if(gameInput){
      await gameInput.type(PIN);
    }
  } catch (error) {
    console.error("failed");
    console.log(error);
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
    await page.type("#nickname", NAME);
    try {
      try {
        await page.click("button");
      } catch (error) {
        console.error("failed");
        console.log(error);
      }
      await page.waitForSelector(
        'div[data-functional-selector="notification-bar-error"]',
        { timeout: 5000 }
      );

      const errorMessage = await page.$eval(
        'div[data-functional-selector="notification-bar-text"]',
        (el) => el.textContent
      );

      if (errorMessage === "Sorry, that nickname is taken.") {
        await page.$eval("#nickname", (el) => (el.value = ""));
        let alt_Nickname = NAME + "-";
        await page.type("#nickname", alt_Nickname);
        console.debug("Nickname Typed " + alt_Nickname);
        try {
          await page.click("button");
        } catch (error) {
          console.error("failed");
          console.log(error);
        }
      } else {
        console.log("An error occurred: " + errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
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
  console.debug("Nickname Typed " + NAME);
  await page.waitForNavigation({ timeout: 0 });

  if (GUESS == true) {
    await page.waitForNavigation();
    var currentQuestion = 0;
    var totalQuestions = 1;
    while (currentQuestion != totalQuestions) {
      const button = await page.$("button");
      if (button) {
        var [currentQuestion, totalQuestions] = await get_question_number(page);
        var answerButtons = await page.$$(
          '[data-functional-selector^="answer-"]'
        );
        let answer = Math.floor(Math.random() * answerButtons.length);
        console.log(NAME + "s guess is " + answer);

        const answerButton = await page.$(
          `button[data-functional-selector="answer-${answer}"]`
        );
        if (answerButton) {
          await answerButton.click();
        }
      }
    }
  }

  /*
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
      console.log(NAME + "s guess is " + answer);

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
  }*/
  /*
  await page.waitForNavigation();
  await page.waitForNavigation();
  let current_ulr = page.url();
  if (current_ulr == "https://kahoot.it/ranking") {
    await browser.close();
  }
  */
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
