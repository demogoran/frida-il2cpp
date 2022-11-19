// @ts-nocheck
import "frida-il2cpp-bridge";

async function startListeners() {
  addListener("Assembly-CSharp", "Item", ["SetItemData"]);
}

async function main() {
  try {
    await Il2Cpp.initialize();
    console.log("Start dump");
    await Il2Cpp.dump();
    console.log("Done");
  } catch (ex) {
    console.error("Exception:", JSON.stringify(ex, false, 4));
  }
}

main();
