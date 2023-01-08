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
  build: async (folder) => execAsync(`rimraf dist && npm run build`),
  compile: async (folder) =>
    execAsync(
      `frida-compile dist/${folder}/script.js -o dist/${folder}/run.js`
    ),
  start: async (folder, process) => {
    switch (argv.type) {
      case "android":
        return execAsync(`node main-android "${process}" "src/${folder}/dist"`);
      default:
        return execAsync(`node main "${process}" "dist/${folder}"`);
    }
  },
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
