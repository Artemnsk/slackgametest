import { Game, GAME_STEP_RESULTS } from "../game/game";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { Gamer } from "../gamer/gamer";
import { IAlterableGameActionMixedValues } from "../iusable/ialterable";
import { MixedValuePartial } from "../mixed/mixedvaluepartial/mixedvaluepartial";

export const enum GAME_ACTION_TYPES {
  CAST_SPELL = "CAST_SPELL",
  USE_ITEM = "USE_ITEM",
}

export const enum ALTERATION_TYPES {
  TARGET = "TARGET",
  INITIATOR = "INITIATOR",
}

export type AlterableWithType = {
  alterable: IAlterableGameActionMixedValues,
  type: ALTERATION_TYPES,
};

type AlterableGAData = {
  owner: IAlterableGameActionMixedValues,
  data: object,
};

export abstract class GameAction {
  public type: GAME_ACTION_TYPES;
  public initiator: Gamer;
  public target: Gamer;
  public created: number;
  protected game: Game;
  protected alterableGADataStorage: AlterableGAData[];

  constructor(game: Game, gameActionRequest: GameActionRequest, initiator: Gamer, target: Gamer) {
    this.game = game;
    switch (gameActionRequest.type) {
      case GAME_ACTION_REQUEST_TYPES.CAST_SPELL:
        this.type = GAME_ACTION_TYPES.CAST_SPELL;
        break;
      case GAME_ACTION_REQUEST_TYPES.USE_ITEM:
        this.type = GAME_ACTION_TYPES.USE_ITEM;
        break;
    }
    this.initiator = initiator;
    this.target = target;
    this.created = gameActionRequest.created;
    this.alterableGADataStorage = [];
  }

  public getTeamKey(): string {
    return this.game.getTeamKey();
  }

  public getChannelKey(): string {
    return this.game.getChannelKey();
  }

  public getGameKey(): string {
    return this.game.getKey();
  }

  public processGameStep(): Promise<GAME_STEP_RESULTS> {
    const alterables = this.getAlterablesWithType();
    this.finalizeMixedValues(alterables);
    const gameActions = this.calculateAndExecute(alterables);
    // TODO: execute collected gameActions. Maybe some additional class for non-alterable game actions which contains of exact values?
    return Promise.resolve(GAME_STEP_RESULTS.DEFAULT);
  }

  public abstract execute(): void;

  protected abstract calculateAndExecute(alterables: AlterableWithType[]): GameAction[];

  protected abstract finalizeMixedValues(alterablesWithType: AlterableWithType[]): void;

  /**
   * That is a storage for each alterable item which can be used for sharing info between different phases.
   */
  protected getAlterableGAData(alterable: IAlterableGameActionMixedValues): object {
    let data = this.alterableGADataStorage.find((item) => item.owner === alterable);
    if (data === undefined) {
      data = {
        data: {},
        owner: alterable,
      };
      this.alterableGADataStorage.push(data);
    }
    return data;
  }

  protected callAlterationForUsedAlterables(alterablesWithType: AlterableWithType[], partials: Array<MixedValuePartial<any>>, alteredValue: string): GameAction[] {
    const gameActions = [];
    for (const partial of partials) {
      const alterableWithType = alterablesWithType.find((item) => item.alterable === partial.getOwner());
      if (alterableWithType !== undefined) {
        gameActions.push(...alterableWithType.alterable.alterBeingUsedInGameActionMixedValue(alteredValue, this, alterableWithType.type, this.getAlterableGAData(alterableWithType.alterable)));
      }
    }
    return gameActions;
  }

  protected getAlterablesWithType(): AlterableWithType[] {
    const initiatorAlterableItems: AlterableWithType[] = this.initiator.items.map((item) => {
      return {
        alterable: item,
        type: ALTERATION_TYPES.INITIATOR,
      };
    });
    const targetAlterableItems: AlterableWithType[] = this.target.items.map((item) => {
      return {
        alterable: item,
        type: ALTERATION_TYPES.TARGET,
      };
    });
    return [...initiatorAlterableItems, ...targetAlterableItems];
  }
}
