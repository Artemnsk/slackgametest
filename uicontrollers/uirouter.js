"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const newplayer_1 = require("./newplayer");
const _1 = require("./");
const breakmenu_1 = require("./breakmenu");
const shop_1 = require("./breakmenu/shop");
const spellbook_1 = require("./breakmenu/spellbook");
const spellinfo_1 = require("./breakmenu/spellbook/spellinfo");
const gamemenu_1 = require("./gamemenu");
const castspell_1 = require("./gamemenu/castspell");
const gamerslist_1 = require("./gamemenu/gamerslist");
const useitem_1 = require("./gamemenu/useitem");
const informationmessage_1 = require("./informationmessage");
// TODO: actually we can make prototype which can be used with reassigning game data for better performance.
class UIRouter {
    constructor(team, channel, player, game, gamer) {
        this.team = team;
        this.channel = channel;
        this.player = player;
        this.game = game;
        this.gamer = gamer;
        // Define UIRoutes.
        this.informationMessageUIRoute = informationmessage_1.uiRoute;
        this.rootUIRoute = _1.uiRoute;
        this.newplayerUIRoute = newplayer_1.uiRoute;
        this.breakmenuUIRoute = breakmenu_1.uiRoute;
        this.shopUIRoute = shop_1.uiRoute;
        this.spellbookUIRoute = spellbook_1.uiRoute;
        this.spellinfoUIRoute = spellinfo_1.uiRoute;
        this.gamemenuUIRoute = gamemenu_1.uiRoute;
        this.castspellUIRoute = castspell_1.uiRoute;
        this.useItemUIRoute = useitem_1.uiRoute;
        this.gamersListUIRoute = gamerslist_1.uiRoute;
    }
    getUIMessage(path, parsedPayload) {
        // In case we have no parsed payload - that actually means that user loads app menu first time via Slack command.
        if (parsedPayload === undefined) {
            return this.rootUIRoute.getUIMessage(this, {});
        }
        const uiRoutes = [
            this.informationMessageUIRoute,
            this.rootUIRoute,
            this.newplayerUIRoute,
            this.breakmenuUIRoute,
            this.shopUIRoute,
            this.spellbookUIRoute,
            this.spellinfoUIRoute,
            this.gamemenuUIRoute,
            this.castspellUIRoute,
            this.useItemUIRoute,
            this.gamersListUIRoute,
        ];
        return this.getValidateFunctionsPromiseChain(uiRoutes, path, parsedPayload)
            .then(() => {
            for (const uiRoute of uiRoutes) {
                const args = uiRoute.route.match(path);
                if (args !== false) {
                    return uiRoute.processActions(this, parsedPayload, args);
                }
            }
            // ..otherwise route not found.
            const text = "Route not found.";
            return this.informationMessageUIRoute.getUIMessage(this, { text });
        }, (err) => {
            return this.informationMessageUIRoute.getUIMessage(this, { text: err.message });
        });
    }
    /**
     * Loop through array of UIRoutes and validate each route in chain until all routes validated or error appears.
     */
    getValidateFunctionsPromiseChain(arr, path, parsedPayload) {
        // Copy init array to not break it.
        const arrCopy = [...arr];
        const firstItem = arrCopy.shift();
        if (firstItem !== undefined) {
            return firstItem.validateRoute(this, path, parsedPayload)
                .then(() => this.getValidateFunctionsPromiseChain(arrCopy, path, parsedPayload));
        }
        return Promise.resolve(null);
    }
}
exports.UIRouter = UIRouter;
//# sourceMappingURL=uirouter.js.map