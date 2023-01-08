// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

const startListeners = () => {
  /* addListener("Assembly-CSharp", "Stats", ["SimpleAddStats"]);
  addListener("Assembly-CSharp", "Stats", ["SimpleMultiplyStats"]);
  addListener("Assembly-CSharp", "Stats", ["CopyStats"]); */

  const callback = function ({ method }, itemXP) {
    const obj = itemXP as Il2Cpp.Object;
    console.log(obj);
    //console.log(obj.field("_poolAmount"), obj.field("_poolAmount")?.value);
    //obj.field("_poolAmount").value = 100;
    return this.method(method).invoke(itemXP);
  };
  updateFunctions(true, "ExperienceManager", "AddXP", callback);

  /* updateFunctions(
    true,
    "EliminateSpecificEntitiesObjective",
    ".ctor",
    function ({ method }, id, total) {
      console.log("Elim", id, total);
      return this.method(method).invoke(id, 1);
    }
  ); */
};

async function main() {
  try {
    await Il2Cpp.initialize();
    Il2Cpp.perform(() => {
      startListeners();
    });
    console.log("Done");
  } catch (ex) {
    console.error("Exception:", JSON.stringify(ex, false, 4));
  }
}

main();
