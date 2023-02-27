import {Swade} from "./Swade.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new Swade());
});
