const Item = require('../../models/item/item').Item;

const dagger = new Item({
  emoji: ":dagger_knife:",
  id: "dagger",
  label: "Steel Dagger",
  description: "This is simple steel dagger. Nothing special.",
  consumable: false,
  quantity: null,
  params: {
    damage: 5
  }
});

module.exports = dagger;