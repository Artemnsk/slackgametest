"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route = require("route-parser");
const items_1 = require("../../../storage/items/items");
const uiroute_1 = require("../../uiroute");
const useitemmessagefactory_1 = require("./useitemmessagefactory");
const processActions = (uiRouter, parsedPayload, args) => {
    const action = parsedPayload.actions[0];
    switch (action.name) {
        case "back":
            return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
    }
    // Delegate that to spell now.
    const item = items_1.items.find(currentItem => currentItem.id === args.itemId);
    const itemBeingProcessedPromise = item.processUsageForm(uiRouter.game, uiRouter.gamer, parsedPayload);
    return itemBeingProcessedPromise
        .then((processed) => {
        if (processed) {
            return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
        }
        else {
            // ..proceed with other checks. Currently no other checks.
            // TODO: error?
            return null;
        }
    }, (err) => {
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: `Error: Something went wrong. ${err.message}` });
    });
};
const getUIMessage = (uiRouter, args) => {
    const path = uiRouter.useItemUIRoute.route.reverse(args);
    if (path !== false) {
        const item = items_1.items.find((currentItem) => currentItem.id === args.itemId);
        return Promise.resolve(useitemmessagefactory_1.useItemMessageFactory(path, uiRouter.channel, uiRouter.game, uiRouter.gamer, item));
    }
    else {
        const text = "Route not found.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
};
const validateRoute = (uiRouter, path, parsedPayload) => {
    const validateRoute = new Route("/gamemenu/useitem/:itemId/*");
    const args = validateRoute.match(path);
    if (args !== false) {
        if (!uiRouter.gamer) {
            return Promise.reject({ message: "Error: You are not participate in this game." });
        }
        else if (!items_1.items.find((item) => item.id === args.itemId)) {
            return Promise.reject({ message: "Error: item with this item ID doesn't exist." });
        }
        else if (!uiRouter.gamer.items || uiRouter.gamer.items[args.itemId] !== true) {
            return Promise.reject({ message: "Error: You have no this item." });
        }
    }
    return Promise.resolve(null);
};
exports.uiRoute = new uiroute_1.UIRoute("/gamemenu/useitem/:itemId", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map