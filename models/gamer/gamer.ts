import { Game } from "../game/game";
import { ItemFirebaseValue } from "../Item/dbfirebase";
import { GamerItem } from "../Item/gameritem/gameritem";
import { buildItem } from "../Item/gameritem/gameritemfactory";
import { Item } from "../Item/item";
import { SpellFirebaseValue } from "../spell/dbfirebase";
import { Spell, SPELLS } from "../spell/spell";
import { buildSpell } from "../spell/spellfactory";
import { GamerFirebaseValue } from "./dbfirebase";
import { MixedValueNumber } from "../mixed/mixedvalue/mixedvalues/mixedvaluenumber";
import { MixedValuePercent } from "../mixed/mixedvalue/mixedvalues/mixedvaluepercent";

const enum GAMER_DEFAULT_STATS {
  HASTE = 0,
  MAX_HEALTH = 100,
  MAX_MANA = 40,
  ITEM_POWER = 1,
  ITEM_EVASION = 5,
  ITEM_MISS = 5,
  ITEM_DEFENSE = 0,
  SPELL_POWER = 1,
  SPELL_EVASION = 5,
  SPELL_MISS = 5,
  SPELL_RESISTANCE = 0,
}

// They are used in calculation of secondary stats so they are much important.
type GamerPrimaryStats = {
  strength: MixedValueNumber,
  agility: MixedValueNumber,
  intelligence: MixedValueNumber,
};

type GamerSecondaryStats = {
  maxHealth: MixedValueNumber,
  maxMana: MixedValueNumber,
  haste: MixedValuePercent,
  itemPower: MixedValueNumber,
  itemEvasion: MixedValuePercent,
  itemMiss: MixedValuePercent,
  itemDefense: MixedValueNumber,
  spellPower: MixedValueNumber,
  spellEvasion: MixedValuePercent,
  spellMiss: MixedValuePercent,
  spellResistance: MixedValueNumber,
};

type GamerStats = GamerPrimaryStats & GamerSecondaryStats;

export class Gamer {
  public name: string;
  public dead: boolean;
  public health: number;
  public lastGameAction: number;
  public mana: number;
  public spells: Spell[];
  public items: GamerItem[];
  public stats: GamerStats;
  private $key: string;
  private game: Game;

  constructor(game: Game, values: GamerFirebaseValue, $key: string) {
    this.$key = $key;
    this.game = game;
    this.lastGameAction = values.lastGameAction;
    this.name = values.name;
    this.dead = values.dead;
    this.health = values.health;
    this.mana = values.mana;
    // Construct spells.
    const spells: Spell[] = [];
    for (const spellKey in values.spells) {
      if (values.spells.hasOwnProperty(spellKey)) {
        const enumSpellKey = spellKey as SPELLS;
        const spell = buildSpell(this, values.spells[ spellKey ], enumSpellKey);
        if (spell !== null) {
          spells.push(spell);
        }
      }
    }
    this.spells = spells;
    // Construct items.
    const items: GamerItem[] = [];
    for (const itemKey in values.items) {
      if (values.items.hasOwnProperty(itemKey)) {
        const item = buildItem(this, values.items[ itemKey ], itemKey);
        if (item !== null) {
          items.push(item);
        }
      }
    }
    this.items = items;
    // Define "PRIMARY" gamer stats.
    const primaryStats = this.initializePrimaryStats(values);
    // Define "SECONDARY" gamer stats based on primary.
    const secondaryStats = this.initializeSecondaryStats(primaryStats);
    // Initialize object stats.
    this.stats = Object.assign(primaryStats, secondaryStats);
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

  public getKey(): string {
    return this.$key;
  }

  public getItem(itemKey: string): Item | null {
    const gamerItem = this.items.find((item) => item.getKey() === itemKey);
    return gamerItem ? gamerItem : null;
  }

  public getSpell(spellKey: string): Spell | null {
    const gamerSpell = this.spells.find((spell) => spell.getKey() === spellKey);
    return gamerSpell ? gamerSpell : null;
  }

  public getGameStats(): string {
    if (this.dead) {
      return `${this.name} DEAD`;
    } else {
      return `\`${this.name}\` :heart:${this.health} :large_blue_diamond:${this.mana}`;
    }
  }

  public updateLastGameAction(time?: number): void {
    this.lastGameAction = time !== undefined ? time : Date.now();
  }

  public getFirebaseValue(): GamerFirebaseValue {
    const items: { [key: string]: ItemFirebaseValue } = {};
    for (const item of this.items) {
      items[ item.getKey() ] = item.getFirebaseValues();
    }
    const spells: { [key: string]: SpellFirebaseValue } = {};
    for (const spell of this.spells) {
      spells[ spell.getKey() ] = spell.getFirebaseValues();
    }
    return Object.assign({}, {
      dead: this.dead,
      health: this.health,
      items,
      lastGameAction: this.lastGameAction,
      mana: this.mana,
      name: this.name,
      spells,
      stats: {
        agility: this.stats.agility.getInitialValue(),
        intelligence: this.stats.intelligence.getInitialValue(),
        strength: this.stats.strength.getInitialValue(),
      },
    });
  }

  private initializePrimaryStats(values: GamerFirebaseValue): GamerPrimaryStats {
    // Define "PRIMARY" stats first.
    const agility = new MixedValueNumber(values.stats.agility);
    const intelligence = new MixedValueNumber(values.stats.intelligence);
    const strength = new MixedValueNumber(values.stats.strength);
    // Alter Primary Stats with all possible ways now.
    // TODO: interface IGamerPrimaryStatsAlterable.
    // TODO: loop through all items which implements interface IGamerPrimaryStatsAlterable. Items(equipped?), Buffs, Debuffs.
    // TODO: LOOP IS HERE...
    // Finalize these values now.
    const agilityFinalValue = agility.finalize();
    const intelligenceFinalValue = intelligence.finalize();
    const strengthFinalValue = strength.finalize();
    return {
      agility,
      intelligence,
      strength,
    };
  }

  private initializeSecondaryStats(primaryStats: GamerPrimaryStats): GamerSecondaryStats {
    const agilityFinalValue = primaryStats.agility.isFinal() ? primaryStats.agility.getFinalValue() as number : 0;
    const intelligenceFinalValue = primaryStats.intelligence.isFinal() ? primaryStats.intelligence.getFinalValue() as number : 0;
    const strengthFinalValue = primaryStats.strength.isFinal() ? primaryStats.strength.getFinalValue() as number : 0;
    // Define secondary stats now.
    const haste = new MixedValuePercent(GAMER_DEFAULT_STATS.HASTE + agilityFinalValue);
    const itemDefense = new MixedValueNumber(GAMER_DEFAULT_STATS.ITEM_DEFENSE);
    const itemEvasion = new MixedValuePercent(GAMER_DEFAULT_STATS.ITEM_EVASION + agilityFinalValue);
    const itemMiss = new MixedValuePercent(Math.max(GAMER_DEFAULT_STATS.ITEM_MISS - agilityFinalValue, 0));
    const itemPower = new MixedValueNumber(GAMER_DEFAULT_STATS.ITEM_POWER + strengthFinalValue);
    const maxHealth = new MixedValueNumber(GAMER_DEFAULT_STATS.MAX_HEALTH + strengthFinalValue);
    const maxMana = new MixedValueNumber(GAMER_DEFAULT_STATS.MAX_MANA + intelligenceFinalValue);
    const spellEvasion = new MixedValuePercent(GAMER_DEFAULT_STATS.SPELL_EVASION + agilityFinalValue);
    const spellMiss = new MixedValuePercent(Math.max(GAMER_DEFAULT_STATS.SPELL_MISS - agilityFinalValue, 0));
    const spellPower = new MixedValueNumber(GAMER_DEFAULT_STATS.SPELL_POWER + intelligenceFinalValue);
    const spellResistance = new MixedValueNumber(GAMER_DEFAULT_STATS.SPELL_RESISTANCE);
    // TODO: interface IGamerSecondaryAlterable.
    // TODO: loop through all items which implements interface IGamerSecondaryAlterable. Items(equipped?), Buffs, Debuffs.
    // TODO: LOOP IS HERE...
    haste.finalize();
    itemEvasion.finalize();
    itemMiss.finalize();
    itemPower.finalize();
    maxHealth.finalize();
    maxMana.finalize();
    spellEvasion.finalize();
    spellMiss.finalize();
    spellPower.finalize();
    return {
      haste,
      itemDefense,
      itemEvasion,
      itemMiss,
      itemPower,
      maxHealth,
      maxMana,
      spellEvasion,
      spellMiss,
      spellPower,
      spellResistance,
    };
  }
}
