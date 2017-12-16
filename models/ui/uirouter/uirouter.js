"use strict";

const uiRoutes = [];
uiRoutes.push(require('./mainmenu'));
uiRoutes.push(require('./shop'));
uiRoutes.push(require('./spellbook'));
uiRoutes.push(require('./spellinfo'));

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
   * @param {string} route
   * @param {ParsedSlackActionPayload} parsedPayload
   * // TODO: respond with error message, not null!
   * @return {null}
   */
  getUIMessage(route, parsedPayload) {
    let args;
    // TODO: better loop.
    for (let i = 0; i < uiRoutes.length; i++) {
      args = uiRoutes[i].route.match(route);
      // TODO: check type; e.g. no args case but still match.
      if (args) {
        return uiRoutes[i].callback(parsedPayload, args);
      }
    }
    return null;
  }
}

/**
 *
 * @param {String} route
 * @return {null|UIMessage}
 */
function getUIMessage(route, actionData) {
  let args;
  // TODO: better loop.
  for (let i = 0; i < uiRoutes.length; i++) {
    args = uiRoutes[i].route.match(route);
    // TODO: check type; e.g. no args case but still match.
    if (args) {
      return uiRoutes[i].callback(actionData, args);
    }
  }
  return null;
}

module.exports = UIRouter;