"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uiroute_1 = require("../uiroute");
const informationmessagefactory_1 = require("./informationmessagefactory");
const processActions = (uiRouter, parsedPayload, args) => {
    // TODO: that is actually bad.
    const action = parsedPayload.actions[0];
    switch (action.name) {
        case informationmessagefactory_1.INFORMATION_MESSAGE_OK:
            switch (action.value) {
                case informationmessagefactory_1.INFORMATION_MESSAGE_OK:
                    return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
            }
            break;
    }
    // Anyway return root if no match.
    return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
};
const getUIMessage = (uiRouter, args) => {
    const buttonText = args.buttonText ? args.buttonText : "Ok";
    const path = uiRouter.informationMessageUIRoute.route.reverse({});
    if (path !== false) {
        const uiMessage = informationmessagefactory_1.informationMessageFactory(path, args.text, buttonText);
        return Promise.resolve(uiMessage);
    }
    else {
        const text = "Error: unknown error.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
};
const validateRoute = (uiRouter, path, parsedPayload) => {
    return Promise.resolve(null);
};
exports.uiRoute = new uiroute_1.UIRoute("/informationmessage", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map