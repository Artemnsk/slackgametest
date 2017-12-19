"use strict";

module.exports = statsTitleFactory;

function statsTitleFactory(hp, mana, gold) {
  return {
    text: `:heart:${hp}/40 :large_blue_diamond:${mana}/30 :moneybag:${gold}`,
    color: "#950001",
    callback_id: "/breakmenu",
    attachment_type: "default"
  };
}