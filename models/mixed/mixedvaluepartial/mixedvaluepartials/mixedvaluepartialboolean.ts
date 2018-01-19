import { IPartialToBoolean, MixedValueBoolean } from "../../mixedvalue/mixedvalues/mixedvalueboolean";
import { MixedValuePartial } from "../mixedvaluepartial";

export class MixedValuePartialBoolean extends MixedValuePartial<boolean> implements IPartialToBoolean {
  public calculateForBoolean(mixedValue: MixedValueBoolean, currentValue: boolean): boolean {
    return this.value;
  }
}
