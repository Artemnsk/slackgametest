import { IPartialToNumber, MixedValueNumber } from "../../mixedvalue/mixedvalues/mixedvaluenumber";
import { IPartialToPercent, MixedValuePercent } from "../../mixedvalue/mixedvalues/mixedvaluepercent";
import { MixedValuePartial } from "../mixedvaluepartial";

export class MixedValuePartialPercent extends MixedValuePartial<number> implements IPartialToPercent, IPartialToNumber {
  public calculateForPercent(mixedValue: MixedValuePercent, currentValue: number): number {
    return this.value + currentValue;
  }

  public calculateForNumber(mixedValue: MixedValueNumber, currentValue: number): number {
    return this.value / 100 * mixedValue.getInitialValue() + currentValue;
  }
}
