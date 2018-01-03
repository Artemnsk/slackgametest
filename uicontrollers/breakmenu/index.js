"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route = require("route-parser");
const uiroute_1 = require("../uiroute");
const breakmenumessagefactory_1 = require("./breakmenumessagefactory");
const processActions = (uiRouter, parsedPayload, args) => {
    // Parse submitted actions to know which window to render.
    // TODO:
    const action = parsedPayload.actions[0];
    switch (action.name) {
        case "spellbook":
            return uiRouter.spellbookUIRoute.getUIMessage(uiRouter, {});
        case "shop":
            return uiRouter.shopUIRoute.getUIMessage(uiRouter, {});
    }
    const text = "Unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};
const getUIMessage = (uiRouter, args) => {
    const path = uiRouter.breakmenuUIRoute.route.reverse({});
    if (path !== false) {
        const uiMessage = breakmenumessagefactory_1.breakMenuMessageFactory(path, uiRouter.channel, uiRouter.player);
        return Promise.resolve(uiMessage);
    }
    else {
        const text = "Channel is invalid.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
};
const validateRoute = (uiRouter, path, parsedPayload) => {
    const validateRoute = new Route("/breakmenu/*");
    if (validateRoute.match(path)) {
        if (!uiRouter.player) {
            return Promise.reject({ message: "Error: Cannot find your player." });
        }
        else if (uiRouter.channel.phase !== "BREAK" /* BREAK */) {
            return Promise.reject({ message: "Error: Invalid channel phase to use this menu." });
        }
    }
    return Promise.resolve(null);
};
exports.uiRoute = new uiroute_1.UIRoute("/breakmenu", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map