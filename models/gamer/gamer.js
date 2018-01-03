"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const items_1 = require("../../storage/items/items");
const spells_1 = require("../../storage/spells/spells");
class Gamer {
    constructor(values) {
        this.name = values.name;
        this.dead = values.dead;
        this.health = values.health;
        this.mana = values.mana;
        this.spells = values.spells ? values.spells : {};
        this.items = values.items ? values.items : {};
        this.$key = values.$key;
        this.$gameKey = values.$gameKey;
        this.$channelKey = values.$channelKey;
        this.$teamKey = values.$teamKey;
    }
    getGameStats() {
        if (this.dead) {
            return `${this.name} DEAD`;
        }
        else {
            return `\`${this.name}\` :heart:${this.health} :large_blue_diamond:${this.mana}`;
        }
    }
    // TODO: maybe Game stores all spells and gamer uses Game?
    getSpells() {
        return spells_1.spells.filter((spell) => this.spells && this.spells[spell.id] === true);
    }
    // TODO: maybe Game stores all items and gamer uses Game?
    getItems() {
        return items_1.items.filter((item) => this.items && this.items[item.id] === true);
    }
    getFirebaseValue() {
        return Object.assign({}, {
            dead: this.dead,
            health: this.health,
            items: this.items,
            mana: this.mana,
            name: this.name,
            spells: this.spells,
        });
    }
}
exports.Gamer = Gamer;
//# sourceMappingURL=gamer.js.map