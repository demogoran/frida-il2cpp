const fs = require("fs").promises;
const argv = require("minimist")(process.argv.slice(2));

const {gameName} = argv.name;

(async () => {
  const json = JSON.parse(await fs.readFile("package.json", "utf-8"));
  json.scripts[]
})();
