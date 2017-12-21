"use strict";

const /** @type UIRoute */ informationMessageUIRoute = require('./informationmessage').uiRoute;
const /** @type UIRoute */ rootUIRoute = require('./root').uiRoute;
const /** @type UIRoute */ newplayerUIRoute = require('./newplayer').uiRoute;
const /** @type UIRoute */ breakmenuUIRoute = require('./breakmenu').uiRoute;
const /** @type UIRoute */ shopUIRoute = require('./shop').uiRoute;
const /** @type UIRoute */ spellbookUIRoute = require('./spellbook').uiRoute;
const /** @type UIRoute */ spellinfoUIRoute = require('./spellinfo').uiRoute;
const /** @type UIRoute */ gamemenuUIRoute = require('./gamemenu').uiRoute;

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
   */
  constructor(team, channel, player, game) {
    this.team = team;
    this.channel = channel;
    this.player = player;
    this.game = game;
  }

  informationMessageUIRoute() { return informationMessageUIRoute }
  rootUIRoute() { return rootUIRoute }
  newplayerUIRoute() { return newplayerUIRoute }
  breakmenuUIRoute() { return breakmenuUIRoute }
  shopUIRoute() { return shopUIRoute }
  spellbookUIRoute() { return spellbookUIRoute }
  spellinfoUIRoute() { return spellinfoUIRoute }
  gamemenuUIRoute() { return gamemenuUIRoute }

  /**
   *
   * @param {string} path
   * @param {ParsedSlackActionPayload} [parsedPayload]
   * // TODO: respond with error message, not null!
   * @return {UIMessage|Promise.<UIMessage,Error>}
   */
  getUIMessage(path, parsedPayload) {
    var args;
    // TODO: simply foreach.
    if (args = this.rootUIRoute().route.match(path)) {
      return this.rootUIRoute().processActions(this, parsedPayload, args);
    } else if (args = this.newplayerUIRoute().route.match(path)) {
      return this.newplayerUIRoute().processActions(this, parsedPayload, args);
    } else if (args = this.breakmenuUIRoute().route.match(path)) {
      return this.breakmenuUIRoute().processActions(this, parsedPayload, args);
    } else if (args = this.shopUIRoute().route.match(path)) {
      return this.shopUIRoute().processActions(this, parsedPayload, args);
    } else if (args = this.spellbookUIRoute().route.match(path)) {
      return this.spellbookUIRoute().processActions(this, parsedPayload);
    } else if (args = this.spellinfoUIRoute().route.match(path)) {
      return this.spellinfoUIRoute().processActions(this, parsedPayload, args);
    } else if (args = this.informationMessageUIRoute().route.match(path)) {
      return this.informationMessageUIRoute().processActions(this, parsedPayload, args);
    } else if (args = this.gamemenuUIRoute().route.match(path)) {
      return this.gamemenuUIRoute().processActions(this, parsedPayload, args);
    } else {
      let text = 'Route not found.';
      return this.informationMessageUIRoute().getUIMessage(this, { text })
    }
  }
}

module.exports = UIRouter;