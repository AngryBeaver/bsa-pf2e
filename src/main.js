import {Swade} from "./Swade.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.addModule("beavers-crafting")
    beaversSystemInterface.register(new Swade());
});
