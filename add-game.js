const fs = require("fs").promises;
const argv = require("minimist")(process.argv.slice(2));

const { name: gameName, path } = argv;
console.log(argv);

(async () => {
  const json = JSON.parse(await fs.readFile("package.json", "utf-8"));
  json.scripts[
    `start-${path}`
  ] = `node run --folder ${path} --run build,compile,start --process "${gameName}.exe"`;

  await fs.writeFile("package.json", JSON.stringify(json, false, 4));
  console.log(json);
})();
