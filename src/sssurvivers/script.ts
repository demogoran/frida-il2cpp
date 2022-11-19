// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

const startListeners = () => {
  /* addListener("Assembly-CSharp", "Stats", ["SimpleAddStats"]);
  addListener("Assembly-CSharp", "Stats", ["SimpleMultiplyStats"]);
  addListener("Assembly-CSharp", "Stats", ["CopyStats"]); */

  updateFunctions(
    true,
    "Stats",
    "SimpleAddStats",
    function ({ method }, statsToAdd) {
      console.log(method, statsToAdd);
      const result = this.method(method).invoke(statsToAdd);
      console.log(method, "result", result);
      return result;
    }
  );
};

async function main() {
  try {
    await Il2Cpp.initialize();
    console.log("Start dump");
    //await Il2Cpp.dump("dump.cs");
    Il2Cpp.perform(() => {
      startListeners();
    });
    console.log("Done");
  } catch (ex) {
    console.error("Exception:", JSON.stringify(ex, false, 4));
  }
}

main();
