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

const main = async () => {
  const device = await frida.getUsbDevice();
  const session = await device.attach("Gadget");
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

  await frida.resume("Gadget");

  /* const api = script.exports;
  console.log(await api.getExports()); */
  /*  await api.callFunction(1);
  await api.callFunction(2);
  await api.callFunction(3); */
  /* console.log("[*] Function called three times");

  await script.unload();
  console.log("[*] Script unloaded"); */
};

(async () => {
  try {
    await main();
  } catch (ex) {
    console.error("Attach exception:", ex);
  }
})();
