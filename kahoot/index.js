import Kahoot from "/node_modules/kahoot.js-latest";

document.getElementById("start").addEventListener("click", () => {
  const pin = document.getElementById("game-pin").value;
  const name = document.getElementById("bot-name").value;
  const count = parseInt(document.getElementById("bot-count").value, 10);

  joinTestAPI(pin, name, count);
});

function joinTestAPI(pin, name, botCount) {
  for (let i = 1; i <= botCount; i++) {
    const test = new Kahoot();
    const testname = `${name}${i}`;
    test.join(pin, testname)
      .then(() => console.log(`test ${testname} joined successfully`))
      .catch(err => console.error(`test ${testname} failed to join:`, err));
  }
}

// This is not neede anymore this was just for a test
