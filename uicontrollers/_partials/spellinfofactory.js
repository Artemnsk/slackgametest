"use strict";

module.exports = spellInfoFactory;

function spellInfoFactory(spell, callback_id) {
  return {
    author_name: `${spell.emoji}${spell.label}`,
    fields: spell.getInfo(),
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id,
  };
}