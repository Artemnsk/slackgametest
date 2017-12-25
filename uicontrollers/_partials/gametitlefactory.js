"use strict";

module.exports = gameTitleFactory;

/**
 *
 * @param {string} callback_id
 * @param {Gamer} gamer
 * @return Object
 */
function gameTitleFactory(callback_id, gamer) {
  return {
    text: `:heart:${gamer.health} :large_blue_diamond:${gamer.mana}`,
    color: "#950001",
    callback_id,
    attachment_type: "default"
  };
}