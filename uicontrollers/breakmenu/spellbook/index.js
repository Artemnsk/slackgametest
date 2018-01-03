"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uiroute_1 = require("../../uiroute");
const spellbookmessagefactory_1 = require("./spellbookmessagefactory");
const processActions = (uiRouter, parsedPayload, args) => {
    // Parse submitted actions to know which window to render.
    // TODO:
    const action = parsedPayload.actions[0];
    switch (action.name) {
        case "spell":
            return uiRouter.spellinfoUIRoute.getUIMessage(uiRouter, { spellId: action.value });
        case "back":
            return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
    }
    const text = "Unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};
const getUIMessage = (uiRouter, args) => {
    if (uiRouter.player === null) {
        const text = "Route validation for /breakmenu/spellbook fails.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
    const path = uiRouter.spellbookUIRoute.route.reverse({});
    if (path !== false) {
        const uiMessage = spellbookmessagefactory_1.spellBookMessageFactory(path, uiRouter.channel, uiRouter.player);
        return Promise.resolve(uiMessage);
    }
    else {
        const text = "Unknown error.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
};
const validateRoute = (uiRouter, path, parsedPayload) => {
    return Promise.resolve(null);
};
exports.uiRoute = new uiroute_1.UIRoute("/breakmenu/spellbook", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map