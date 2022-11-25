// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

const startListeners = () => {
  const callback = function ({ method }, statsToAdd) {
    const obj = statsToAdd as Il2Cpp.Object;
    console.log(obj.field("CollectRange"), obj.field("CollectRange")?.value);
    obj.field("CollectRange").value = 100;
    obj.field("ExperienceModifier").value = 1.5;
    obj.field("CurrencyModifier").value = 10;
    return this.method(method).invoke(statsToAdd);
  };
  updateFunctions(true, "Stats", "SimpleAddStats", callback);
};

async function main() {
  try {
    await Il2Cpp.initialize();
    console.log("Start dump");
    await Il2Cpp.dump("dump.cs");
    Il2Cpp.perform(() => {
      //startListeners();

      const classes = [
        "UIScript.SoulEssenceObject",
        "UIScript.PCSoulEssenceShopPanel_Logic",
      ].map((name) =>
        Il2Cpp.Domain.assembly("Assembly-CSharp").image.class(name)
      );

      Il2Cpp.trace()
        .classes(...classes)
        .filterMethods(
          (method) =>
            ![
              "interpretink",
              "update",
              "TryHidePlayerCharacterRenderTexture",
              "get_Instance",
            ].find((x) => method.name.toLowerCase().includes(x.toLowerCase()))
        )
        .and()
        .attach("detailed");
    });
    console.log("Done");
  } catch (ex) {
    console.error("Exception:", JSON.stringify(ex, false, 4));
  }
}

main();
