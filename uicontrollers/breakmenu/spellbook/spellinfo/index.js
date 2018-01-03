"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spells_1 = require("../../../../storage/spells/spells");
const uiroute_1 = require("../../../uiroute");
const spellinfomessagefactory_1 = require("./spellinfomessagefactory");
const processActions = (uiRouter, parsedPayload, args) => {
    // Parse submitted actions to know which window to render.
    const action = parsedPayload.actions[0];
    switch (action.name) {
        case "back":
            return uiRouter.spellbookUIRoute.getUIMessage(uiRouter, {});
    }
    const text = "Channel is invalid.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};
const getUIMessage = (uiRouter, args) => {
    if (uiRouter.player === null) {
        const text = "Route validation for /breakmenu/spellbook/:spellName fails.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
    const spell = spells_1.spells.find((item) => item.id === args.spellId);
    if (spell) {
        const path = uiRouter.spellinfoUIRoute.route.reverse({ spellName: spell.id });
        if (path !== false) {
            const uiMessage = spellinfomessagefactory_1.spellInfoMessageFactory(path, uiRouter.channel, uiRouter.player, spell);
            return Promise.resolve(uiMessage);
        }
        else {
            const text = "Unknown error.";
            return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
        }
    }
    const text = "Spell not found.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};
const validateRoute = (uiRouter, path, parsedPayload) => {
    return Promise.resolve(null);
};
exports.uiRoute = new uiroute_1.UIRoute("/breakmenu/spellbook/:spellName", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map