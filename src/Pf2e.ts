export class Pf2e implements SystemApi {

    get version() {
        return 1;
    }

    get id() {
        return "pf1e";
    }

    async actorRollSkill(actor, skillId){
        return await actor.skills[skillId].check.roll()
    }

    async actorRollAbility(actor, abilityId){
        throw Error("I don't know how to do this, plz fix bsa-pf2e")
    }

    actorSheetAddTab(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string):void {
        const tabs = $(html).find('nav[data-group="primary"]');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '" title="' + tabData.label + '">'+tabData.html+'</a>');
        tabs.append(tabItem);
        const body = $(html).find(".sheet-content");
        const tabContent = $('<div class="tab" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    get configSkills():SkillConfig[] {
        return Object.entries(CONFIG["PF2E"].skillList).map(skills => {
            return {
                id: skills[0],
                label: game["i18n"].localize(skills[1])
            };
        })
    }

    get configAbilities():AbilityConfig[] {
        return Object.entries(CONFIG["PF2E"].abilities).map(ab => {
            return {
                id: ab[0],
                label: game["i18n"].localize(ab[1])
            };
        });
    }

    get configCurrencies():CurrencyConfig[] {
        return [
            {
                id: "pp",
                factor: 1000,
                label: game["i18n"].localize("PF2E.CurrencyPP"),
                uuid: "Compendium.pf2e.equipment-srd.JuNPeK5Qm1w6wpb4",
            },
            {
                id: "gp",
                factor: 100,
                label: game["i18n"].localize("PF2E.CurrencyGP"),
                uuid: "Compendium.pf2e.equipment-srd.B6B7tBWJSqOBz5zz",
            },
            {
                id: "sp",
                factor: 10,
                label: game["i18n"].localize("PF2E.CurrencySP"),
                uuid: "Compendium.pf2e.equipment-srd.5Ew82vBF9YfaiY9f",
            },
            {
                id: "cp",
                factor: 1,
                label: game["i18n"].localize("PF2E.CurrencyCP"),
                uuid: "Compendium.pf2e.equipment-srd.lzJ8AVhRcbFul5fh",
            }
        ]
    }

    get configCanRollAbility():boolean {
        return false;
    }
    get configLootItemType(): string {
        return "treasure";
    }

    get itemPriceAttribute(): string {
        return "system.price";
    }

    get itemQuantityAttribute(): string {
        return "system.quantity";
    }

}
