"use strict";

const /** @type UIRoute */ rootUIRoute = require('./root').uiRoute;
const /** @type UIRoute */ newplayerUIRoute = require('./newplayer').uiRoute;
const /** @type UIRoute */ mainmenuUIRoute = require('./mainmenu').uiRoute;
const /** @type UIRoute */ shopUIRoute = require('./shop').uiRoute;
const /** @type UIRoute */ spellbookUIRoute = require('./spellbook').uiRoute;
const /** @type UIRoute */ spellinfoUIRoute = require('./spellinfo').uiRoute;

// TODO: actually we can make prototype which can be used with reassigning game data for better performance.
class UIRouter {
  /**
   * @param {Team} team
   * @param {Channel} channel
   * @param {?Player} player
   * @constructor
   * @property {Team} team
   * @property {Channel} channel
   * @property {?Player} player
   */
  constructor(team, channel, player) {
    this.team = team;
    this.channel = channel;
    this.player = player
  }

  rootUIRoute() { return rootUIRoute }
  newplayerUIRoute() { return newplayerUIRoute }
  mainmenuUIRoute() { return mainmenuUIRoute }
  shopUIRoute() { return shopUIRoute }
  spellbookUIRoute() { return spellbookUIRoute }
  spellinfoUIRoute() { return spellinfoUIRoute }

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
    } else if (args = this.mainmenuUIRoute().route.match(path)) {
      return this.mainmenuUIRoute().processActions(this, parsedPayload, args);
    } else if (args = this.shopUIRoute().route.match(path)) {
      return this.shopUIRoute().processActions(this, parsedPayload, args);
    } else if (args = this.spellbookUIRoute().route.match(path)) {
      return this.spellbookUIRoute().processActions(this, parsedPayload);
    } else if (args = this.spellinfoUIRoute().route.match(path)) {
      return this.spellinfoUIRoute().processActions(this, parsedPayload, args);
    } else {
      // TODO: error.
    }
  }
}

module.exports = UIRouter;