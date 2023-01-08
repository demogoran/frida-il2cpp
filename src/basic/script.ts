// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

async function main() {
  try {
    await Il2Cpp.initialize();
    Il2Cpp.perform(() => {
      Il2Cpp.dump("dump.cs");
    });
    console.log("Done");
  } catch (ex) {
    console.error("Exception:", JSON.stringify(ex, false, 4));
  }
}

main();
