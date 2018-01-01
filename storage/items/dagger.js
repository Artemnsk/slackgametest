"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = require("../../models/Item/item");
exports.dagger = new item_1.Item({
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
//# sourceMappingURL=dagger.js.map