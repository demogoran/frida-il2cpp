// @ts-nocheck
import "frida-il2cpp-bridge";
import { addListener, updateFunctions } from "../utils/helpers";

const Packets = {
  Ping: 71,
  OpenMenu: 81,
  CloseMenu: 82,
  Move: 72,
  MovePos: 69,
  Shoot: 48,
  OnHit: 49,
  Pickup: 68,
  OpenChest: 80,
};
const packetsAllowed = [Packets.Pickup];

const isPacketFiltered = (obj) => {
  const packet = Array.from(obj.method("GetPacketData").invoke())[0];
  return (
    !packetsAllowed.includes(packet) &&
    Object.values(Packets).find((x) => x === packet)
  );
};

const onModPacket = (_this, inst) => {
  const packetArray = _this
    .field("_packer")
    .value.field("sendPacket")
    .value.field("packetArray").value;

  const cmd = packetArray.get(0);
  const itemId = packetArray.get(1);
  const itemAmount = packetArray.get(2);

  if (cmd === Packets.Pickup && itemId === 2) {
    console.log(
      "Get item",
      itemAmount,
      itemId,
      _this.method("GetPacketData").invoke()
    );
    console.log("inst", inst);

    if (itemId === 2) {
      for (let i = 0; i < 100; i++) {
        //packetArray.set(2, itemAmount);
        _this.method("PacketSend", 1).invoke(inst);
      }
    }
  }

  //packetArray.set(2, 70);
};

const startListeners = () => {
  updateFunctions(
    true,
    "GameLogic.NetLogic",
    "PacketPrepare",
    function ({ method }, cmd) {
      const result = this.method(method).invoke(cmd);

      if (!isPacketFiltered(this))
        console.log("Packet start: ", cmd, result, "-----");

      return result;
    },
    "Assembly-CSharp-firstpass"
  );

  updateFunctions(
    true,
    "GameLogic.NetLogic",
    "PacketSend",
    function ({ method }, inst) {
      const isFiltered = isPacketFiltered(this);
      if (!isFiltered) onModPacket(this, inst);

      const result = this.method(method, 1).invoke(inst);
      if (!isFiltered) {
        console.log("Packet end: ", result, inst, "-----");
        console.log("PacketData:", this.method("GetPacketData").invoke());
      }
      return result;
    },
    "Assembly-CSharp-firstpass",
    1
  );

  [
    "PacketAddI",
    "PacketAddLong",
    "PacketAddS",
    "PacketAddSL",
    "PacketAddBinaryS",
  ].forEach((x) => {
    updateFunctions(
      true,
      "GameLogic.NetLogic",
      x,
      function ({ method }, value, length) {
        const result = this.method(method).invoke(value, length);
        if (!isPacketFiltered(this))
          console.log("Packet content: ", x, value, length, "-----");

        return result;
      },
      "Assembly-CSharp-firstpass"
    );
  });

  // mod data

  updateFunctions(
    true,
    "PlayerProp",
    "set_Shield",
    function ({ method }, value) {
      const result = this.method(method, 1).invoke(value * 10);
      console.log("Lets set shield", value);
      /* if (!isFiltered) {
        console.log("Packet end: ", result, inst, "-----");
        console.log("PacketData:", this.method("GetPacketData").invoke());
      } */
      return result;
    },
    "Assembly-CSharp",
    1
  );
};

const startListenersSub = () => {
  updateFunctions(
    true,
    "UIScript.PCResurgencePanel_Logic",
    "RefreshRelifeInfo",
    function ({ method }, array) {
      array.set(1, 1);
      array.set(2, 0);
      array.set(3, 1);
      array.set(4, 1);
      const result = this.method(method).invoke(array);
      console.log("RefreshRelifeInfo", array);

      const r = this.method("set_Radius").invoke(100000);
      console.log(this.method("get_Radius").invoke());
      /* if (!isFiltered) {
        console.log("Packet end: ", result, inst, "-----");
        console.log("PacketData:", this.method("GetPacketData").invoke());
      } */
      return result * 2;
    },
    "Assembly-CSharp"
  );

  updateFunctions(
    true,
    "s2cnetaddobject",
    "CreateItemDropObject",
    function ({ method }, iDropID, iPos, iSID, subType, typename, dInfo) {
      const result = this.method(method).invoke(
        iDropID,
        iPos,
        1601,
        subType,
        typename,
        dInfo
      );

      console.log(
        "CreateItemDropObject",
        iDropID,
        iPos,
        iSID,
        subType,
        typename,
        dInfo
      );
      /* if (!isFiltered) {
        console.log("Packet end: ", result, inst, "-----");
        console.log("PacketData:", this.method("GetPacketData").invoke());
      } */
      return result;
    },
    "Assembly-CSharp"
  );
};

async function main() {
  try {
    await Il2Cpp.initialize();
    Il2Cpp.perform(() => {
      //startListeners();
      startListenersSub();

      if (1 === 1) return;

      const classes = [
        /* "GameLogic.NetLogic" */
      ].map((name) =>
        Il2Cpp.Domain.assembly("Assembly-CSharp-firstpass").image.class(name)
      );
      classes.push(
        ...[
          /* "UIScript.PCResurgencePanel_Logic",  */ "SCRelifeData",
          "s2cnetwar",
          "s2cnetaddobject",
          "ItemObject",
          //"Item.ItemManager"
          //"Item.ItemStoreManager"
        ].map((name) =>
          Il2Cpp.Domain.assembly("Assembly-CSharp").image.class(name)
        )
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
              "s2cmove_GS2CMapStopCtrl",
              "s2cnetwar_GS2CWarStatus",
              "s2cnetwar_GS2CWarPaused",
              "SetNetPacketCommandHandler",
              "ShowNewInfo",
              "CheckFull",
              "CloneSelfProp",
              "SetID",
              "C2GSFace",
              "C2GSWarPing",
              "C2GSWarStartPause",
              "GS2CWarPaused",
              "C2GSWarEndPause",
            ].find((x) => {
              const ret = method.name.toLowerCase().includes(x.toLowerCase());
              return ret;
            })
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
