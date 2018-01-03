"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route = require("route-parser");
const spells_1 = require("../../../storage/spells/spells");
const castspellmessagefactory_1 = require("./castspellmessagefactory");
const uiroute_1 = require("../../uiroute");
const processActions = (uiRouter, parsedPayload, args) => {
    const action = parsedPayload.actions[0];
    switch (action.name) {
        case "back":
            return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
    }
    // Delegate that to spell now.
    const spell = spells_1.spells.find((item) => item.id === args.spellId);
    const spellBeingProcessedPromise = spell.processCastForm(uiRouter.game, uiRouter.gamer, parsedPayload);
    return spellBeingProcessedPromise
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
    const spell = spells_1.spells.find((item) => item.id === args.spellId);
    const path = uiRouter.castspellUIRoute.route.reverse(args);
    if (path !== false) {
        return Promise.resolve(castspellmessagefactory_1.castSpellMessageFactory(path, uiRouter.channel, uiRouter.game, uiRouter.gamer, spell));
    }
    else {
        const text = "Unknown error.";
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
};
const validateRoute = (uiRouter, path, parsedPayload) => {
    const validateRoute = new Route("/gamemenu/castspell/:spellId/*");
    const args = validateRoute.match(path);
    if (args !== false) {
        if (!uiRouter.gamer) {
            return Promise.reject({ message: "Error: You are not participate in this game." });
        }
        else if (!spells_1.spells.find((item) => item.id === args.spellId)) {
            return Promise.reject({ message: "Error: spell with this spell ID doesn't exist." });
        }
        else if (!uiRouter.gamer.spells || uiRouter.gamer.spells[args.spellId] !== true) {
            return Promise.reject({ message: "Error: You have no this spell." });
        }
    }
    return Promise.resolve(null);
};
exports.uiRoute = new uiroute_1.UIRoute("/gamemenu/castspell/:spellId", processActions, getUIMessage, validateRoute);
//# sourceMappingURL=index.js.map