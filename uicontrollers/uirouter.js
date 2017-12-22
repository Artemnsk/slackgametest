"use strict";

const /** @type UIRoute */ informationMessageUIRoute = require('./informationmessage/index').uiRoute;
const /** @type UIRoute */ rootUIRoute = require('./index').uiRoute;
const /** @type UIRoute */ newplayerUIRoute = require('./newplayer/index').uiRoute;
const /** @type UIRoute */ breakmenuUIRoute = require('./breakmenu/index').uiRoute;
const /** @type UIRoute */ shopUIRoute = require('./breakmenu/shop/index').uiRoute;
const /** @type UIRoute */ spellbookUIRoute = require('./breakmenu/spellbook/index').uiRoute;
const /** @type UIRoute */ spellinfoUIRoute = require('./breakmenu/spellbook/spellinfo/index').uiRoute;
const /** @type UIRoute */ gamemenuUIRoute = require('./gamemenu/index').uiRoute;

// TODO: actually we can make prototype which can be used with reassigning game data for better performance.
class UIRouter {
  /**
   * @param {Team} team
   * @param {Channel} channel
   * @param {?Player} player
   * @param {?Game} game
   * @constructor
   * @property {Team} team
   * @property {Channel} channel
   * @property {?Player} player
   * @property {?Game} game
   * @property {UIRoute} informationMessageUIRoute
   * @property {UIRoute} rootUIRoute
   * @property {UIRoute} newplayerUIRoute
   * @property {UIRoute} breakmenuUIRoute
   * @property {UIRoute} shopUIRoute
   * @property {UIRoute} spellbookUIRoute
   * @property {UIRoute} spellinfoUIRoute
   * @property {UIRoute} gamemenuUIRoute
   */
  constructor(team, channel, player, game) {
    this.team = team;
    this.channel = channel;
    this.player = player;
    this.game = game;
    // Define UIRoutes.
    this.informationMessageUIRoute = informationMessageUIRoute;
    this.rootUIRoute = rootUIRoute;
    this.newplayerUIRoute = newplayerUIRoute;
    this.breakmenuUIRoute = breakmenuUIRoute;
    this.shopUIRoute = shopUIRoute;
    this.spellbookUIRoute = spellbookUIRoute;
    this.spellinfoUIRoute = spellinfoUIRoute;
    this.gamemenuUIRoute = gamemenuUIRoute;
  }

  /**
   *
   * @param {string} path
   * @param {ParsedSlackActionPayload} [parsedPayload]
   * @return {UIMessage|Promise.<UIMessage,Error>}
   */
  getUIMessage(path, parsedPayload) {
    var args;
    // TODO: simply foreach.
    if (args = this.rootUIRoute.route.match(path)) {
      return this.rootUIRoute.processActions(this, parsedPayload, args);
    } else if (args = this.newplayerUIRoute.route.match(path)) {
      return this.newplayerUIRoute.processActions(this, parsedPayload, args);
    } else if (args = this.breakmenuUIRoute.route.match(path)) {
      return this.breakmenuUIRoute.processActions(this, parsedPayload, args);
    } else if (args = this.shopUIRoute.route.match(path)) {
      return this.shopUIRoute.processActions(this, parsedPayload, args);
    } else if (args = this.spellbookUIRoute.route.match(path)) {
      return this.spellbookUIRoute.processActions(this, parsedPayload);
    } else if (args = this.spellinfoUIRoute.route.match(path)) {
      return this.spellinfoUIRoute.processActions(this, parsedPayload, args);
    } else if (args = this.informationMessageUIRoute.route.match(path)) {
      return this.informationMessageUIRoute.processActions(this, parsedPayload, args);
    } else if (args = this.gamemenuUIRoute.route.match(path)) {
      return this.gamemenuUIRoute.processActions(this, parsedPayload, args);
    } else {
      let text = 'Route not found.';
      return this.informationMessageUIRoute.getUIMessage(this, { text })
    }
  }
}

module.exports = UIRouter;