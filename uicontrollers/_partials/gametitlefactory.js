"use strict";

module.exports = gameTitleFactory;

/**
 *
 * @param {string} callback_id
 * @param {?Gamer} gamer
 * @return Object
 */
function gameTitleFactory(callback_id, gamer) {
  if (!gamer) {
    return {
      text: `you're not participate in this game`,
      color: "#950001",
      callback_id,
      attachment_type: "default"
    };
  } else if (gamer.dead === true) {
    return {
      text: `you're dead`,
      color: "#950001",
      callback_id,
      attachment_type: "default"
    };
  } else {
    return {
      text: `:heart:${gamer.health} :large_blue_diamond:${gamer.mana}`,
      color: "#950001",
      callback_id,
      attachment_type: "default"
    };
  }
}