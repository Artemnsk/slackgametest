import { IPartialToNumber, MixedValueNumber } from "../../mixedvalue/mixedvalues/mixedvaluenumber";
import { MixedValuePartial } from "../mixedvaluepartial";

export class MixedValuePartialNumber extends MixedValuePartial implements IPartialToNumber {
  protected value: number;

  public calculateForNumber(mixedValue: MixedValueNumber, currentValue: number): number {
    return this.value + currentValue;
  }
}
