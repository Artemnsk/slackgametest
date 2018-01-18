import { MixedValuePartialBoolean } from "../../mixedvaluepartial/mixedvaluepartials/mixedvaluepartialboolean";
import { MixedValue } from "../mixedvalue";

export interface IPartialToBoolean {
  calculateForBoolean: (mixedValue: MixedValueBoolean, currentValue: boolean) => boolean;
}

export class MixedValueBoolean extends MixedValue<boolean, IPartialToBoolean> {
  protected partials: MixedValuePartialBoolean[];

  public calculate(): boolean {
    return this.partials.reduce((previousValue, currentPartial) => currentPartial.calculateForBoolean(this, previousValue), this.initialValue);
  }
}
