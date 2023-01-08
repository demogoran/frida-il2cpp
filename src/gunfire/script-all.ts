// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

const startListeners = () => {
  const callback = function ({ method }) {
    const obj = this as Il2Cpp.Object;
    const result = obj.method(method).invoke();

    console.log("-----");

    console.log(obj.class.name, result);
    const res = obj.class.fields.map((x) => {
      return [x.name, obj.tryField(x.name)?.value];
    });
    console.log("Fields: ", res.join("\n"), "-----");

    return result;
  };
  updateFunctions(true, "PCCharaterPanelManager", ".ctor", callback);
};

async function main() {
  try {
    await Il2Cpp.initialize();
    console.log("Start dump");
    //await Il2Cpp.dump("dump.cs");
    Il2Cpp.perform(() => {
      //startListeners();

      const classes = [
        /* "UIScript.SoulEssenceObject",
        "UIScript.PCSoulEssenceShopPanel_Logic",
        "UIScript.ShopObject",
        "UIScript.PCWarShopPanel_logic",
        "UIScript.warshop_PCunit",
        "CharaterData",
        "s2ctalent",
        "TalentObject",
        "homecontainer",
        "PCCharaterPanelManager",
        "PCDescItemBase",
        "UIScript.PCResurgencePanel_Logic",
        "DataHelper.ItemData",
        //"DataHelper.DataBase",
        "CommonDefine.DropDefine", */

        /* "UIScript.PCRecordInfo",
        "DYPublic.Duonet.S2CDuoNet", */
        //"GameLogic.FSLogicNetObject",
        "GameLogic.NetLogic",
      ].map((name) =>
        //Il2Cpp.Domain.assembly("Assembly-CSharp").image.class(name)
        Il2Cpp.Domain.assembly("Assembly-CSharp-firstpass").image.class(name)
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
              "s2cframe_GS2CFightLoop",
              ".ctor",
              "DYPublic.Duonet.S2CDuoNet.s2cmove_GS2CMapStopCtrl",
              "DYPublic.Duonet.S2CDuoNet.s2cnetwar_GS2CWarStatus",
              "DYPublic.Duonet.S2CDuoNet.s2cnetwar_GS2CWarPaused",
              "SetNetPacketCommandHandler",
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
