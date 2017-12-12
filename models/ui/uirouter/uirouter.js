"use strict";

const uiRoutes = [];
uiRoutes.push(require('./mainmenu'));
uiRoutes.push(require('./shop'));
uiRoutes.push(require('./spellbook'));
uiRoutes.push(require('./spellinfo'));

module.exports = getUIMessage;

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