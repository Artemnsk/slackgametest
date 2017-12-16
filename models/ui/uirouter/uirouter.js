"use strict";

const Route = require('route-parser');

const /** @type UIRoute */ rootUIRoute = require('./root');
const /** @type UIRoute */ mainmenuUIRoute = require('./mainmenu');
const /** @type UIRoute */ shopUIRoute = require('./shop');
const /** @type UIRoute */ spellbookUIRoute = require('./spellbook');
const /** @type UIRoute */ spellinfoUIRoute = require('./spellinfo');

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

  /**
   *
   * @param {string} path
   * @param {ParsedSlackActionPayload} [parsedPayload]
   * // TODO: respond with error message, not null!
   * @return {UIMessage}
   */
  getUIMessage(path, parsedPayload) {
    if (rootUIRoute.route.match(path)) {
      return rootUIRoute.getUIMessage(this, parsedPayload);
    } else if (mainmenuUIRoute.route.match(path)) {
      return mainmenuUIRoute.getUIMessage(this, parsedPayload);
    } else if (shopUIRoute.route.match(path)) {
      return shopUIRoute.getUIMessage(this, parsedPayload);
    } else if (spellbookUIRoute.route.match(path)) {
      return spellbookUIRoute.getUIMessage(this, parsedPayload);
    } else if (spellinfoUIRoute.route.match(path)) {
      return spellinfoUIRoute.getUIMessage(this, parsedPayload);
    } else {
      // TODO: error.
    }
  }
}

module.exports = UIRouter;