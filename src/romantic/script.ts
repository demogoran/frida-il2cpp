// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

const startListeners = () => {
  /* addListener("Assembly-CSharp", "Stats", ["SimpleAddStats"]);
  addListener("Assembly-CSharp", "Stats", ["SimpleMultiplyStats"]);
  addListener("Assembly-CSharp", "Stats", ["CopyStats"]); */

  const callback = function ({ method }, statsToAdd) {
    const obj = statsToAdd as Il2Cpp.Object;
    /* console.log(statsToAdd, obj, obj.class, obj.field, obj.tryField);
    console.log(new Il2Cpp.Object(obj)); */
    console.log(obj.field("CollectRange"), obj.field("CollectRange")?.value);
    obj.field("CollectRange").value = 100;
    obj.field("ExperienceModifier").value = 1.5;
    obj.field("CurrencyModifier").value = 10;
    return this.method(method).invoke(statsToAdd);
  };
  updateFunctions(true, "Stats", "SimpleAddStats", callback);
  updateFunctions(true, "Stats", "SimpleMultiplyStats", callback);
  updateFunctions(true, "Stats", "CopyStats", callback);

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
    console.log("Start dump");
    await Il2Cpp.dump("dump.cs");
    Il2Cpp.perform(() => {
      //startListeners();
      /* Il2Cpp.trace()
        .classes(
          Il2Cpp.Domain.assembly("Assembly-CSharp").image.class(
            "StatsComponent"
          )
        )
        .filterMethods((method) => !method.name.toLowerCase().includes("ctor"))
        .and()
        .attach("detailed"); */
    });
    console.log("Done");
  } catch (ex) {
    console.error("Exception:", JSON.stringify(ex, false, 4));
  }
}

main();
