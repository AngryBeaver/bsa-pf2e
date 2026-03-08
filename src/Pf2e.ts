export class Pf2e implements SystemApi {

    get version() {
        return 1;
    }

    get id() {
        return "pf2e";
    }

    async actorRollSkill(actor, skillId){
        return await actor.skills[skillId].check.roll()
    }

    async actorRollAbility(actor, abilityId){
        throw Error("I don't know how to do this, plz fix bsa-pf2e");
        return null;
    }

    actorCurrenciesGet(actor):Currencies {
        const currencies = {cp:0,sp:0,gp:0,pp:0};
        actor.items
          .filter(item => item.type === "treasure" && item.system.category === "coin")
          .forEach(item => {
              currencies.cp +=item.price.value.cp*item.quantity;
              currencies.sp +=item.price.value.sp*item.quantity;
              currencies.gp +=item.price.value.gp*item.quantity;
              currencies.pp +=item.price.value.pp*item.quantity;
          })
        return currencies;
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        const currencyItems = await getCurrencyItems();
        const componentList: Component[] = [];
        Object.entries(currencyItems).forEach(async ([currencyId, currencyItem])=> {
            if (currencyItem) {
                const currencyComponent = beaversSystemInterface.componentFromEntity(currencyItems[currencyId]);
                const list = beaversSystemInterface.itemListComponentFind(actor.items,currencyComponent);
                let foundQuantity = 0;
                list.components.forEach(c=>{foundQuantity+=c.quantity});
                currencyComponent.quantity = currencies[currencyId]-foundQuantity;
                componentList.push(currencyComponent);
            } else {
                console.error("Currency not found plz report this so bsa-pf2e can be adapted again", currencyId);
            }
        })
        await beaversSystemInterface.actorComponentListAdd(actor,componentList)

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

    get actorSheetTabSelector():string{
        return 'nav[data-group="primary"] [data-tab]';
    }

    itemSheetReplaceContent(app, html, element):void {
        html.find('.sheet-navigation').remove();
        html.find('.sheet-tabs').remove();
        const sheetBody = html.find('.sheet-content');
        sheetBody.empty();
        sheetBody.append(element);
    }

    get configSkills():SkillConfig[] {
        if(CONFIG["PF2E"].skillList) {
            return Object.entries(CONFIG["PF2E"].skillList).map(skills => {
                return {
                    id: skills[0],
                    label: game["i18n"].localize(skills[1])
                };
            })
        }
        return Object.entries(CONFIG["PF2E"].skills).map((entry)=>{
            return {
                id: entry[0],
                // @ts-ignore
                label: game["i18n"].localize(entry[1].label)
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
                label: game["i18n"].localize("PF2E.Currency.pp"),
                uuid: "Compendium.pf2e.equipment-srd.JuNPeK5Qm1w6wpb4",
            },
            {
                id: "gp",
                factor: 100,
                label: game["i18n"].localize("PF2E.Currency.gp"),
                uuid: "Compendium.pf2e.equipment-srd.B6B7tBWJSqOBz5zz",
            },
            {
                id: "sp",
                factor: 10,
                label: game["i18n"].localize("PF2E.Currency.sp"),
                uuid: "Compendium.pf2e.equipment-srd.5Ew82vBF9YfaiY9f",
            },
            {
                id: "cp",
                factor: 1,
                label: game["i18n"].localize("PF2E.Currency.cp"),
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
let currencyItems:Record<"cp"|"sp"|"gp"|"pp",any> = {
   cp:undefined,
   sp:undefined,
   gp:undefined,
   pp:undefined
}
export const getCurrencyItems = async () => {

    // @ts-ignore
    if(currencyItems?.cp) return currencyItems;


    try {
        // @ts-ignore
        const t = game.packs.get("pf2e.equipment-srd").search({
            filters: [{
                field: "type",
                value: "treasure"
            }] // @ts-ignore
        }).map(i => foundry.utils.fromUuid(i.uuid))
        const treasures = await Promise.all(t)
        const currencies = treasures.filter(i => i.system.category === "coin");
        currencyItems = {
            cp: currencies.find(i => i.name.includes(game["i18n"].localize("PF2E.Currency.cp"))),
            sp: currencies.find(i => i.name.includes(game["i18n"].localize("PF2E.Currency.sp"))),
            gp: currencies.find(i => i.name.includes(game["i18n"].localize("PF2E.Currency.gp"))),
            pp: currencies.find(i => i.name.includes(game["i18n"].localize("PF2E.Currency.pp"))),
        }
    }catch(e){
        // @ts-ignore
        (game as Game)?.ui?.notifications.error("Failed to load currency items");
    }
    return currencyItems;
}