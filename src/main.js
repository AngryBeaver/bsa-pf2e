import {swade} from "./swade.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new swade());
});
