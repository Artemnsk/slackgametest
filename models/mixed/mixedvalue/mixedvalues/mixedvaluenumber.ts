import { MixedValuePartialNumber } from "../../mixedvaluepartial/mixedvaluepartials/mixedvaluepartialnumber";
import { MixedValue } from "../mixedvalue";

export interface IPartialToNumber {
  calculateForNumber: (mixedValue: MixedValueNumber, currentValue: number) => number;
}

export class MixedValueNumber extends MixedValue<number, IPartialToNumber> {
  public partials: MixedValuePartialNumber[];

  public calculate(): number {
    return this.partials.reduce((previousValue, currentPartial) => currentPartial.calculateForNumber(this, previousValue), this.initialValue);
  }
}
