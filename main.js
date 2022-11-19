const fs = require("fs");
const frida = require("frida");

const args = process.argv.slice(2);

console.log("args", args);
const game = args[0];
const dir = args[1];

console.log(1);

const execAsync = (...args) =>
  new Promise((resolve, reject) => {
    const child = require("child_process").exec(...args);

    let finalData = "";
    child.stdout.on("data", function (data) {
      finalData += data;
    });
    child.stderr.on("data", function (data) {
      //console.log("stderr: " + data);
      finalData += data;
    });
    child.addListener("error", reject);
    child.addListener("exit", () => resolve(finalData));
  });

const getPIDCommand = `powershell -command "Get-WmiObject Win32_Process -Filter \\"name = '${game}'\\" | Select -ExpandProperty \\"ProcessId\\""`;
const main = async () => {
  /* const pid = await frida.spawn(
    "C:/Users/demogor/AppData/Local/Plarium/PlariumPlay/StandAloneApps/raid/237/start.bat"
  ); */
  console.log(123);
  const pid = await execAsync(getPIDCommand);
  console.log("pid", pid);
  const session = await frida.attach(+pid);
  const source = [`${dir}/run.js`] //["dist/test.js", `${game}/script.js`]
    .map((path) => fs.readFileSync(path, "utf8"))
    .join("\n\n\n");

  /* await new Promise((resolve) => setTimeout(() => {}, 1000));
  await frida.resume(pid); */

  const script = await session.createScript(source);
  script.message.connect((message) => {
    console.log("[*] Message:", message);
  });
  await script.load();
  console.log("[*] Script loaded");

  /* const api = script.exports;
  console.log(await api.getExports()); */
  /*  await api.callFunction(1);
  await api.callFunction(2);
  await api.callFunction(3); */
  /* console.log("[*] Function called three times");

  await script.unload();
  console.log("[*] Script unloaded"); */
};

main();
