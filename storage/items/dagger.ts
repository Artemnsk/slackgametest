import { Item } from "../../models/Item/item";

export const dagger = new Item({
  consumable: false,
  description: "This is simple steel dagger. Nothing special.",
  emoji: ":dagger_knife:",
  id: "dagger",
  label: "Steel Dagger",
  params: {
    damage: 5,
  },
  quantity: null,
});
