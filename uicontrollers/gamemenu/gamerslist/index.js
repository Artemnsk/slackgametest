"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uiroute_1 = require("../../uiroute");
const gamerslistmessagefactory_1 = require("./gamerslistmessagefactory");
const processActions = (uiRouter, parsedPayload, args) => {
    const action = parsedPayload.actions[0];
    switch (action.name) {
        case "navigation":
            switch (action.value) {
                case "back":
                    return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
            }
            break;
    }
    const text = "Unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};
const getUIMessage = (uiRouter, args) => {
    const path = uiRouter.gamersListUIRoute.route.reverse(args);
    if (path !== false) {
        return Promise.resolve(gamerslistmessagefactory_1.gamersListMessageFactory(path, uiRouter.game, uiRouter.gamer));
    }
    else {
        const text = "Unknown error.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
};
const validateRoute = (uiRouter, path, parsedPayload) => {
    return Promise.resolve(null);
};
exports.uiRoute = new uiroute_1.UIRoute("/gamemenu/gamerslist", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map