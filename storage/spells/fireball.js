"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spell_1 = require("../../models/spell/spell");
exports.fireball = new spell_1.Spell({
    description: "Send fireball to enemy.",
    emoji: ":fire:",
    id: "fireball",
    label: "Fireball",
    params: {
        damage: 10,
        manacost: 12,
    },
});
//# sourceMappingURL=fireball.js.map