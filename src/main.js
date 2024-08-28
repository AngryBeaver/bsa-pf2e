import {Pf2e} from "./Pf2e.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new Pf2e());
});

Hooks.on("beavers-system-interface.ready", async function(){
    import("./SkillTest.js")
});