// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

const startListeners = () => {
  /* addListener("Assembly-CSharp", "Stats", ["SimpleAddStats"]);
  addListener("Assembly-CSharp", "Stats", ["SimpleMultiplyStats"]);
  addListener("Assembly-CSharp", "Stats", ["CopyStats"]); */

  /* const callback = function ({ method }, _choice, _cost, _width, _showTip) {
    console.log("CATCHED", _choice, _cost, _width, _showTip);
    return this.method(method).invoke(_choice, -10, _width, _showTip);
  };
  updateFunctions(true, "ChoicePremiumManager", "Initialize", callback);
 */

  const callback = function ({ method }, _jsonObj, ...rest) {
    const json = JSON.parse(_jsonObj);
    console.log("json", JSON.stringify(json, null, 4), rest);

    /* json.sto = json.sto.map((x) =>
      x?.body?.ind === "18"
        ? {
            hdr: {
              ind: "1000",
              syn: "1",
            },
            body: {
              ind: "1000",
            },
          }
        : x
    ); */
    const param = Il2Cpp.String.from(JSON.stringify(json));
    const result = this.method(method).invoke(_jsonObj, ...rest);
    //console.log("CATCHED", JSON.stringify(json, null, 4), result);
    return result;
  };
  //updateFunctions(true, "Account", "FromJSONObject", callback);

  console.log("INIT HOOK HERE");
  /* updateFunctions(
    true,
    "SceneStoryManager",
    "PremiumChoicePurchased",
    function ({ method }, _choiceId, _isAboutAvatarCustomisation) {
      const result = this.method(method).invoke(
        _choiceId,
        _isAboutAvatarCustomisation
      );

      console.log("CATCHED", _choiceId, _isAboutAvatarCustomisation, result);
      return true;
    }
  ); */

  //GetIncentAdHardCurrency

  updateFunctions(
    true,
    "PurchasingViewManager",
    "StartPurchaseLogic",
    function ({ method }, _transactionType, _productId) {
      const result = this.method(method).invoke(_transactionType, _productId);

      console.log("Try buy");
      this.method("PurchaseProduct").invoke(_productId);
      this.method("OnPurchaseSuccess").invoke();
      console.log("CATCHED", _transactionType, _productId);
      return result;
    }
  );

  updateFunctions(
    true,
    "GeneralBalance",
    "GetIncentAdHardCurrency",
    function ({ method }, _incentAdIndex) {
      const result = this.method(method).invoke(_incentAdIndex);

      console.log("_incentAdIndex", _incentAdIndex, result);
      return 100;
    }
  );

  updateFunctions(
    true,
    "GeneralBalance",
    "GetIncentAdEnergy",
    function ({ method }, _incentAdIndex) {
      const result = this.method(method).invoke(_incentAdIndex);

      console.log("GetIncentAdEnergy", _incentAdIndex, result);
      return 100;
    }
  );

  /* updateFunctions(
    true,
    "GeneralBalance",
    "GetPremiumChoiceCost",
    function ({ method }, _id) {
      const result = this.method(method).invoke(_id);

      console.log("GetPremiumChoiceCost", _id, result);
      return -100;
    }
  );

  updateFunctions(
    true,
    "GeneralBalance",
    "GetBonusChapterCost",
    function ({ method }) {
      const result = this.method(method).invoke();

      console.log("GetBonusChapterCost", result);
      return -100;
    }
  ); */

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
      /* const SceneLobbyManager2 =
        Il2Cpp.Domain.assembly("Assembly-CSharp").image.class(
          "SceneLobbyManager2"
        );

      console.log(SceneLobbyManager2);

      const obj = new Il2Cpp.Object(Il2Cpp.Api._objectNew(SceneLobbyManager2));
      console.log('obj.method(".ctor")', obj.method);
      const res = obj.method(".ctor").invoke();
      console.log(obj.method("UpdateCurrencyTab"));
      obj.method("UpdateCurrencyTab").invoke(obj, 100, 100); */

      const acc = Il2Cpp.Domain.assembly("Assembly-CSharp")
        .image.class("Account")
        .field("instance");
      const hardCurrency = acc.value.field("hardCurrency");

      //const temp = Memory.alloc(Process.pointerSize);
      //temp.writeInt(1000);

      //acc.value.field("hardCurrency").value = temp;
      hardCurrency.value.method("SetValue").invoke(100500);
      console.log(acc.handle);
      console.log(acc.value.field("hardCurrency").value);

      acc.value.method("Save").invoke();
      /* const acc = Il2Cpp.Domain.assembly("Assembly-CSharp")
        .image.class("Account")
        .field("instance");

      acc.value
        .method("InitPurchasingOffers")
        .invoke(Il2Cpp.String.from(JSON.stringify([{ pid: "sails_offer0" }]))); */

      //if (1 === 1) return;

      //Il2Cpp.dump();
      //startListeners();

      const classes = [
        /*
        //"SceneStoryManager", // on scene do something
        "StorySplashManager",
        "ChoiceStandardManager",
        "ChoicePremiumManager",
        "ChoiceExtendedOneToManyManager",
        "ChoiceExtendedManager",
        "ChoiceStatManager",
        "StoryCurrencyInfoManager",
        "StoryInterfaceHeaderManager", */
        "Account",
        "SceneLobbyManager2",
        "GeneralBalance",
        /* 
        "SceneStoryManager",
        "PurchasingViewManager", */
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
