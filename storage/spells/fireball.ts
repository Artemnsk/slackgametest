import { Spell } from "../../models/spell/spell";

export const fireball = new Spell({
  description: "Send fireball to enemy.",
  emoji: ":fire:",
  id: "fireball",
  label: "Fireball",
  params: {
    damage: 10,
    manacost: 12,
  },
});
