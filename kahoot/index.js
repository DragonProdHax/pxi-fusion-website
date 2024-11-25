import Kahoot from "kahoot.js-latest";

document.getElementById("start").addEventListener("click", () => {
  const pin = document.getElementById("game-pin").value;
  const name = document.getElementById("bot-name").value;
  const count = parseInt(document.getElementById("bot-count").value, 10);

  joinBots(pin, name, count);
});

function joinBots(pin, name, botCount) {
  for (let i = 1; i <= botCount; i++) {
    const bot = new Kahoot();
    const botName = `${name}${i}`;
    bot.join(pin, botName)
      .then(() => console.log(`Bot ${botName} joined successfully`))
      .catch(err => console.error(`Bot ${botName} failed to join:`, err));
  }
}
