import "frida-il2cpp-bridge";

async function main() {
  try {
    /* console.log("Initializing", Object.keys(Il2Cpp));
    await Il2Cpp.initialize();
    await Il2Cpp.dump();
    console.log("Initialized"); */
  } catch (ex) {
    console.error("Error:", ex);
  }
}

(async () => {
  try {
    console.log("Start");
    await main();
  } catch (ex) {
    console.log(JSON.stringify(ex.message, null, 4));
  }
})();

export default {};
