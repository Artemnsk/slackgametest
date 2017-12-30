"use strict";

module.exports = itemInfoFactory;

/**
 * // TODO: put all this into item class!
 * @param {Item} item
 * @param {string} callback_id
 * @return Object
 */
function itemInfoFactory(item, callback_id) {
  return {
    author_name: `${item.emoji}${item.label}`,
    fields: item.getInfo(),
    color: "#3AA3E3",
    attachment_type: "default",
    callback_id,
  };
}