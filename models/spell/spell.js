"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rawaction_1 = require("../../models/rawaction/rawaction");
class Spell {
    constructor(spellData) {
        this.emoji = spellData.emoji;
        this.id = spellData.id;
        this.label = spellData.label;
        this.description = spellData.description;
        this.params = spellData.params;
    }
    /**
     * Validate: does gamer able to make cast? Returns true if yes and string with error otherwise.
     */
    validateGamerCast(gamer) {
        if (gamer.dead === true) {
            return "You are dead.";
        }
        else {
            // TODO: there is first extension for mana and mana-free spells.
            if (gamer.spells && gamer.spells[this.id] === true) {
                if (!this.params.manacost || gamer.mana >= this.params.manacost) {
                    return true;
                }
                else {
                    return "You have not enough mana.";
                }
            }
            else {
                return "You have no this spell.";
            }
        }
    }
    /**
     * Returns select Action for uiAttachment with non-dead gamers (even with empty opts).
     */
    getCastForm(callbackId, game, gamer) {
        if (this.validateGamerCast(gamer) === true) {
            const options = [];
            for (const gamerKey in game.gamers) {
                if (game.gamers[gamerKey].dead === false) {
                    options.push({
                        text: game.gamers[gamerKey].name,
                        value: gamerKey,
                    });
                }
            }
            if (options.length > 0) {
                return {
                    name: "target",
                    options,
                    text: "Target",
                    type: "select",
                };
            }
            else {
                return null;
            }
        }
        else {
            // TODO: display "not enough mana" somehow.
            return null;
        }
    }
    /**
     * If promise resolved to false it means that it is simply non-spell action.
     * But if promise being rejected it means that we really wanted to process cast form but error appeared.
     */
    processCastForm(game, gamer, parsedPayload) {
        const action = parsedPayload.actions[0];
        switch (action.name) {
            case "target":
                if (this.validateGamerCast(gamer) === true) {
                    const targetKey = action.selected_options && action.selected_options[0] && action.selected_options[0].value ? action.selected_options[0].value : null;
                    if (targetKey) {
                        const rawActionFirebaseValue = {
                            initiator: gamer.$key,
                            params: {
                                spellId: this.id,
                            },
                            target: targetKey,
                            type: "CAST_SPELL" /* CAST_SPELL */,
                        };
                        return rawaction_1.RawAction.addRawAction(rawActionFirebaseValue, game.$teamKey, game.$channelKey, game.$key)
                            .then(() => Promise.resolve(true));
                    }
                }
                return Promise.resolve(false);
        }
        return Promise.resolve(false);
    }
    /**
     * Responds with array of attachments consists of spell info.
     */
    getSlackInfo(callbackId) {
        const fields = [];
        fields.push({
            short: false,
            title: "Description",
            value: this.description,
        });
        if (this.params && this.params.damage) {
            fields.push({
                short: false,
                title: "Damage",
                value: this.params.damage.toString(10),
            });
        }
        const attachment = {
            attachment_type: "default",
            author_name: `${this.emoji}${this.label}`,
            callback_id: callbackId,
            color: "#3AA3E3",
            fields,
        };
        return [attachment];
    }
}
exports.Spell = Spell;
//# sourceMappingURL=spell.js.map