const Kahoot = require("kahoot.js-latest");

// Function to join bots with user-defined names and numbers appended
function joinBots(pin, name, botCount) {
  for (let i = 1; i <= botCount; i++) {
    const bot = new Kahoot();
    const botName = `${name}${i}`;
    bot.join(pin, botName)
      .then(() => console.log(`Bot ${botName} joined successfully.`))
      .catch((err) => console.error(`Bot ${botName} failed to join:`, err.message));
  }
}

// Set up DOM interaction when the script is loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("botForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get user inputs from the form
    const pin = document.getElementById("pinInput").value;
    const botName = document.getElementById("botName").value;
    const botCount = parseInt(document.getElementById("botCount").value, 10);

    if (pin && botName && botCount > 0) {
      console.log(`Starting to flood Kahoot game with PIN: ${pin}`);
      joinBots(pin, botName, botCount);
    } else {
      console.error("Please provide valid inputs.");
    }
  });
});
