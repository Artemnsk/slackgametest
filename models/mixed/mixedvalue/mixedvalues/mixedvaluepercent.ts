import { MixedValuePartialPercent } from "../../mixedvaluepartial/mixedvaluepartials/mixedvaluepartialpercent";
import { MixedValue } from "../mixedvalue";

export interface IPartialToPercent {
  calculateForPercent: (mixedValue: MixedValuePercent, currentValue: number) => number;
}

export class MixedValuePercent extends MixedValue<number, IPartialToPercent> {
  protected partials: MixedValuePartialPercent[];

  public calculate(): number {
    return this.partials.reduce((previousValue, currentPartial) => currentPartial.calculateForPercent(this, previousValue), this.initialValue);
  }
}
