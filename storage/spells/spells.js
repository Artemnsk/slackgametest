"use strict";

/**
 * @typedef {Object} Spell
 * @property {String} emoji
 * @property {String} id
 * @property {String} label
 * @property {String} description
 * @type {Array<Spell>}
 */
const spells = [
  {
    emoji: ":dagger_knife:",
    id: "dagger",
    label: "Steel Dagger",
    description: "This is simple steel dagger. Nothing special.",
    params: {
      damage: 5
    },
    getInfo: function () {
      return [
        {
          title: "Description",
          value: this.description,
          short: false
        }, {
          title: "Damage",
          value: this.params.damage,
          short: true
        }
      ];
    }
  }, {
    emoji: ":fire:",
    id: "fireball",
    label: "Fireball",
    description: "Send fireball to enemy.",
    params: {
      damage: 10,
      manacost: 12
    },
    getInfo: function () {
      return [
        {
          title: "Description",
          value: this.description,
          short: false
        }, {
          title: "Damage",
          value: this.params.damage,
          short: true
        }, {
          title: "Mana cost",
          value: this.params.manacost,
          short: true
        }
      ];
    }
  }
];

module.exports = spells;