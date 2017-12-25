const Spell = require('../../models/spell/spell').Spell;

const fireball = new Spell({
  emoji: ":fire:",
  id: "fireball",
  label: "Fireball",
  description: "Send fireball to enemy.",
  params: {
    damage: 10,
    manacost: 12
  },
});

module.exports = fireball;