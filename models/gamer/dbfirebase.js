"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processFirebaseRawValues(value) {
    return Object.assign(value, {
        items: value.items === undefined ? {} : value.items,
        spells: value.spells === undefined ? {} : value.spells,
    });
}
exports.processFirebaseRawValues = processFirebaseRawValues;
//# sourceMappingURL=dbfirebase.js.map