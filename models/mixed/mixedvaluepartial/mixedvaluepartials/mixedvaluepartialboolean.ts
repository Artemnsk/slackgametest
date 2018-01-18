import { IPartialToBoolean, MixedValueBoolean } from "../../mixedvalue/mixedvalues/mixedvalueboolean";
import { MixedValuePartial } from "../mixedvaluepartial";

export class MixedValuePartialBoolean extends MixedValuePartial implements IPartialToBoolean {
  protected value: boolean;

  public calculateForBoolean(mixedValue: MixedValueBoolean, currentValue: boolean): boolean {
    return this.value;
  }
}
