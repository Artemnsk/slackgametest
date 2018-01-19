import { Game, GAME_STEP_RESULTS } from "../../../game/game";
import { GameActionRequestUseItem } from "../../../gameactionrequest/gameactionrequests/gameactionrequestuseitem/gameactionrequestuseitem";
import { Gamer } from "../../../gamer/gamer";
import { UsableGamerItem } from "../../../Item/gameritem/usablegameritem";
import { GAME_ACTION_TYPES, GameAction } from "../../gameaction";

export abstract class GameActionUseItem extends GameAction {
  public initiator: Gamer;
  public target: Gamer;
  public type: GAME_ACTION_TYPES.USE_ITEM;
  protected item: UsableGamerItem;

  constructor(game: Game, gameActionRequest: GameActionRequestUseItem, initiator: Gamer, target: Gamer, item: UsableGamerItem) {
    super(game, gameActionRequest, initiator, target);
    this.item = item;
  }

  // TODO:
  public processGameStep(): Promise<GAME_STEP_RESULTS> {
    // // Now we are going to fill it with all related values. The Game decides which entities have influence on that. Also Game can involve it's own items.
    // let alterables: IGameActionCastSpellMixedValuesAlterable[] = [];
    // // Get all items.
    // if (this.initiator !== null) {
    //   alterables = alterables.concat(this.initiator.items);
    // }
    // if (this.target !== null) {
    //   alterables = alterables.concat(this.target.items);
    // }
    // // TODO: pass game anyway? Maybe less data?
    // // Ability to make action? Not a simple validation.
    // for (const alterable of alterables) {
    //   alterable.alterAbleToAct(this);
    // }
    // // Collect power.
    // for (const alterable of alterables) {
    //   alterable.alterPower(this);
    // }
    // // Miss.
    // for (const alterable of alterables) {
    //   alterable.alterMiss(this);
    // }
    // // Evade.
    // for (const alterable of alterables) {
    //   alterable.alterEvade(this);
    // }
    // // Pre-Hit (TODO: defense).
    // for (const alterable of alterables) {
    //   alterable.alterBeforeUse(this);
    // }
    // // TODO: make action.
    // // After use.
    // for (const alterable of alterables) {
    //   alterable.alterAfterUse(this);
    // }
    // TODO:
    return Promise.resolve(GAME_STEP_RESULTS.ERROR);
  }

  public abstract execute(): void;
}
