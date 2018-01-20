import { GameActionCastSpell } from "../../../gameaction/gameactions/gameactioncastspell/gameactioncastspell";

export class GameActionCastSpellFireball extends GameActionCastSpell {
  public execute(): void {
    const spellPower = this.mixedSpellPower.getFinalValue() as number;
    this.initiator.health -= spellPower;
  }
}
