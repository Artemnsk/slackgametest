"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uiroute_1 = require("../../uiroute");
const shopMessagefactory_1 = require("./shopMessagefactory");
const processActions = (uiRouter, parsedPayload, args) => {
    if (!uiRouter.player) {
        const text = "Player doesn't exist.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
    else if (uiRouter.channel.phase !== "BREAK" /* BREAK */) {
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: "Error: Invalid channel phase to use this menu." });
    }
    // Parse submitted actions to know which window to render.
    // TODO:
    const action = parsedPayload.actions[0];
    switch (action.name) {
        case "back":
            return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
    }
    const text = "Error: unknown.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};
const getUIMessage = (uiRouter, args) => {
    if (!uiRouter.player) {
        const text = "Player doesn't exist.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
    else if (uiRouter.channel.phase !== "BREAK" /* BREAK */) {
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: "Error: Invalid channel phase to use this menu." });
    }
    const path = uiRouter.shopUIRoute.route.reverse({});
    if (path !== false) {
        const uiMessage = shopMessagefactory_1.shopMessageFactory(path, uiRouter.channel, uiRouter.player);
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
exports.uiRoute = new uiroute_1.UIRoute("/breakmenu/shop", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map