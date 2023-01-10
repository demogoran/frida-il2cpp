// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

const startListeners = () => {
  /* addListener("Assembly-CSharp", "Stats", ["SimpleAddStats"]);
  addListener("Assembly-CSharp", "Stats", ["SimpleMultiplyStats"]);
  addListener("Assembly-CSharp", "Stats", ["CopyStats"]); */

  const callback = function ({ method }, baseValue, characterData, stat) {
    //const obj = itemXP as Il2Cpp.Object;
    //console.log(obj, this);
    if (stat == "Attract") {
      baseValue = 1000;
    }
    console.log(baseValue, characterData, stat, stat == "Attract");
    //this.field("_poolAmount").value = 10000;
    return this.method(method).invoke(baseValue, characterData, stat);
  };
  updateFunctions(true, "Stats", "ModifyCharacterValue", callback);

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
