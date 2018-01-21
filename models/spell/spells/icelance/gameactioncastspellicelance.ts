import { GameActionCastSpell } from "../../../gameaction/gameactions/gameactioncastspell/gameactioncastspell";

export class GameActionCastSpellIceLance extends GameActionCastSpell {
  public execute(): void {
    const spellPower = this.mixedSpellPower.getFinalValue() as number;
    this.initiator.health -= spellPower;
    if (this.initiator.health < 0) {
      this.initiator.health = 0;
    }
  }
}
