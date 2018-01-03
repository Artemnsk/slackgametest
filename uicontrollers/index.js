"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uiroute_1 = require("./uiroute");
const processActions = (uiRouter, parsedPayload, args) => {
    const uiMessage = getUIMessage(uiRouter, {});
    return Promise.resolve(uiMessage);
};
const getUIMessage = (uiRouter, args) => {
    if (!uiRouter.player) {
        return uiRouter.newplayerUIRoute.getUIMessage(uiRouter, {});
    }
    switch (uiRouter.channel.phase) {
        case "BREAK" /* BREAK */:
            return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
        case "IN_GAME" /* IN_GAME */:
            // TODO: game menu.
            return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
        default:
            const text = "Channel is invalid.";
            return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
};
const validateRoute = (uiRouter, path, parsedPayload) => {
    return Promise.resolve(null);
};
exports.uiRoute = new uiroute_1.UIRoute("/", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map