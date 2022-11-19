const argv = require("minimist")(process.argv.slice(2));

const execAsync = (...args) =>
  new Promise((resolve, reject) => {
    const child = require("child_process").exec(...args);

    let finalData = "";
    child.stdout.on("data", function (data) {
      finalData += data;
      console.log(data);
    });
    child.stderr.on("data", function (data) {
      //console.log("stderr: " + data);
      finalData += data;
      console.log("Error output:", data);
    });
    child.addListener("error", reject);
    child.addListener("exit", () => resolve(finalData));
  });

const commList = {
  build: async (folder) => execAsync(`cd src/${folder} && rimraf dist && tsc`),
  compile: async (folder) =>
    execAsync(
      `frida-compile src/${folder}/dist/${folder}/script.js -o src/${folder}/dist/run.js`
    ),
  start: async (folder, process) =>
    execAsync(`node main "${process}" "src/${folder}/dist"`),
};

(async () => {
  if (!argv.run || !argv.folder) {
    console.error("No runners specified");
    return;
  }

  if (argv.skip) {
    return await commList.start(argv.folder, argv.process);
  }

  const commands = argv.run.split(",") || [];
  for (let comm of commands) {
    try {
      await commList[comm](argv.folder, argv.process);
    } catch (ex) {
      console.error("Command run exception:", ex);
    }
  }
})();
