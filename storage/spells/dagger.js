const Spell = require('../../models/spell/spell').Spell;

const dagger = new Spell({
  emoji: ":dagger_knife:",
  id: "dagger",
  label: "Steel Dagger",
  description: "This is simple steel dagger. Nothing special.",
  params: {
    damage: 5
  }
});

module.exports = dagger;