let totalAnswers = 1;

for (let index = 0; index != 50; index++) {
  let answer = Math.floor(Math.random() * (totalAnswers - 0 + 1)) + 0;

  console.log(answer);
}
