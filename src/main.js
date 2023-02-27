Hooks.on("beavers-system-interface.init", async function () {
    beaversSystemInterface.addModule("bsa-swade");
});

Hooks.once("beavers-system-interface.ready", async function () {

}

import {Swade} from "./Swade.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new Swade());
});
